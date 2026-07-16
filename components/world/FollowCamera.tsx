"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useWorldStore } from "@/store/useWorldStore";

const cameraOffset = new Vector3(0, 5.2, 7.2);
const lookOffset = new Vector3(0, 0.8, 0);
const target = new Vector3();
const desired = new Vector3();

export function FollowCamera() {
  const { camera } = useThree();
  const playerPosition = useWorldStore((state) => state.playerPosition);

  useFrame(() => {
    target.set(playerPosition[0], playerPosition[1], playerPosition[2]);
    desired.copy(target).add(cameraOffset);
    camera.position.lerp(desired, 0.075);
    camera.lookAt(target.clone().add(lookOffset));
  });

  return null;
}
