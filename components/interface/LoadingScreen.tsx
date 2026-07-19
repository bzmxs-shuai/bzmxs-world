"use client";

import { motion } from "framer-motion";

export function LoadingScreen({ progress = 0 }: { progress?: number }) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-black text-white">
      <div className="w-full max-w-xs text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/55">BZMXS WORLD</p>
        <h1 className="mt-3 text-lg font-semibold">Loading the world...</h1>
        <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/12">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.round(progress))}%` }}
          />
        </div>
        <p className="mt-3 font-mono text-xs text-white/55">{Math.min(100, Math.round(progress))}%</p>
      </div>
    </div>
  );
}
