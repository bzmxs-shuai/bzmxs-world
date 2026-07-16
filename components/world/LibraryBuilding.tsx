"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

export function LibraryBuilding() {
  return (
    <RigidBody type="fixed" colliders={false} position={[-5.2, 0, -3.8]}>
      <group>
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 1.8, 2.1]} />
          <meshStandardMaterial color="#d9c28d" roughness={0.85} />
        </mesh>
        <mesh position={[0, 2.05, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[2.0, 1.1, 4]} />
          <meshStandardMaterial color="#7a4d2b" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.05, 1.08]}>
          <boxGeometry args={[0.8, 1.0, 0.06]} />
          <meshStandardMaterial color="#5b3a24" />
        </mesh>
        <mesh position={[-0.75, 1.25, 1.1]}>
          <boxGeometry args={[0.42, 0.42, 0.08]} />
          <meshStandardMaterial color="#8ed0ec" />
        </mesh>
        <mesh position={[0.75, 1.25, 1.1]}>
          <boxGeometry args={[0.42, 0.42, 0.08]} />
          <meshStandardMaterial color="#8ed0ec" />
        </mesh>
        <CuboidCollider args={[1.35, 1.1, 1.1]} position={[0, 0.9, 0]} />
      </group>
    </RigidBody>
  );
}
