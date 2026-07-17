# Pixel Reference Audit

Date: 2026-07-17
Branch: `feature/full-folio-fidelity`

Reference: Bruno Simon `folio-2019` open-source runtime and public site.

This audit separates functional parity from visual parity. `Functionally close` means the behavior exists but is not visually identical.

## Loading Screen

| Item | Status | Notes |
|---|---|---|
| Layout | Visually close | The Next.js pre-runtime fallback now uses a minimal black folio-like loading screen. Once the runtime mounts, the original in-world starting screen is no longer covered by a generic card. |
| Font ratio | Different | The pre-runtime fallback uses project typography, not the original bitmap labels. |
| Progress display | Functionally close | Resource progress is still driven by the folio loader and area border once the runtime is active. |
| Animation rhythm | Functionally close | The original starting area progress and start-label transition remain active. |
| Color | Visually close | Black/white fallback plus original in-world labels. |
| Scene entry transition | Matched | The original `startingScreen.area` interaction still calls `start()` and `reveal.go()`. |

## Spawn Point

| Item | Status | Notes |
|---|---|---|
| Vehicle position | Matched | The original reveal code places the vehicle at `(0, 0, 12)` and wakes it after the reveal delay. |
| Camera position | Matched | Original camera and pan behavior are retained. |
| Road | Matched | Original intro static model, tiles, dikes, and crossroads path remain. |
| Terrain | Matched | Original intro static GLB and floor shadow are retained. |
| Decoration density | Visually close | Original key instructions, horn, dikes, and intro tiles remain. |
| Text | Different | Original Bruno Simon name is removed. Replacement uses available folio physical letters `B`, `M`, and `S`; exact `BZMXS WORLD` 3D lettering is not available in the retained model set. |
| Lighting | Matched | Original renderer, matcap reveal, shadows, blur, and glow passes are retained. |
| Shadows | Matched | Original `Shadows`, floor shadow reveal, and object shadow parameters are retained. |
| Scene scale | Matched | Intro, crossroads, playground, car, and camera scale are unchanged. |

## Driving Experience

| Item | Status | Notes |
|---|---|---|
| Acceleration | Matched | Original `Car`, `Physics`, and `Controls` modules are retained. |
| Steering | Matched | Original steering physics are retained. |
| Braking | Matched | Original brake mapping and vehicle physics are retained. |
| Jumping | Matched | Original control action and physics behavior are retained. |
| Landing | Matched | Original Cannon.js chassis and wheel logic are retained. |
| Collisions | Matched | Original collision import pipeline is retained for core assets; blog areas reuse original colliders where possible. |
| Camera | Matched | Original third-person camera math is retained. |
| Respawn | Matched | Original reset action is used through the HUD button and keyboard control. |

## HUD

| Item | Status | Notes |
|---|---|---|
| Operation tips | Functionally close | Project HUD gives bzmxs.cn-specific controls; original in-world instruction labels remain visible. |
| Mute | Functionally close | Uses Howler and the original sound system through a project HUD button. |
| Quality | Functionally close | Uses the project selector to set pixel ratio. Original postprocessing pipeline is retained. |
| Mobile controls | Matched | Original touch-control setup remains in `Controls`. |
| Map | Different | The project uses a compact area shortcut HUD rather than the original personal-portfolio UI. |
| Respawn | Functionally close | Uses original reset action, surfaced in project HUD. |

## Content Areas

| Item | Status | Notes |
|---|---|---|
| Library | Functionally close | Now built from retained folio project-board GLBs, brick walls, horns, lemon prop, and original colliders. Still not a new Blender-authored library building. |
| Training Ground | Visually close | Original playground remains the core. Added route obstacles reuse original brick, bowling, horn, and lemon assets. |
| Home | Functionally close | Built from retained information-section GLBs and original props. Still not a bespoke Blender-authored cottage. |

## Known Fidelity Gaps

- Blender is not installed in this environment, so no new `.blend` files were produced.
- The retained folio letter assets do not include all letters needed for `BZMXS WORLD`; the spawn point uses available physical letters instead of a full 3D title.
- Library and Home still rely on recomposed folio GLBs rather than newly modeled bespoke buildings.
- Preview browser visual verification may need manual review if automated browser policy blocks the deployment URL.
