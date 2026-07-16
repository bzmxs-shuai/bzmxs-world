"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

export function HomeBuilding() {
  return (
    <RigidBody type="fixed" colliders={false} position={[0.8, 0, 5.8]}>
      <group>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.45, 1.8]} />
          <meshStandardMaterial color="#f2d6a2" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.64, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.75, 0.95, 4]} />
          <meshStandardMaterial color="#a76537" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.62, 0.93]}>
          <boxGeometry args={[0.62, 0.9, 0.06]} />
          <meshStandardMaterial color="#8a5530" roughness={0.85} />
        </mesh>
        <mesh position={[-0.68, 0.9, 0.94]}>
          <boxGeometry args={[0.38, 0.38, 0.08]} />
          <meshStandardMaterial color="#ffd37a" emissive="#ffb347" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0.68, 0.9, 0.94]}>
          <boxGeometry args={[0.38, 0.38, 0.08]} />
          <meshStandardMaterial color="#ffd37a" emissive="#ffb347" emissiveIntensity={0.25} />
        </mesh>
        <CuboidCollider args={[1.16, 0.9, 0.96]} position={[0, 0.72, 0]} />
      </group>
    </RigidBody>
  );
}
