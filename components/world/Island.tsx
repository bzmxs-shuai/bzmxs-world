"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 1.1, 5]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <coneGeometry args={[0.65, 1.1, 6]} />
        <meshStandardMaterial color="#4f8f46" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Island() {
  const trees: [number, number, number][] = [
    [-7, 0, -3],
    [-6, 0, 5],
    [6.5, 0, -4],
    [5, 0, 5.5],
    [-1.5, 0, 7],
    [8, 0, 1.5],
  ];

  return (
    <group>
      <RigidBody type="fixed" colliders={false}>
        <mesh receiveShadow position={[0, -0.14, 0]}>
          <cylinderGeometry args={[10, 11, 0.28, 24]} />
          <meshStandardMaterial color="#74b85f" roughness={1} />
        </mesh>
        <CuboidCollider args={[10, 0.16, 10]} position={[0, -0.12, 0]} />
      </RigidBody>

      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.15, 2.4, 8]} />
        <meshStandardMaterial color="#f3e5bf" roughness={1} />
      </mesh>

      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.1, 8]} />
        <meshStandardMaterial color="#ead49d" roughness={1} />
      </mesh>

      {trees.map((position) => (
        <Tree key={position.join(",")} position={position} />
      ))}
    </group>
  );
}
