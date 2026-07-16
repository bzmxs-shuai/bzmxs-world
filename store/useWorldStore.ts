"use client";

import { create } from "zustand";
import type { BlogArea } from "@/lib/posts";

export type BuildingId = "library" | "training-ground" | "home";
export type QualityLevel = "low" | "medium" | "high";

type Vector2 = {
  x: number;
  y: number;
};

type Vector3Tuple = [number, number, number];

type WorldState = {
  currentArea: BlogArea | "central";
  isPanelOpen: boolean;
  selectedBuilding: BuildingId | null;
  selectedArticle: string | null;
  isReadingMode: boolean;
  isMapOpen: boolean;
  soundEnabled: boolean;
  quality: QualityLevel;
  mobileControl: Vector2;
  playerPosition: Vector3Tuple;
  playerHeading: number;
  vehicleSpeed: number;
  isBoosting: boolean;
  setCurrentArea: (area: BlogArea | "central") => void;
  openPanel: (building: BuildingId) => void;
  closePanel: () => void;
  selectArticle: (slug: string | null) => void;
  setReadingMode: (enabled: boolean) => void;
  toggleMap: () => void;
  toggleSound: () => void;
  setQuality: (quality: QualityLevel) => void;
  setMobileControl: (control: Vector2) => void;
  setPlayerPosition: (position: Vector3Tuple) => void;
  setVehicleTelemetry: (telemetry: { position: Vector3Tuple; heading: number; speed: number; boosting: boolean }) => void;
  resetSpawnSignal: number;
  returnToSpawn: () => void;
};

function getDefaultQuality(): QualityLevel {
  if (typeof window === "undefined") {
    return "medium";
  }

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;

  if (coarsePointer || memory <= 4 || cores <= 4) {
    return "low";
  }

  if (memory >= 8 && cores >= 8) {
    return "high";
  }

  return "medium";
}

export const useWorldStore = create<WorldState>((set) => ({
  currentArea: "central",
  isPanelOpen: false,
  selectedBuilding: null,
  selectedArticle: null,
  isReadingMode: false,
  isMapOpen: false,
  soundEnabled: false,
  quality: getDefaultQuality(),
  mobileControl: { x: 0, y: 0 },
  playerPosition: [0, 1, 0],
  playerHeading: 0,
  vehicleSpeed: 0,
  isBoosting: false,
  resetSpawnSignal: 0,
  setCurrentArea: (area) => set({ currentArea: area }),
  openPanel: (building) => set({ selectedBuilding: building, isPanelOpen: true, selectedArticle: null }),
  closePanel: () => set({ isPanelOpen: false, selectedArticle: null }),
  selectArticle: (slug) => set({ selectedArticle: slug }),
  setReadingMode: (enabled) => set({ isReadingMode: enabled }),
  toggleMap: () => set((state) => ({ isMapOpen: !state.isMapOpen })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setQuality: (quality) => set({ quality }),
  setMobileControl: (control) => set({ mobileControl: control }),
  setPlayerPosition: (position) => set({ playerPosition: position }),
  setVehicleTelemetry: ({ position, heading, speed, boosting }) =>
    set({
      playerPosition: position,
      playerHeading: heading,
      vehicleSpeed: speed,
      isBoosting: boosting,
    }),
  returnToSpawn: () =>
    set((state) => ({
      resetSpawnSignal: state.resetSpawnSignal + 1,
      playerPosition: [0, 1, 0],
      playerHeading: 0,
      vehicleSpeed: 0,
      isBoosting: false,
      currentArea: "central",
      selectedBuilding: null,
    })),
}));
