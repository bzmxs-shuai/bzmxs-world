"use client";

import { Text } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { QualityLevel } from "@/store/useWorldStore";

type Tuple3 = [number, number, number];

function Tree({ position, scale = 1 }: { position: Tuple3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.9, 5]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.92} />
      </mesh>
      <mesh position={[0, 1.12, 0]} castShadow>
        <coneGeometry args={[0.58, 0.95, 6]} />
        <meshStandardMaterial color="#4f8f46" roughness={0.94} />
      </mesh>
      <mesh position={[0.08, 1.55, -0.04]} castShadow>
        <coneGeometry args={[0.42, 0.74, 6]} />
        <meshStandardMaterial color="#5ca04f" roughness={0.94} />
      </mesh>
    </group>
  );
}

function Rock({ position, scale = 1 }: { position: Tuple3; scale?: number }) {
  return (
    <mesh position={position} scale={scale} rotation={[0.12, 0.4, -0.18]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.38, 0]} />
      <meshStandardMaterial color="#a7a08f" roughness={0.96} />
    </mesh>
  );
}

function Grass({ position, color = "#78b85e" }: { position: Tuple3; color?: string }) {
  return (
    <group position={position}>
      {[-0.16, 0, 0.16].map((x, index) => (
        <mesh key={x} position={[x, 0.16, 0]} rotation={[0, 0, (index - 1) * 0.28]} castShadow>
          <coneGeometry args={[0.045, 0.34, 4]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Sign({
  position,
  rotation = 0,
  title,
  subtitle,
}: {
  position: Tuple3;
  rotation?: number;
  title: string;
  subtitle: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.055, 1.2, 5]} />
        <meshStandardMaterial color="#6f4a2d" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[1.7, 0.72, 0.12]} />
        <meshStandardMaterial color="#f4dfaa" roughness={0.86} />
      </mesh>
      <Text
        position={[0, 1.28, 0.07]}
        fontSize={0.16}
        maxWidth={1.5}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color="#2f2922"
      >
        {title}
      </Text>
      <Text
        position={[0, 1.03, 0.07]}
        fontSize={0.08}
        maxWidth={1.45}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color="#6d5b44"
      >
        {subtitle}
      </Text>
    </group>
  );
}

function Lamp({ position }: { position: Tuple3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.055, 1.4, 6]} />
        <meshStandardMaterial color="#5a4635" roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <boxGeometry args={[0.28, 0.22, 0.28]} />
        <meshStandardMaterial color="#ffe3a2" emissive="#ffbd55" emissiveIntensity={0.45} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Crate({ position }: { position: Tuple3 }) {
  const body = useRef<RapierRigidBody>(null);

  useFrame(() => {
    const rigidBody = body.current;
    if (!rigidBody) return;
    const current = rigidBody.translation();
    if (current.y < -2 || Math.hypot(current.x, current.z) > 9.8) {
      rigidBody.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
      rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  return (
    <RigidBody ref={body} colliders="cuboid" position={position} restitution={0.18} friction={0.8} linearDamping={1.8} angularDamping={2.2}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.52, 0.52, 0.52]} />
        <meshStandardMaterial color="#b87942" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.01, 0.265]} castShadow>
        <boxGeometry args={[0.08, 0.54, 0.025]} />
        <meshStandardMaterial color="#8a5530" roughness={0.9} />
      </mesh>
    </RigidBody>
  );
}

function Cone({ position }: { position: Tuple3 }) {
  const body = useRef<RapierRigidBody>(null);

  useFrame(() => {
    const rigidBody = body.current;
    if (!rigidBody) return;
    const current = rigidBody.translation();
    if (current.y < -2 || Math.hypot(current.x, current.z) > 9.8) {
      rigidBody.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
      rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  return (
    <RigidBody ref={body} colliders="hull" position={position} restitution={0.25} friction={0.65} linearDamping={2.2} angularDamping={2.6}>
      <mesh castShadow>
        <coneGeometry args={[0.22, 0.55, 8]} />
        <meshStandardMaterial color="#e66d31" roughness={0.78} />
      </mesh>
    </RigidBody>
  );
}

export function SceneDetails({ quality }: { quality: QualityLevel }) {
  const rich = quality !== "low";
  const high = quality === "high";

  return (
    <group>
      <Sign
        position={[-3.25, 0.05, -2.55]}
        rotation={0.75}
        title="LIBRARY"
        subtitle="ACADEMIC & TECHNICAL NOTES"
      />
      <Sign
        position={[3.25, 0.05, -1.05]}
        rotation={-0.7}
        title="TRAINING GROUND"
        subtitle="ALGORITHMS & CHALLENGES"
      />
      <Sign position={[1.95, 0.05, 3.65]} rotation={-2.75} title="HOME" subtitle="LIFE, STORIES & MEMORIES" />

      <Lamp position={[-1.8, 0.02, -1.25]} />
      <Lamp position={[2.15, 0.02, 1.9]} />
      {rich ? <Lamp position={[-3.7, 0.02, 2.2]} /> : null}

      <Crate position={[3.7, 0.38, -3.1]} />
      <Crate position={[-2.35, 0.38, 3.2]} />
      {rich ? <Cone position={[4.25, 0.38, -0.25]} /> : null}
      {rich ? <Cone position={[4.6, 0.38, 0.35]} /> : null}

      {[
        [-7.2, 0, -3.4],
        [-6.15, 0, 5.35],
        [6.8, 0, -4.3],
        [5.4, 0, 5.55],
        [-1.65, 0, 7.15],
        [8.1, 0, 1.65],
        [-7.85, 0, 1.35],
      ].map((position, index) => (
        <Tree key={position.join(",")} position={position as Tuple3} scale={index % 2 ? 0.9 : 1.12} />
      ))}

      {[
        [-8.1, 0.18, -0.8],
        [-4.7, 0.18, 6.65],
        [7.4, 0.18, 3.85],
        [2.4, 0.18, -6.95],
        [-0.2, 0.18, -7.6],
      ].map((position, index) => (
        <Rock key={position.join(",")} position={position as Tuple3} scale={index % 2 ? 0.75 : 1} />
      ))}

      {(high
        ? [
            [-5.6, 0, -1.1],
            [-4.8, 0, -0.5],
            [-3.6, 0, 1.1],
            [2.9, 0, 2.2],
            [4.5, 0, 2.8],
            [6.2, 0, 0.7],
            [1.8, 0, 6.8],
            [-2.2, 0, 6.1],
          ]
        : [
            [-5.6, 0, -1.1],
            [-3.6, 0, 1.1],
            [4.5, 0, 2.8],
            [1.8, 0, 6.8],
          ]
      ).map((position, index) => (
        <Grass key={position.join(",")} position={position as Tuple3} color={index % 2 ? "#6dab52" : "#87bd63"} />
      ))}
    </group>
  );
}
