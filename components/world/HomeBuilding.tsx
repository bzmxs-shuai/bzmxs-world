"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

export function HomeBuilding() {
  return (
    <RigidBody type="fixed" colliders={false} position={[0.8, 0, 5.8]}>
      <group>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.26, 1.45, 1.84]} />
          <meshStandardMaterial color="#f2d6a2" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.66, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.82, 0.98, 4]} />
          <meshStandardMaterial color="#a76537" roughness={0.85} />
        </mesh>
        <mesh position={[0.82, 2.02, -0.38]} castShadow>
          <boxGeometry args={[0.28, 0.68, 0.28]} />
          <meshStandardMaterial color="#7a4d2b" roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.62, 0.96]}>
          <boxGeometry args={[0.62, 0.9, 0.07]} />
          <meshStandardMaterial color="#8a5530" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.18, 1.42]} castShadow receiveShadow>
          <boxGeometry args={[1.65, 0.18, 0.82]} />
          <meshStandardMaterial color="#c9955b" roughness={0.88} />
        </mesh>
        {[-0.7, 0.7].map((x) => (
          <mesh key={x} position={[x, 0.92, 0.98]}>
            <boxGeometry args={[0.38, 0.38, 0.08]} />
            <meshStandardMaterial color="#ffd37a" emissive="#ffb347" emissiveIntensity={0.28} />
          </mesh>
        ))}
        <Text position={[0, 1.22, 1.05]} fontSize={0.17} anchorX="center" anchorY="middle" color="#5b3a24">
          HOME
        </Text>
        <mesh position={[-1.55, 0.34, 1.45]} rotation={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.58, 0.16, 0.38]} />
          <meshStandardMaterial color="#9f6a3d" roughness={0.9} />
        </mesh>
        <mesh position={[1.58, 0.42, 1.25]} castShadow>
          <boxGeometry args={[0.34, 0.44, 0.24]} />
          <meshStandardMaterial color="#d8bd82" roughness={0.88} />
        </mesh>
        <CuboidCollider args={[1.18, 0.92, 0.98]} position={[0, 0.72, 0]} />
      </group>
    </RigidBody>
  );
}
