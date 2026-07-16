"use client";

import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useWorldStore, type BuildingId } from "@/store/useWorldStore";

const zonePositions: Record<BuildingId, Vector3> = {
  library: new Vector3(-5.2, 0, -3.8),
  "training-ground": new Vector3(5.2, 0, -1.8),
  home: new Vector3(0.8, 0, 5.8),
};

const player = new Vector3();

export function InteractionZone() {
  const setCurrentArea = useWorldStore((state) => state.setCurrentArea);

  useFrame(() => {
    const position = useWorldStore.getState().playerPosition;
    player.set(position[0], position[1], position[2]);

    let nearest: BuildingId | null = null;
    let nearestDistance = Infinity;

    (Object.keys(zonePositions) as BuildingId[]).forEach((id) => {
      const distance = player.distanceTo(zonePositions[id]);
      if (distance < nearestDistance) {
        nearest = id;
        nearestDistance = distance;
      }
    });

    const state = useWorldStore.getState();
    if (nearest && nearestDistance < 3.1) {
      if (state.selectedBuilding !== nearest) {
        useWorldStore.setState({ selectedBuilding: nearest });
      }
      setCurrentArea(nearest);
    } else {
      if (!state.isPanelOpen && state.selectedBuilding !== null) {
        useWorldStore.setState({ selectedBuilding: null });
      }
      if (Math.hypot(position[0], position[2]) < 2.5) {
        setCurrentArea("central");
      }
    }
  });

  return null;
}
