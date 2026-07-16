"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

function Book({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.12, 0.42, 0.18]} />
      <meshStandardMaterial color={color} roughness={0.86} />
    </mesh>
  );
}

export function LibraryBuilding() {
  return (
    <RigidBody type="fixed" colliders={false} position={[-5.2, 0, -3.8]}>
      <group>
        <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.75, 1.9, 2.2]} />
          <meshStandardMaterial color="#d7c392" roughness={0.86} />
        </mesh>
        <mesh position={[0, 2.17, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[2.12, 1.12, 4]} />
          <meshStandardMaterial color="#76502e" roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.66, 1.14]}>
          <boxGeometry args={[0.82, 1.06, 0.08]} />
          <meshStandardMaterial color="#5b3a24" />
        </mesh>
        <mesh position={[0, 1.63, 1.18]} castShadow>
          <boxGeometry args={[1.9, 0.36, 0.16]} />
          <meshStandardMaterial color="#f1dfad" roughness={0.76} />
        </mesh>
        <Text position={[0, 1.64, 1.27]} fontSize={0.18} anchorX="center" anchorY="middle" color="#2f2922">
          LIBRARY
        </Text>
        {[-0.92, 0.92].map((x) => (
          <mesh key={x} position={[x, 1.25, 1.16]}>
            <boxGeometry args={[0.46, 0.5, 0.08]} />
            <meshStandardMaterial color="#8ed0ec" roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[-1.48, 0.72, 0.85]} castShadow>
          <boxGeometry args={[0.16, 1.2, 0.22]} />
          <meshStandardMaterial color="#8a613d" roughness={0.9} />
        </mesh>
        <mesh position={[1.48, 0.72, 0.85]} castShadow>
          <boxGeometry args={[0.16, 1.2, 0.22]} />
          <meshStandardMaterial color="#8a613d" roughness={0.9} />
        </mesh>
        <group position={[-1.55, 0.52, -0.45]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.12, 1.1, 0.74]} />
            <meshStandardMaterial color="#7a4d2b" roughness={0.9} />
          </mesh>
          {["#d94b35", "#3f7f5f", "#f2a43a", "#4c78a8"].map((color, index) => (
            <Book key={color} color={color} position={[0.09, 0.28 + index * 0.16, -0.18 + index * 0.11]} />
          ))}
        </group>
        <mesh position={[1.54, 0.38, -0.75]} rotation={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.7, 0.18, 0.54]} />
          <meshStandardMaterial color="#f4e3b5" roughness={0.88} />
        </mesh>
        <CuboidCollider args={[1.42, 1.1, 1.15]} position={[0, 0.92, 0]} />
      </group>
    </RigidBody>
  );
}
