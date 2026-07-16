"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import type { ReactNode } from "react";
import { useWorldStore } from "@/store/useWorldStore";

function ControlButton({
  label,
  x,
  y,
  children,
}: {
  label: string;
  x: number;
  y: number;
  children: ReactNode;
}) {
  const setMobileControl = useWorldStore((state) => state.setMobileControl);

  return (
    <button
      aria-label={label}
      onPointerDown={() => setMobileControl({ x, y })}
      onPointerUp={() => setMobileControl({ x: 0, y: 0 })}
      onPointerCancel={() => setMobileControl({ x: 0, y: 0 })}
      className="grid h-12 w-12 place-items-center rounded-lg bg-amber-50/90 text-stone-900 shadow-md"
    >
      {children}
    </button>
  );
}

export function MobileControls() {
  return (
    <div className="fixed bottom-4 left-4 z-40 grid grid-cols-3 gap-2 md:hidden">
      <span />
      <ControlButton label="向前" x={0} y={1}>
        <ArrowUp size={20} />
      </ControlButton>
      <span />
      <ControlButton label="向左" x={-1} y={0}>
        <ArrowLeft size={20} />
      </ControlButton>
      <ControlButton label="向后" x={0} y={-1}>
        <ArrowDown size={20} />
      </ControlButton>
      <ControlButton label="向右" x={1} y={0}>
        <ArrowRight size={20} />
      </ControlButton>
    </div>
  );
}
