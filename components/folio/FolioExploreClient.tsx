"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Gauge, Home, RotateCcw } from "lucide-react";
import type { Post } from "@/lib/posts";
import { ArticlePanel } from "@/components/interface/ArticlePanel";
import { useWorldStore, type BuildingId } from "@/store/useWorldStore";

type BridgeMessage = {
  source?: string;
  type?:
    | "folio:ready"
    | "folio:start"
    | "folio:state"
    | "folio:zone-enter"
    | "folio:zone-leave"
    | "folio:open-content"
    | "folio:error";
  currentArea?: BuildingId | null;
  officialArea?: string | null;
  label?: string | null;
  player?: { x: number; y: number; z: number } | null;
  message?: string;
  stack?: string | null;
  filename?: string | null;
  lineno?: number | null;
  colno?: number | null;
};

type RuntimeCommand = {
  source: "bzmxs-next";
  type: "folio:pause" | "folio:resume" | "folio:respawn";
};

const areaText: Record<BuildingId, { title: string; subtitle: string; icon: typeof BookOpen }> = {
  library: {
    title: "LIBRARY",
    subtitle: "Academic & Technical Notes",
    icon: BookOpen,
  },
  "training-ground": {
    title: "TRAINING GROUND",
    subtitle: "Algorithms & Challenges",
    icon: Gauge,
  },
  home: {
    title: "HOME",
    subtitle: "Life, Stories & Memories",
    icon: Home,
  },
};

