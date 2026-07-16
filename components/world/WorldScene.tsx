"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Sky, Stats } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Navigation } from "@/components/interface/Navigation";
import { LoadingScreen } from "@/components/interface/LoadingScreen";
import { InteractionPrompt } from "@/components/interface/InteractionPrompt";
import { ArticlePanel } from "@/components/interface/ArticlePanel";
import { MobileControls } from "@/components/interface/MobileControls";
import { MapPanel } from "@/components/interface/MapPanel";
import { WebGLFallback } from "@/components/fallback/WebGLFallback";
import { Island } from "./Island";
import { Player } from "./Player";
import { FollowCamera } from "./FollowCamera";
import { LibraryBuilding } from "./LibraryBuilding";
import { TrainingGround } from "./TrainingGround";
import { HomeBuilding } from "./HomeBuilding";
import { InteractionZone } from "./InteractionZone";
import { SceneDetails } from "./SceneDetails";
import { VehicleAudio } from "./VehicleAudio";
import type { Post } from "@/lib/posts";
import { useWorldStore } from "@/store/useWorldStore";
import { Compass, Gauge, List, Map, RotateCcw, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

function hasWebGL() {
  if (typeof window === "undefined") {
    return true;
  }
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
}

function SceneContent() {
  const quality = useWorldStore((state) => state.quality);
  const shadowSize = quality === "high" ? 1536 : quality === "medium" ? 1024 : 512;
  const shadowsEnabled = quality !== "low";

  return (
    <>
      <color attach="background" args={["#b9e6ff"]} />
      <fog attach="fog" args={["#c7e8f5", 16, 34]} />
      <Sky sunPosition={[4, 8, 3]} turbidity={2.2} rayleigh={1.6} />
      <ambientLight intensity={0.86} />
      <directionalLight position={[5, 8, 4]} intensity={1.75} castShadow={shadowsEnabled} shadow-mapSize={[shadowSize, shadowSize]} />
      <Physics gravity={[0, -9.81, 0]}>
        <Island />
        <LibraryBuilding />
        <TrainingGround />
        <HomeBuilding />
        <SceneDetails quality={quality} />
        <Player />
      </Physics>
      <InteractionZone />
      <FollowCamera />
      <VehicleAudio />
      <Environment preset="sunset" environmentIntensity={quality === "low" ? 0.18 : 0.32} />
      {process.env.NODE_ENV === "development" ? <Stats className="hidden" /> : null}
    </>
  );
}

function WorldHud() {
  const currentArea = useWorldStore((state) => state.currentArea);
  const isPanelOpen = useWorldStore((state) => state.isPanelOpen);
  const returnToSpawn = useWorldStore((state) => state.returnToSpawn);
  const toggleMap = useWorldStore((state) => state.toggleMap);
  const toggleSound = useWorldStore((state) => state.toggleSound);
  const soundEnabled = useWorldStore((state) => state.soundEnabled);
  const quality = useWorldStore((state) => state.quality);
  const setQuality = useWorldStore((state) => state.setQuality);
  const vehicleSpeed = useWorldStore((state) => state.vehicleSpeed);

  const areaName = useMemo(() => {
    const names = {
      central: "中央广场",
      library: "图书馆",
      "training-ground": "训练场",
      home: "小房子",
      laboratory: "实验室",
      museum: "博物馆",
    };
    return names[currentArea];
  }, [currentArea]);

  if (isPanelOpen) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-30 mx-auto flex max-w-6xl flex-col gap-3 px-4 md:flex-row md:items-start md:justify-between">
      <section className="pointer-events-auto max-w-xl rounded-lg border border-amber-200 bg-amber-50/90 p-4 shadow-lg backdrop-blur">
        <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
          <Compass size={16} />
          {areaName}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-950 md:text-3xl">bzmxs.cn 低多边形博客小岛</h1>
        <p className="mt-2 text-sm leading-6 text-stone-700">
          WASD 或方向键移动，靠近建筑后按 E 打开内容。移动端可使用左下角方向按钮。
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className="rounded-lg bg-emerald-700 px-3 py-2 text-sm text-amber-50" href="/reading">
            普通阅读模式
          </Link>
          <button onClick={toggleMap} className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm text-stone-800">
            <Map size={15} />
            地图
          </button>
          <button
            onClick={returnToSpawn}
            className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm text-stone-800"
          >
            <RotateCcw size={15} />
            R 重生
          </button>
          <button
            onClick={toggleSound}
            className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm text-stone-800"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            声音
          </button>
        </div>
      </section>
      <div className="pointer-events-auto hidden rounded-lg border border-amber-200 bg-amber-50/90 p-3 text-sm text-stone-700 shadow-lg backdrop-blur md:block">
        <div className="flex items-center gap-2">
          <Gauge size={16} />
          {Math.round(Math.abs(vehicleSpeed) * 12)} km/h · Shift 加速 · Space 弹跳
        </div>
        <div className="mt-2 flex items-center gap-2">
          <List size={16} />
          E/Enter 交互 · M 地图 · Esc 关闭面板
        </div>
        <div className="mt-3 flex items-center gap-1 rounded-lg bg-white/70 p-1">
          {(["low", "medium", "high"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setQuality(level)}
              className={`rounded-md px-2.5 py-1 text-xs uppercase ${
                quality === level ? "bg-emerald-700 text-amber-50" : "text-stone-700 hover:bg-amber-100"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorldScene({ posts }: { posts: Post[] }) {
  const [webglReady] = useState(() => hasWebGL());
  const [progress, setProgress] = useState(15);
  const selectedBuilding = useWorldStore((state) => state.selectedBuilding);
  const quality = useWorldStore((state) => state.quality);
  const openPanel = useWorldStore((state) => state.openPanel);
  const toggleMap = useWorldStore((state) => state.toggleMap);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(value + 18, 96));
    }, 180);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "e" && selectedBuilding) {
        openPanel(selectedBuilding);
      }
      if (event.key.toLowerCase() === "m") {
        toggleMap();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openPanel, selectedBuilding, toggleMap]);

  if (webglReady === false) {
    return (
      <main className="min-h-screen pt-20">
        <Navigation />
        <WebGLFallback />
      </main>
    );
  }

  return (
    <main className="relative h-screen overflow-hidden">
      <Navigation />
      {progress < 96 ? <LoadingScreen progress={progress} /> : null}
      <Canvas
        shadows={quality !== "low"}
        camera={{ position: [0, 5, 8], fov: 45 }}
        dpr={quality === "high" ? [1, 1.75] : quality === "medium" ? [1, 1.25] : [0.8, 1]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
      <WorldHud />
      <InteractionPrompt />
      <ArticlePanel posts={posts} />
      <MobileControls />
      <MapPanel />
    </main>
  );
}
