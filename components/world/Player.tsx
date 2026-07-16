"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Group, MathUtils, Mesh, Quaternion, Vector3 } from "three";
import { useWorldStore } from "@/store/useWorldStore";

const keys = new Set<string>();
const forward = new Vector3();
const rotation = new Quaternion();
const yAxis = new Vector3(0, 1, 0);

function readInput(mobileControl: { x: number; y: number }) {
  const throttle =
    (keys.has("w") || keys.has("arrowup") ? 1 : 0) +
    (keys.has("s") || keys.has("arrowdown") ? -1 : 0) +
    mobileControl.y;
  const steer =
    (keys.has("a") || keys.has("arrowleft") ? 1 : 0) +
    (keys.has("d") || keys.has("arrowright") ? -1 : 0) -
    mobileControl.x;

  return {
    throttle: MathUtils.clamp(throttle, -1, 1),
    steer: MathUtils.clamp(steer, -1, 1),
    boost: keys.has("shift"),
    brake: keys.has(" "),
  };
}

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const vehicle = useRef<Group>(null);
  const wheelRefs = useRef<Mesh[]>([]);
  const speedRef = useRef(0);
  const yawRef = useRef(0);
  const wheelSpinRef = useRef(0);
  const telemetryTimer = useRef(0);
  const lastSafePosition = useRef<[number, number, number]>([0, 1, 0]);

  const mobileControl = useWorldStore((state) => state.mobileControl);
  const resetSpawnSignal = useWorldStore((state) => state.resetSpawnSignal);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      keys.add(key);

      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", " ", "shift"].includes(key)) {
        event.preventDefault();
      }

      const state = useWorldStore.getState();
      if (key === "r") {
        state.returnToSpawn();
      }
      if (key === "m") {
        state.toggleMap();
      }
      if (key === "escape") {
        state.closePanel();
      }
      if ((key === "e" || key === "enter") && state.selectedBuilding) {
        state.openPanel(state.selectedBuilding);
      }
    };

    const up = (event: KeyboardEvent) => {
      keys.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      keys.clear();
    };
  }, []);

  useEffect(() => {
    const rigidBody = body.current;
    if (!rigidBody) {
      return;
    }

    speedRef.current = 0;
    yawRef.current = 0;
    wheelSpinRef.current = 0;
    lastSafePosition.current = [0, 1, 0];
    rigidBody.setTranslation({ x: 0, y: 1, z: 0 }, true);
    rigidBody.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }, [resetSpawnSignal]);

  useFrame((_, delta) => {
    const rigidBody = body.current;
    if (!rigidBody) {
      return;
    }

    const state = useWorldStore.getState();
    const panelOpen = state.isPanelOpen;
    const input = panelOpen ? { throttle: 0, steer: 0, boost: false, brake: true } : readInput(mobileControl);

    const speed = speedRef.current;
    const absSpeed = Math.abs(speed);
    const maxForward = input.boost ? 7.2 : 5.2;
    const maxReverse = -2.2;
    const acceleration = input.boost ? 8.6 : 6.2;
    const reverseAcceleration = 4.4;
    const drag = input.brake || panelOpen ? 8.5 : 2.35;
    const targetSpeed =
      input.throttle > 0 ? maxForward * input.throttle : input.throttle < 0 ? maxReverse * -input.throttle : 0;
    const accelRate = targetSpeed >= speed ? acceleration : reverseAcceleration;

    if (input.throttle !== 0) {
      speedRef.current = MathUtils.damp(speed, targetSpeed, accelRate, delta);
    } else {
      speedRef.current = MathUtils.damp(speed, 0, drag, delta);
    }

    const steeringGrip = MathUtils.clamp(1 - absSpeed / 9, 0.34, 0.95);
    const steerStrength = (1.9 * steeringGrip + 0.35) * MathUtils.clamp(absSpeed + 0.4, 0, 1.5);
    yawRef.current += input.steer * steerStrength * delta * Math.sign(speedRef.current || 1);

    if (keys.has(" ") && !panelOpen) {
      const velocity = rigidBody.linvel();
      if (Math.abs(velocity.y) < 0.08) {
        rigidBody.applyImpulse({ x: 0, y: 1.35, z: 0 }, true);
      }
    }

    forward.set(Math.sin(yawRef.current), 0, Math.cos(yawRef.current));
    const currentVel = rigidBody.linvel();
    rigidBody.setLinvel(
      {
        x: forward.x * speedRef.current,
        y: currentVel.y,
        z: forward.z * speedRef.current,
      },
      true,
    );

    rotation.setFromAxisAngle(yAxis, yawRef.current);
    rigidBody.setRotation(rotation, true);
    rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);

    const position = rigidBody.translation();
    if (position.y > 0.25 && position.y < 1.8 && Math.hypot(position.x, position.z) < 8.8) {
      lastSafePosition.current = [position.x, Math.max(position.y, 0.95), position.z];
    }

    if (position.y < -3.2 || Math.hypot(position.x, position.z) > 10.9) {
      const [x, y, z] = lastSafePosition.current;
      speedRef.current = 0;
      rigidBody.setTranslation({ x, y, z }, true);
      rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    wheelSpinRef.current += speedRef.current * delta * 5.2;
    for (const wheel of wheelRefs.current) {
      if (wheel) {
        wheel.rotation.x = wheelSpinRef.current;
      }
    }

    if (vehicle.current) {
      const bodyRoll = -input.steer * Math.min(absSpeed / 6, 1) * 0.08;
      const nosePitch = -speedRef.current * 0.012;
      vehicle.current.rotation.z = MathUtils.damp(vehicle.current.rotation.z, bodyRoll, 8, delta);
      vehicle.current.rotation.x = MathUtils.damp(vehicle.current.rotation.x, nosePitch, 7, delta);
    }

    telemetryTimer.current += delta;
    if (telemetryTimer.current > 0.045) {
      telemetryTimer.current = 0;
      const next = rigidBody.translation();
      state.setVehicleTelemetry({
        position: [next.x, next.y, next.z],
        heading: yawRef.current,
        speed: speedRef.current,
        boosting: input.boost,
      });
    }
  });

  return (
    <RigidBody
      ref={body}
      colliders="cuboid"
      enabledRotations={[false, true, false]}
      position={[0, 1, 0]}
      linearDamping={1.1}
      angularDamping={12}
      mass={1.6}
    >
      <group ref={vehicle} position={[0, -0.08, 0]}>
        <mesh castShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[0.95, 0.34, 1.32]} />
          <meshStandardMaterial color="#f2a43a" roughness={0.72} />
        </mesh>
        <mesh castShadow position={[0, 0.34, -0.08]}>
          <boxGeometry args={[0.62, 0.48, 0.62]} />
          <meshStandardMaterial color="#f6d27c" roughness={0.65} />
        </mesh>
        <mesh castShadow position={[0, 0.56, -0.14]}>
          <boxGeometry args={[0.38, 0.08, 0.42]} />
          <meshStandardMaterial color="#8ed0ec" roughness={0.35} />
        </mesh>
        <mesh castShadow position={[0, 0.42, 0.58]}>
          <boxGeometry args={[0.18, 0.08, 0.18]} />
          <meshStandardMaterial color="#d94b35" emissive="#d94b35" emissiveIntensity={0.25} />
        </mesh>
        <mesh castShadow position={[0, 0.68, -0.36]} rotation={[0.24, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.62, 5]} />
          <meshStandardMaterial color="#3a3128" roughness={0.8} />
        </mesh>
        {[
          [-0.52, -0.1, -0.45],
          [0.52, -0.1, -0.45],
          [-0.52, -0.1, 0.45],
          [0.52, -0.1, 0.45],
        ].map((position, index) => (
          <mesh
            key={position.join(",")}
            ref={(wheel) => {
              if (wheel) wheelRefs.current[index] = wheel;
            }}
            position={position as [number, number, number]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.21, 0.21, 0.17, 10]} />
            <meshStandardMaterial color="#2f2922" roughness={0.82} />
          </mesh>
        ))}
      </group>
    </RigidBody>
  );
}