export function FolioExploreClient({ posts }: { posts: Post[] }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentArea, setCurrentArea] = useState<BuildingId | null>(null);
  const [officialArea, setOfficialArea] = useState<string | null>(null);
  const [isRuntimeLoaded, setRuntimeLoaded] = useState(false);
  const [isRuntimeStarted, setRuntimeStarted] = useState(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const openPanel = useWorldStore((state) => state.openPanel);
  const closePanel = useWorldStore((state) => state.closePanel);
  const isPanelOpen = useWorldStore((state) => state.isPanelOpen);
  const setStoreArea = useWorldStore((state) => state.setCurrentArea);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setRuntimeLoaded(true);
    }, 8000);

    return () => window.clearTimeout(timeout);
  }, []);

  const postRuntimeCommand = useCallback((type: RuntimeCommand["type"]) => {
    const target = iframeRef.current?.contentWindow;
    if (!target) {
      return;
    }

    target.postMessage({ source: "bzmxs-next", type } satisfies RuntimeCommand, window.location.origin);
  }, []);

  const counts = useMemo(
    () =>
      posts.reduce<Record<BuildingId, number>>(
        (acc, post) => {
          if (post.area === "library" || post.area === "training-ground" || post.area === "home") {
            acc[post.area] += 1;
          }
          return acc;
        },
        { library: 0, "training-ground": 0, home: 0 },
      ),
    [posts],
  );

  const openCurrentArea = useCallback(() => {
    if (!currentArea) {
      return;
    }
    openPanel(currentArea);
  }, [currentArea, openPanel]);

  useEffect(() => {
    const onMessage = (event: MessageEvent<BridgeMessage>) => {
      if (event.origin !== window.location.origin || event.data?.source !== "bzmxs-folio-2025") {
        return;
      }

      if (event.data.type === "folio:error") {
        const location = event.data.filename ? ` (${event.data.filename}:${event.data.lineno ?? "?"})` : "";
        setRuntimeError(`${event.data.message ?? "Unknown folio runtime error"}${location}`);
        return;
      }

      if (event.data.type === "folio:ready") {
        setRuntimeLoaded(true);
      }

      if (event.data.type === "folio:start") {
        setRuntimeStarted(true);
      }

      if (event.data.type === "folio:state" || event.data.type === "folio:ready" || event.data.type === "folio:zone-enter") {
        const area = event.data.currentArea ?? null;
        setCurrentArea(area);
        setOfficialArea(event.data.officialArea ?? null);
        setStoreArea(area ?? "central");
      }

      if (event.data.type === "folio:zone-leave") {
        setCurrentArea(null);
        setOfficialArea(null);
        setStoreArea("central");
      }

      if (event.data.type === "folio:open-content" && event.data.currentArea) {
        openPanel(event.data.currentArea);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape" && isPanelOpen) {
        closePanel();
      }

      if ((event.code === "KeyE" || event.code === "Enter") && !isPanelOpen) {
        openCurrentArea();
      }
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closePanel, isPanelOpen, openCurrentArea, openPanel, setStoreArea]);

  useEffect(() => {
    if (!isRuntimeLoaded) {
      return;
    }

    postRuntimeCommand(isPanelOpen ? "folio:pause" : "folio:resume");
  }, [isPanelOpen, isRuntimeLoaded, postRuntimeCommand]);

  const activeArea = currentArea;
  const active = activeArea ? areaText[activeArea] : null;
  const ActiveIcon = active?.icon;
  const activePostCount = activeArea ? counts[activeArea] : 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#15111f] text-white">
      <iframe
        ref={iframeRef}
        title="BZMXS WORLD 3D runtime"
        src="/folio-2025/index.html"
        className="absolute inset-0 h-full w-full border-0"
        allow="autoplay; gamepad; fullscreen"
        tabIndex={0}
        onLoad={() => setRuntimeLoaded(true)}
      />

      <div className="pointer-events-none absolute right-4 top-4 z-30 flex max-w-[min(440px,calc(100vw-2rem))] flex-col gap-3 md:right-6 md:top-6">
        <div className="rounded-lg border border-white/15 bg-black/35 px-4 py-3 shadow-2xl backdrop-blur">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">BZMXS WORLD</p>
          <p className="mt-1 text-sm text-white/80">Explore my notes, challenges and stories.</p>
          <p className="mt-2 text-xs text-white/55">
            {isRuntimeStarted ? "Driving enabled" : "Click the scene prompt to start"}
          </p>
        </div>

        <div className="rounded-lg border border-white/15 bg-black/35 px-4 py-3 shadow-2xl backdrop-blur">
          {active && ActiveIcon ? (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded bg-amber-300 p-2 text-stone-950">
                <ActiveIcon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">{active.title}</p>
                <p className="text-xs text-white/70">{active.subtitle}</p>
                <p className="mt-2 text-xs text-amber-100">
                  {activePostCount} posts · Press E / Enter to read
                  {officialArea ? ` · official area: ${officialArea}` : ""}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold">Drive to a blog area</p>
              <p className="mt-1 text-xs text-white/70">Library, Training Ground and Home are connected to the article panel.</p>
            </div>
          )}
        </div>

        {runtimeError ? (
          <div className="rounded-lg border border-red-300/30 bg-red-950/70 px-4 py-3 text-xs text-red-100 shadow-2xl backdrop-blur">
            <p className="font-semibold">Runtime error</p>
            <p className="mt-1 break-words">{runtimeError}</p>
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-30 flex flex-wrap items-center gap-2 md:bottom-6 md:left-6 md:right-auto">
        <button
          type="button"
          onClick={openCurrentArea}
          disabled={!currentArea}
          className="pointer-events-auto rounded-lg bg-amber-300 px-4 py-3 text-sm font-semibold text-stone-950 shadow-xl disabled:cursor-not-allowed disabled:bg-white/25 disabled:text-white/60"
        >
          Open Area
        </button>
        <Link
          href="/reading"
          className="pointer-events-auto rounded-lg border border-white/20 bg-black/35 px-4 py-3 text-sm font-medium text-white shadow-xl backdrop-blur"
        >
          Reading Mode
        </Link>
        <button
          type="button"
          onClick={() => postRuntimeCommand("folio:respawn")}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/35 px-4 py-3 text-sm font-medium text-white shadow-xl backdrop-blur"
        >
          <RotateCcw size={16} />
          Respawn
        </button>
      </div>

      <ArticlePanel posts={posts} />
    </main>
  );
}
