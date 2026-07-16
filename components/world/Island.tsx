"use client";

import { useMemo } from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { BufferAttribute, BufferGeometry } from "three";

function TerrainMesh() {
  const geometry = useMemo(() => {
    const segments = 18;
    const size = 20;
    const vertices: number[] = [];
    const indices: number[] = [];

    for (let z = 0; z <= segments; z++) {
      for (let x = 0; x <= segments; x++) {
        const px = (x / segments - 0.5) * size;
        const pz = (z / segments - 0.5) * size;
        const radius = Math.hypot(px, pz);
        const edgeFalloff = Math.max(0, radius - 7.1) * -0.18;
        const mound = Math.sin(px * 0.65) * 0.045 + Math.cos(pz * 0.55) * 0.045;
        const plazaFlatten = radius < 2.1 ? -mound : 0;
        vertices.push(px, edgeFalloff + mound + plazaFlatten, pz);
      }
    }

    for (let z = 0; z < segments; z++) {
      for (let x = 0; x < segments; x++) {
        const a = z * (segments + 1) + x;
        const b = a + 1;
        const c = a + segments + 1;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const terrain = new BufferGeometry();
    terrain.setAttribute("position", new BufferAttribute(new Float32Array(vertices), 3));
    terrain.setIndex(indices);
    terrain.computeVertexNormals();
    return terrain;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#75b95f" roughness={1} flatShading />
    </mesh>
  );
}

function RoadSegment({
  position,
  rotation = 0,
  length,
  width = 1.35,
}: {
  position: [number, number, number];
  rotation?: number;
  length: number;
  width?: number;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
      <planeGeometry args={[width, length, 1, 1]} />
      <meshStandardMaterial color="#d8bd82" roughness={1} />
    </mesh>
  );
}

function BoundaryPost({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.055, 0.07, 0.48, 5]} />
      <meshStandardMaterial color="#8a613d" roughness={0.9} />
    </mesh>
  );
}

export function Island() {
  const posts = useMemo(() => {
    const result: [number, number, number][] = [];
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      result.push([Math.sin(angle) * 9.2, 0.24, Math.cos(angle) * 9.2]);
    }
    return result;
  }, []);

  return (
    <group>
      <RigidBody type="fixed" colliders={false}>
        <TerrainMesh />
        <CuboidCollider args={[10, 0.18, 10]} position={[0, -0.18, 0]} />
        <CuboidCollider args={[1.4, 0.12, 2.4]} position={[0, 0.05, -1.75]} rotation={[0.08, 0, 0]} />
        <CuboidCollider args={[1.2, 0.12, 1.4]} position={[3.2, 0.05, -0.8]} rotation={[0, -0.35, 0.05]} />
      </RigidBody>

      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.32, 12]} />
        <meshStandardMaterial color="#ead49d" roughness={1} />
      </mesh>
      <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.35, 2.55, 12]} />
        <meshStandardMaterial color="#f3e5bf" roughness={1} />
      </mesh>

      <RoadSegment position={[-2.6, 0.065, -1.95]} rotation={-0.88} length={5.2} />
      <RoadSegment position={[2.85, 0.065, -0.85]} rotation={0.68} length={5.0} />
      <RoadSegment position={[0.45, 0.065, 3.05]} rotation={-0.14} length={5.2} />
      <RoadSegment position={[-0.2, 0.075, -0.1]} rotation={0.8} length={3.8} width={1.0} />

      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[9.25, 10.4, 28]} />
        <meshStandardMaterial color="#b9955e" roughness={1} />
      </mesh>

      {posts.map((position) => (
        <BoundaryPost key={position.join(",")} position={position} />
      ))}
    </group>
  );
}
