"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";
import { useWorldStore } from "@/store/useWorldStore";

const target = new Vector3();
const lookTarget = new Vector3();
const desired = new Vector3();
const offset = new Vector3();
const forward = new Vector3();
const side = new Vector3();
const up = new Vector3(0, 1, 0);

export function FollowCamera() {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const state = useWorldStore.getState();
    const [x, y, z] = state.playerPosition;
    const speed = Math.abs(state.vehicleSpeed);
    const heading = state.playerHeading;
    const panelOpen = state.isPanelOpen;

    target.set(x, y, z);
    forward.set(Math.sin(heading), 0, Math.cos(heading));
    side.set(Math.cos(heading), 0, -Math.sin(heading));

    const distance = 6.2 + Math.min(speed * 0.45, 2.6) + (panelOpen ? 1.1 : 0);
    const height = 3.65 + Math.min(speed * 0.11, 0.75);
    const lateralLag = MathUtils.clamp(state.vehicleSpeed * 0.05, -0.42, 0.42);

    offset.copy(forward).multiplyScalar(-distance);
    offset.addScaledVector(side, lateralLag);
    offset.y += height;

    desired.copy(target).add(offset);
    desired.y = Math.max(desired.y, 2.25);

    const positionEase = panelOpen ? 4.6 : 3.8;
    camera.position.lerp(desired, 1 - Math.exp(-positionEase * delta));

    lookTarget.copy(target);
    lookTarget.y += 0.72;
    lookTarget.addScaledVector(forward, Math.min(speed * 0.16, 0.8));
    camera.lookAt(lookTarget);
    camera.up.lerp(up, 0.08);
  });

  return null;
}
