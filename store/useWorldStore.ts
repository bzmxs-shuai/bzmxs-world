"use client";

import { create } from "zustand";
import type { BlogArea } from "@/lib/posts";

export type BuildingId = "library" | "training-ground" | "home";

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
  mobileControl: Vector2;
  playerPosition: Vector3Tuple;
  setCurrentArea: (area: BlogArea | "central") => void;
  openPanel: (building: BuildingId) => void;
  closePanel: () => void;
  selectArticle: (slug: string | null) => void;
  setReadingMode: (enabled: boolean) => void;
  toggleMap: () => void;
  toggleSound: () => void;
  setMobileControl: (control: Vector2) => void;
  setPlayerPosition: (position: Vector3Tuple) => void;
  resetSpawnSignal: number;
  returnToSpawn: () => void;
};

export const useWorldStore = create<WorldState>((set) => ({
  currentArea: "central",
  isPanelOpen: false,
  selectedBuilding: null,
  selectedArticle: null,
  isReadingMode: false,
  isMapOpen: false,
  soundEnabled: false,
  mobileControl: { x: 0, y: 0 },
  playerPosition: [0, 1, 0],
  resetSpawnSignal: 0,
  setCurrentArea: (area) => set({ currentArea: area }),
  openPanel: (building) => set({ selectedBuilding: building, isPanelOpen: true, selectedArticle: null }),
  closePanel: () => set({ isPanelOpen: false, selectedArticle: null }),
  selectArticle: (slug) => set({ selectedArticle: slug }),
  setReadingMode: (enabled) => set({ isReadingMode: enabled }),
  toggleMap: () => set((state) => ({ isMapOpen: !state.isMapOpen })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setMobileControl: (control) => set({ mobileControl: control }),
  setPlayerPosition: (position) => set({ playerPosition: position }),
  returnToSpawn: () =>
    set((state) => ({
      resetSpawnSignal: state.resetSpawnSignal + 1,
      playerPosition: [0, 1, 0],
      currentArea: "central",
      selectedBuilding: null,
    })),
}));
