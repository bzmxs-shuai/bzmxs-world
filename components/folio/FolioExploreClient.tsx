"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Gauge, Home, RotateCcw } from "lucide-react";
import type { Post } from "@/lib/posts";
import { ArticlePanel } from "@/components/interface/ArticlePanel";
import { useWorldStore, type BuildingId } from "@/store/useWorldStore";

type BridgeMessage = {
  source?: string;
  type?: "state" | "open-area";
  currentArea?: BuildingId | null;
  officialArea?: string | null;
  label?: string | null;
  player?: { x: number; y: number; z: number } | null;
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
  const [currentArea, setCurrentArea] = useState<BuildingId | null>(null);
  const [officialArea, setOfficialArea] = useState<string | null>(null);
  const [isRuntimeLoaded, setRuntimeLoaded] = useState(false);
  const openPanel = useWorldStore((state) => state.openPanel);
  const closePanel = useWorldStore((state) => state.closePanel);
  const isPanelOpen = useWorldStore((state) => state.isPanelOpen);
  const setStoreArea = useWorldStore((state) => state.setCurrentArea);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setRuntimeLoaded(true);
    }, 2500);

    return () => window.clearTimeout(timeout);
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

      if (event.data.type === "state") {
        const area = event.data.currentArea ?? null;
        setCurrentArea(area);
        setOfficialArea(event.data.officialArea ?? null);
        setStoreArea(area ?? "central");
      }

      if (event.data.type === "open-area" && event.data.currentArea) {
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

  const activeArea = currentArea;
  const active = activeArea ? areaText[activeArea] : null;
  const ActiveIcon = active?.icon;
  const activePostCount = activeArea ? counts[activeArea] : 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#15111f] text-white">
      {!isRuntimeLoaded ? (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#15111f]">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-amber-200">BZMXS WORLD</p>
            <h1 className="mt-3 text-3xl font-semibold">Loading folio-2025 runtime</h1>
            <p className="mt-3 text-sm text-white/65">Official low-poly world is starting...</p>
          </div>
        </div>
      ) : null}

      <iframe
        title="BZMXS WORLD 3D runtime"
        src="/folio-2025/index.html"
        className="absolute inset-0 h-full w-full border-0"
        allow="autoplay; gamepad; fullscreen"
        onLoad={() => setRuntimeLoaded(true)}
      />

      <div className="pointer-events-none absolute left-4 top-4 z-30 flex max-w-[min(560px,calc(100vw-2rem))] flex-col gap-3 md:left-6 md:top-6">
        <div className="pointer-events-auto rounded-lg border border-white/15 bg-black/35 px-4 py-3 shadow-2xl backdrop-blur">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">BZMXS WORLD</p>
          <p className="mt-1 text-sm text-white/80">Explore my notes, challenges and stories.</p>
        </div>

        <div className="pointer-events-auto rounded-lg border border-white/15 bg-black/35 px-4 py-3 shadow-2xl backdrop-blur">
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
          onClick={() => window.location.reload()}
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
