"use client";

import { X } from "lucide-react";
import { useWorldStore } from "@/store/useWorldStore";

export function MapPanel() {
  const isMapOpen = useWorldStore((state) => state.isMapOpen);
  const toggleMap = useWorldStore((state) => state.toggleMap);

  if (!isMapOpen) {
    return null;
  }

  return (
    <div id="map" className="fixed inset-0 z-50 grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-amber-50 p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-950">小岛地图</h2>
          <button onClick={toggleMap} aria-label="关闭地图" className="grid h-9 w-9 place-items-center rounded bg-white">
            <X size={18} />
          </button>
        </div>
        <div className="mt-5 aspect-square rounded-lg bg-sky-100 p-8">
          <div className="relative h-full rounded-full bg-emerald-200">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-amber-50 px-3 py-2 text-sm">
              中央广场
            </span>
            <span className="absolute left-10 top-8 rounded bg-emerald-800 px-3 py-2 text-sm text-amber-50">
              图书馆
            </span>
            <span className="absolute right-6 top-1/2 rounded bg-orange-600 px-3 py-2 text-sm text-amber-50">
              训练场
            </span>
            <span className="absolute bottom-10 left-1/2 rounded bg-amber-700 px-3 py-2 text-sm text-amber-50">
              小房子
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
