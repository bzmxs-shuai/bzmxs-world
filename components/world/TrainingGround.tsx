"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

function Tire({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <torusGeometry args={[0.26, 0.07, 6, 12]} />
      <meshStandardMaterial color="#2f2922" roughness={0.86} />
    </mesh>
  );
}

export function TrainingGround() {
  return (
    <group position={[5.2, 0, -1.8]}>
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <cylinderGeometry args={[2.18, 2.18, 0.16, 10]} />
          <meshStandardMaterial color="#d9873d" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[1.25, 1.78, 16]} />
          <meshStandardMaterial color="#c87035" roughness={0.98} />
        </mesh>
        <CuboidCollider args={[1.95, 0.12, 1.95]} position={[0, 0.08, 0]} />
      </RigidBody>
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[0, 1.0, -0.92]} castShadow>
          <boxGeometry args={[2.65, 1.82, 0.34]} />
          <meshStandardMaterial color="#b5532f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.12, -0.71]}>
          <boxGeometry args={[1.9, 0.92, 0.06]} />
          <meshStandardMaterial color="#f7e6b4" roughness={0.82} />
        </mesh>
        <Text position={[0, 1.24, -0.66]} fontSize={0.19} anchorX="center" anchorY="middle" color="#2f2922">
          P5015 / DP / STL
        </Text>
        <Text position={[0, 0.94, -0.66]} fontSize={0.13} anchorX="center" anchorY="middle" color="#6d3d25">
          CHALLENGE BOARD
        </Text>
        <CuboidCollider args={[1.35, 0.95, 0.24]} position={[0, 0.92, -0.9]} />
      </RigidBody>
      {[-1.35, 0, 1.35].map((x) => (
        <mesh key={x} position={[x, 0.36, 1.18]} castShadow>
          <boxGeometry args={[0.35, 0.72, 0.35]} />
          <meshStandardMaterial color="#f3c263" roughness={0.85} />
        </mesh>
      ))}
      <Tire position={[-1.35, 0.35, -0.25]} />
      <Tire position={[1.35, 0.35, 0.22]} />
      <mesh position={[0, 0.12, 1.78]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 0.16]} />
        <meshStandardMaterial color="#f7e6b4" roughness={0.9} />
      </mesh>
    </group>
  );
}
