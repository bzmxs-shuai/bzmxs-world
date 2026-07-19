"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import * as THREE from "three";

const requiredChecks = [
  { id: "ground", label: "Ground", resource: "introStaticBase", getObject: (app) => app?.world?.sections?.intro?.container },
  { id: "vehicle", label: "Vehicle", resource: "carDefaultChassis", getObject: (app) => app?.world?.car?.container },
  { id: "library", label: "Library", resource: "projectsBoardStructure", getObject: (app) => app?.world?.sections?.blogAreas?.container },
  { id: "training", label: "Training Ground", resource: "playgroundStaticBase", getObject: (app) => app?.world?.sections?.playground?.container },
  { id: "home", label: "Home", resource: "informationStaticBase", getObject: (app) => app?.world?.sections?.blogAreas?.container },
  { id: "pushables", label: "Pushables", resource: "brickBase", getObject: (app) => app?.world?.walls?.container ?? app?.world?.objects?.container },
  { id: "full", label: "Full Scene", resource: "crossroadsStaticBase", getObject: (app) => app?.world?.container },
];

const focusPresets = {
  spawn: { x: 0, y: 2.4, z: 1, zoom: 0.28 },
  library: { x: 30, y: -30, z: 1, zoom: 0.36 },
  training: { x: -38, y: -34, z: 1, zoom: 0.48 },
  home: { x: 2, y: -55, z: 1, zoom: 0.38 },
};

function describeObject(object) {
  if (!object) {
    return { status: "Waiting", position: "-", box: "-", meshCount: 0 };
  }

  let meshCount = 0;
  object.traverse?.((child) => {
    if (child.isMesh) {
      meshCount += 1;
    }
  });

  const position = new THREE.Vector3();
  object.getWorldPosition?.(position);

  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);

  return {
    status: meshCount > 0 ? "Loaded" : "No mesh",
    position: `${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)}`,
    box: box.isEmpty() ? "-" : `${size.x.toFixed(1)} x ${size.y.toFixed(1)} x ${size.z.toFixed(1)}`,
    meshCount,
  };
}

export function FolioDebugOverlay() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ started: false, resources: 0, failures: 0 });
  const cleanMode = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).has("clean"),
    () => false,
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      const app = window.__BZMX_FOLIO_APP;
      const resources = app?.resources;
      const focus = new URLSearchParams(window.location.search).get("focus");
      const preset = focusPresets[focus];
      const shouldAutoStart = Boolean(preset) || window.location.search.includes("overview=1");
      const resourcesReady = Boolean(
        resources?.loader?.toLoad && resources.loader.loaded === resources.loader.toLoad && !resources.fatalFailure,
      );

      if (shouldAutoStart && app?.world && !app.world.car && resourcesReady) {
        app.world.start();
        window.setTimeout(() => {
          app.world.reveal?.go?.();
        }, 600);
        window.__BZMX_DEBUG_AUTOSTARTED = true;
      }

      if (window.location.search.includes("overview=1") && app?.world?.car && app?.camera) {
        app.camera.instance.far = 220;
        app.camera.instance.updateProjectionMatrix();
        app.camera.target.set(0, -34, 0);
        app.camera.targetEased.set(0, -34, 0);
        app.camera.angle.value.set(0.65, -0.85, 1.65);
        app.camera.zoom.minDistance = 62;
        app.camera.zoom.amplitude = 0;
        app.camera.zoom.distance = 62;
      }

      if (preset && app?.world?.car && app?.world?.physics?.car?.chassis?.body && app?.camera) {
        const body = app.world.physics.car.chassis.body;
        body.position.set(preset.x, preset.y, preset.z);
        body.velocity.set(0, 0, 0);
        body.angularVelocity.set(0, 0, 0);
        body.wakeUp();
        app.camera.zoom.targetValue = preset.zoom;
        app.camera.zoom.value = preset.zoom;
        app.camera.pan.reset();
      }

      setSummary({
        started: Boolean(app?.world?.car),
        resources: resources ? Object.keys(resources.items).length : 0,
        failures: resources?.failures?.length ?? 0,
      });

      setRows(
        requiredChecks.map((check) => {
          const objectInfo = describeObject(check.getObject(app));
          const resourceLoaded = Boolean(resources?.items?.[check.resource]);
          return {
            ...check,
            ...objectInfo,
            resourceLoaded,
          };
        }),
      );
    }, 500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <aside
      className={`pointer-events-none fixed bottom-4 right-4 z-40 max-h-[52vh] w-[430px] overflow-auto rounded-md border border-amber-100/30 bg-stone-950/84 p-3 text-xs text-amber-50 shadow-xl backdrop-blur ${cleanMode ? "hidden" : ""}`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="font-semibold">Explore Debug</h2>
        <span className="text-amber-100/80">{summary.started ? "World started" : "Press Enter on START"}</span>
      </div>
      <p className="mb-2 text-amber-50/70">
        Resources: {summary.resources} / Failures: {summary.failures}
      </p>
      <table className="w-full border-collapse text-left">
        <thead className="text-amber-100">
          <tr>
            <th className="py-1">Object</th>
            <th className="py-1">Resource</th>
            <th className="py-1">Status</th>
            <th className="py-1">Pos</th>
            <th className="py-1">BBox</th>
            <th className="py-1">Meshes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-white/10">
              <td className="py-1">{row.label}</td>
              <td className="py-1">{row.resourceLoaded ? "Loaded" : "Waiting"}</td>
              <td className="py-1">{row.status}</td>
              <td className="py-1">{row.position}</td>
              <td className="py-1">{row.box}</td>
              <td className="py-1">{row.meshCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
}
