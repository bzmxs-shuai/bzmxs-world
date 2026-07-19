# Reference Comparison

Comparison date: 2026-07-17

Reference sources:

- Official site: https://bruno-simon.com/
- Open-source base: https://github.com/brunosimon/folio-2019

Local rebuild target:

- Branch: `feature/folio-base-rebuild`
- Local URL: `http://localhost:3000/explore`

## Results

| Item | Status | Notes |
| --- | --- | --- |
| Startup loading | Close | Original loading area and reveal flow are retained, with Next HUD layered above it. |
| Vehicle startup | Matched | Uses original `Car.js` and Cannon raycast vehicle setup. |
| Acceleration | Matched | Original acceleration, boost, and engine sound state are retained. |
| Braking | Matched | Original brake action via Space/Ctrl is retained. |
| Steering | Matched | Original steering logic is retained. |
| Jump / bounce | Matched | Original vehicle action wiring is retained; no new complex jump system added. |
| Landing feedback | Close | Original physics/collision feedback retained; no extra bzmxs-specific effects yet. |
| Pushable objects | Close | Original pushable objects from retained intro/playground/home props remain. |
| Camera follow | Matched | Original `Camera.js` easing, zoom, and pan behavior retained. |
| Respawn | Matched | Original reset action is exposed through `R` and HUD respawn. |
| Sound system | Close | Original Howler sound framework and assets retained; muted by default for browser autoplay safety. |
| Shadows and lighting | Close | Original material/shadow pipeline retained; Next integration does not rewrite lighting. |
| Scene density | Close | Intro, crossroads, playground, project-board-style library, and home static assets retained; unrelated project/client areas removed. |
| 3D text / labels | Different | Original text meshes for Bruno identity were removed; bzmxs labels are canvas-text planes for now. |
| HUD rhythm | Different | Original HUD is replaced by a bzmxs.cn blog HUD and article panel. |
| Mobile controls | Close | Original touch-control code and UI images retained; full device QA still needed. |
| Blog article interaction | Different | New bridge opens the existing MDX article panel by Library / Training Ground / Home area. |

## Verification Notes

- The unmodified `folio-2019` base was cloned to `/private/tmp/folio-2019-original-20260717`.
- It installed with Node `v24.14.0` and pnpm `11.9.0`.
- Original production build passed with Vite after approving the expected `esbuild` build script.
- Original dev server started locally at `http://localhost:5173/`.
- Current rebuild passed local route and static asset checks for `/`, `/explore`, `/reading`, `/posts/cpp-map-guide`, and key `/folio` model/audio/Draco assets.

## Known Gaps

- I could not complete an automated visual screenshot comparison in this environment because bundled Playwright had no browser installed and system Chrome headless launch was terminated by macOS. Manual browser QA is still recommended before merge.
- Area signs are currently runtime-generated canvas textures, not polished Blender text assets.
- The rebuild keeps a subset of original scene assets and constrains blog scope; it is intentionally not a full clone of the public reference site.
