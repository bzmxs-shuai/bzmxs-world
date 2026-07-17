"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Gauge, Home, Map, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Howler } from "howler";
import Application from "@/lib/folio-runtime/Application.js";
import { ArticlePanel } from "@/components/interface/ArticlePanel";
import { WebGLFallback } from "@/components/fallback/WebGLFallback";
import { useWorldStore } from "@/store/useWorldStore";

const areaNames = {
  library: "图书馆",
  "training-ground": "训练场",
  home: "小房子",
};

function hasWebGL() {
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
}

export function FolioWorld({ posts }) {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [webglReady] = useState(() => hasWebGL());
  const [, setIsBooting] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [quality, setQuality] = useState(() => {
    if (typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return "low";
    }
    return "medium";
  });
  const [soundMuted, setSoundMuted] = useState(true);
  const openPanel = useWorldStore((state) => state.openPanel);
  const closePanel = useWorldStore((state) => state.closePanel);
  const isPanelOpen = useWorldStore((state) => state.isPanelOpen);
  const selectedBuilding = useWorldStore((state) => state.selectedBuilding);

  useEffect(() => {
    if (!webglReady) {
      return undefined;
    }

    const app = new Application({
      $canvas: canvasRef.current,
      assetBasePath: "/folio",
      quality,
      onAreaOpen: (area) => {
        openPanel(area);
      },
    });

    appRef.current = app;
    window.__BZMX_FOLIO_APP = app;
    window.__BZMX_FOLIO_PAUSED = false;

    app.resources.on("ready.react", () => {
      setIsBooting(false);
    });

    app.resources.on("fatal.react", (failure) => {
      setIsBooting(false);
      setLoadError(failure);
    });

    const readyFallbackTimer = window.setTimeout(() => {
      if (!app.resources.fatalFailure && app.resources.loader.loaded === app.resources.loader.toLoad) {
        setIsBooting(false);
      }
    }, 1200);

    return () => {
      window.clearTimeout(readyFallbackTimer);
      window.__BZMX_FOLIO_PAUSED = false;
      if (window.__BZMX_FOLIO_APP === app) {
        delete window.__BZMX_FOLIO_APP;
      }
      app.destructor?.();
      appRef.current = null;
    };
  }, [openPanel, quality, retryKey, webglReady]);

  useEffect(() => {
    window.__BZMX_FOLIO_PAUSED = isPanelOpen;
    if (isPanelOpen && appRef.current?.world?.controls?.actions) {
      Object.assign(appRef.current.world.controls.actions, {
        up: false,
        right: false,
        down: false,
        left: false,
        brake: false,
        boost: false,
      });
    }
  }, [isPanelOpen]);

  useEffect(() => {
    if (appRef.current?.world?.sounds) {
      appRef.current.world.sounds.muted = soundMuted;
      Howler.mute(soundMuted);
    }
  }, [soundMuted]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closePanel();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePanel]);

  const respawn = () => {
    appRef.current?.world?.controls?.trigger?.("action", ["reset"]);
  };

  if (!webglReady) {
    return (
      <main className="min-h-screen bg-amber-50 pt-20">
        <WebGLFallback />
      </main>
    );
  }

  return (
    <main className="relative h-screen overflow-hidden bg-black text-amber-50">
      <canvas ref={canvasRef} className="h-full w-full touch-none outline-none" />

      {loadError ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/78 p-4 text-amber-50">
          <section className="max-w-lg rounded-md border border-red-300/40 bg-stone-950 p-5 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-200">核心 3D 资源加载失败</p>
            <h2 className="mt-2 text-xl font-semibold">无法启动完整 3D 世界</h2>
            <dl className="mt-4 space-y-2 text-sm text-amber-50/86">
              <div>
                <dt className="font-semibold text-amber-100">资源</dt>
                <dd className="break-all">{loadError.name}</dd>
              </div>
              <div>
                <dt className="font-semibold text-amber-100">路径</dt>
                <dd className="break-all">{loadError.source}</dd>
              </div>
              <div>
                <dt className="font-semibold text-amber-100">状态</dt>
                <dd>{loadError.status}</dd>
              </div>
            </dl>
            <button
              className="mt-5 rounded bg-amber-100 px-4 py-2 text-sm font-semibold text-stone-950"
              onClick={() => {
                setIsBooting(true);
                setLoadError(null);
                setRetryKey((value) => value + 1);
              }}
            >
              重试加载
            </button>
          </section>
        </div>
      ) : null}

      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 md:p-5">
        <section className="pointer-events-auto max-w-xl rounded-md border border-amber-100/25 bg-stone-950/62 p-3 shadow-lg backdrop-blur md:p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">BZMXS WORLD</p>
          <h1 className="mt-1 text-xl font-semibold md:text-2xl">Explore my notes, challenges and stories</h1>
          <p className="mt-2 text-sm leading-6 text-amber-50/82">
            WASD / 方向键驾驶，Shift 加速，Space 刹车，R 重生，靠近区域后按 E 或 Enter 打开内容。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link className="rounded bg-amber-100 px-3 py-2 text-sm font-semibold text-stone-950" href="/reading">
              普通阅读
            </Link>
            <button className="rounded bg-white/12 px-3 py-2 text-sm" onClick={respawn}>
              重生
            </button>
          </div>
        </section>

        <section className="pointer-events-auto flex flex-col gap-2 rounded-md border border-amber-100/20 bg-stone-950/60 p-2 backdrop-blur">
          <button
            aria-label={soundMuted ? "开启声音" : "静音"}
            className="grid h-10 w-10 place-items-center rounded bg-white/10"
            onClick={() => setSoundMuted((value) => !value)}
          >
            {soundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button aria-label="重生" className="grid h-10 w-10 place-items-center rounded bg-white/10" onClick={respawn}>
            <RotateCcw size={18} />
          </button>
          <select
            aria-label="画质"
            className="h-10 rounded bg-white/10 px-2 text-xs text-amber-50"
            value={quality}
            onChange={(event) => {
              setIsBooting(true);
              setLoadError(null);
              setQuality(event.target.value);
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </section>
      </div>

      <div className="pointer-events-none fixed bottom-4 left-4 z-30 hidden gap-2 md:flex">
        <div className="rounded-md bg-stone-950/60 px-3 py-2 text-xs backdrop-blur">
          <BookOpen className="mr-1 inline" size={14} />
          Library
        </div>
        <div className="rounded-md bg-stone-950/60 px-3 py-2 text-xs backdrop-blur">
          <Gauge className="mr-1 inline" size={14} />
          Training Ground
        </div>
        <div className="rounded-md bg-stone-950/60 px-3 py-2 text-xs backdrop-blur">
          <Home className="mr-1 inline" size={14} />
          Home
        </div>
      </div>

      {selectedBuilding ? (
        <div className="pointer-events-none fixed bottom-4 right-4 z-30 rounded-md bg-amber-100 px-4 py-3 text-sm font-semibold text-stone-950 shadow-lg">
          <Map className="mr-1 inline" size={15} />
          当前区域：{areaNames[selectedBuilding]}
        </div>
      ) : null}

      <ArticlePanel posts={posts} />
    </main>
  );
}
