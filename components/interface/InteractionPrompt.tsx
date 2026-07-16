"use client";

import { Keyboard, MousePointerClick } from "lucide-react";
import { useWorldStore, type BuildingId } from "@/store/useWorldStore";

const labels: Record<BuildingId, string> = {
  library: "进入图书馆",
  "training-ground": "查看训练场",
  home: "拜访小房子",
};

export function InteractionPrompt() {
  const selectedBuilding = useWorldStore((state) => state.selectedBuilding);
  const openPanel = useWorldStore((state) => state.openPanel);

  if (!selectedBuilding) {
    return null;
  }

  return (
    <button
      onClick={() => openPanel(selectedBuilding)}
      className="fixed bottom-28 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-stone-900 shadow-lg md:bottom-8"
    >
      <Keyboard size={18} />
      <span>按 E 或点击：{labels[selectedBuilding]}</span>
      <MousePointerClick size={18} />
    </button>
  );
}
