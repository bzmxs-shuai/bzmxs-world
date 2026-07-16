"use client";

import { useEffect, useRef } from "react";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useWorldStore } from "@/store/useWorldStore";

const keys = new Set<string>();
const move = new Vector3();

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const mobileControl = useWorldStore((state) => state.mobileControl);
  const setPlayerPosition = useWorldStore((state) => state.setPlayerPosition);
  const resetSpawnSignal = useWorldStore((state) => state.resetSpawnSignal);

  useEffect(() => {
    const down = (event: KeyboardEvent) => keys.add(event.key.toLowerCase());
    const up = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      keys.clear();
    };
  }, []);

  useEffect(() => {
    body.current?.setTranslation({ x: 0, y: 1, z: 0 }, true);
    body.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
  }, [resetSpawnSignal]);

  useFrame(() => {
    const rigidBody = body.current;
    if (!rigidBody) {
      return;
    }

    const forward = keys.has("w") || keys.has("arrowup") ? -1 : 0;
    const backward = keys.has("s") || keys.has("arrowdown") ? 1 : 0;
    const left = keys.has("a") || keys.has("arrowleft") ? -1 : 0;
    const right = keys.has("d") || keys.has("arrowright") ? 1 : 0;
    const x = left + right + mobileControl.x;
    const z = forward + backward - mobileControl.y;

    move.set(x, 0, z);
    if (move.lengthSq() > 1) {
      move.normalize();
    }

    const velocity = rigidBody.linvel();
    rigidBody.setLinvel({ x: move.x * 4.2, y: velocity.y, z: move.z * 4.2 }, true);

    if (move.lengthSq() > 0.001) {
      const angle = Math.atan2(move.x, move.z);
      rigidBody.setRotation({ x: 0, y: Math.sin(angle / 2), z: 0, w: Math.cos(angle / 2) }, true);
    }

    const position = rigidBody.translation();
    if (position.y < -4 || Math.hypot(position.x, position.z) > 10.8) {
      rigidBody.setTranslation({ x: 0, y: 1, z: 0 }, true);
      rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      setPlayerPosition([0, 1, 0]);
      return;
    }
    setPlayerPosition([position.x, position.y, position.z]);
  });

  return (
    <RigidBody
      ref={body}
      colliders="cuboid"
      enabledRotations={[false, true, false]}
      position={[0, 1, 0]}
      linearDamping={5}
      angularDamping={8}
    >
      <group>
        <mesh castShadow position={[0, -0.18, 0]}>
          <boxGeometry args={[0.82, 0.32, 1.05]} />
          <meshStandardMaterial color="#f2a43a" roughness={0.75} />
        </mesh>
        <mesh castShadow position={[0, 0.16, -0.1]}>
          <boxGeometry args={[0.55, 0.5, 0.56]} />
          <meshStandardMaterial color="#f6d27c" roughness={0.7} />
        </mesh>
        {[
          [-0.46, -0.36, -0.38],
          [0.46, -0.36, -0.38],
          [-0.46, -0.36, 0.38],
          [0.46, -0.36, 0.38],
        ].map((position) => (
          <mesh key={position.join(",")} position={position as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.16, 8]} />
            <meshStandardMaterial color="#3a3128" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </RigidBody>
  );
}
