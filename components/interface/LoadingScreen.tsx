"use client";

import { motion } from "framer-motion";

export function LoadingScreen({ progress = 0 }: { progress?: number }) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-sky-100">
      <div className="w-full max-w-sm rounded-lg border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
        <p className="font-semibold text-stone-950">正在搭建小岛</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-amber-100">
          <motion.div
            className="h-full bg-emerald-700"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.round(progress))}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-stone-600">{Math.min(100, Math.round(progress))}%</p>
      </div>
    </div>
  );
}
