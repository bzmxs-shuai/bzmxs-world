"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

export function TrainingGround() {
  return (
    <group position={[5.2, 0, -1.8]}>
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <cylinderGeometry args={[2.0, 2.0, 0.16, 8]} />
          <meshStandardMaterial color="#d9873d" roughness={0.95} />
        </mesh>
        <CuboidCollider args={[1.9, 0.12, 1.9]} position={[0, 0.08, 0]} />
      </RigidBody>
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[0, 0.95, -0.8]} castShadow>
          <boxGeometry args={[2.4, 1.7, 0.32]} />
          <meshStandardMaterial color="#b5532f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.04, -0.62]}>
          <boxGeometry args={[1.7, 0.9, 0.06]} />
          <meshStandardMaterial color="#f7e6b4" roughness={0.8} />
        </mesh>
        <CuboidCollider args={[1.25, 0.9, 0.22]} position={[0, 0.9, -0.8]} />
      </RigidBody>
      {[-1.2, 0, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.35, 1.15]} castShadow>
          <boxGeometry args={[0.35, 0.7, 0.35]} />
          <meshStandardMaterial color="#f3c263" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}
