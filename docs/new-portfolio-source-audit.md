# New Portfolio Source Audit

Date: 2026-07-17
Branch: `feature/new-portfolio-cms-rebuild`

## Official Source Verification

- Public site: <https://bruno-simon.com/>
- Verification path: public site → Behind the scene → Source code.
- Official repository: <https://github.com/brunosimon/folio-2025>
- Repository owner: `brunosimon`
- Repository name: `folio-2025`
- Default branch: `main`
- Audited commit: `41046b57eeed8d156d9c3fd7fa259900baef7816`
- Local audit clone: `/private/tmp/folio-2025-official`

The public site states that the source code is available on GitHub under the MIT license and that the server code is not shared, while the portfolio works without it.

## License Findings

| Source | Path | License | Notes |
|---|---|---|---|
| folio-2025 repository | `license.md` | MIT | Copyright (c) 2025 Bruno Simon. Preserved as `LICENSE.folio-2025.md`. |
| folio-2025 music files | `static/sounds/musics/license.md` | CC0 1.0 Universal | Music files are explicitly covered by a CC0 license file in the repository. |
| folio-2025 npm dependencies | `package.json` | Package-specific | Includes Three.js, Rapier, Howler, GSAP, Vite, Tweakpane, camera-controls, and related tooling. Must be tracked through package metadata if dependencies are adopted. |
| Google / browser fonts | `static/fonts/Pally-*` | Needs follow-up | The files are present in the official MIT repository, but no separate font license file was found in the quick scan. Treat as covered by repository license unless a separate upstream font license is identified. |

## Repository Structure

| Area | Directory | Notes |
|---|---|---|
| Source runtime | `sources/Game/` | Full 2025 runtime: game loop, player, Rapier physics, vehicle, input, view, map, options, reveal, weather, audio, terrain, areas. |
| Data | `sources/data/` | Content/data definitions used by the runtime. Must be reviewed before retaining any personal branding or project/customer metadata. |
| Main static assets | `static/` | Runtime-ready exported assets. Includes intro, terrain, vehicle, lab, playground, career, projects, UI, sounds, fonts, etc. |
| Blender resources | `resources/folio-2025.blend` | Official Blender source file for the world. |
| Extra models | `resources/models/` | Includes `bruno.glb`, `sudo.glb`, and corresponding Blender files. These are personal/character assets and should not be displayed as bzmxs.cn branding without careful review. |
| Textures | `resources/textures/` and `static/**` | Source and compressed/rendered textures. Includes project/customer and Three.js Journey-related files that must be removed or replaced if adopted. |
| Audio | `static/sounds/` | Sound effects, vehicle audio, ambient audio, music, circuit sounds. Music has CC0 license file. |
| Fonts | `static/fonts/` | Pally font files in multiple formats. |
| Server features | `sources/Game/Server.js`, whispers, rankings/circuit score paths | Server code itself is not public. Any private server, ranking, whisper, analytics, or user-data endpoints must be disabled or replaced. |

## Candidate Scene Mapping

| Blog area | Official candidate | Rationale | Required removals/replacements |
|---|---|---|---|
| Library | `static/lab` plus `sources/Game/World/Areas/LabArea.js` | The lab area is the best fit for academic, technical, AI, robotics, and learning notes. | Replace lab/project labels and images with Library labels and blog article entry UI. Remove Bruno/project-specific content. |
| Training Ground | `static/playground`, `sources/Game/World/Areas/CircuitArea.js`, bowling / pushable object systems | The official circuit/playground systems provide route, jump, obstacle, and driving challenge quality. | Replace leaderboard/server scoring and public ranking behavior. Keep local driving challenge only unless a new server is implemented. |
| Home | `static/lab/images/my-room-in-3d*`, career/personal-space candidates, or relevant room/personal assets found in `sources/data` | The public asset set includes My Room in 3D imagery and career/personal presentation assets. A full room scene must be confirmed before runtime adoption. | Replace personal biographical text, project links, socials, and private contact content with bzmxs.cn content. |

## Assets Observed In Quick Scan

- `static/vehicle/default*.glb`, `oldSchool*.glb`
- `static/playground/playgroundVisual*.glb`, `playgroundPhysical*.glb`
- `static/lab/images/*`
- `static/intro/*`
- `static/career/*`
- `static/projects/images/*`
- `static/fonts/Pally-*`
- `static/sounds/**`
- `resources/folio-2025.blend`
- `resources/palette.png`
- `resources/textures/*`

## Must Not Retain In Public bzmxs.cn Build

- Bruno Simon name, personal biography, avatar, social links, contact links, private message content.
- Client/customer project names and images unless explicitly retained only as licensed generic scenery after removing identity and links.
- Three.js Journey advertising, discounts, and promotional links.
- Analytics and monitoring IDs.
- Server-dependent ranking, whispers, user messages, private API endpoints, or any non-public server behavior.
- Any asset whose license cannot be confirmed through the official repository or a specific included license file.

## Integration Risk Notes

- `folio-2025` is not a drop-in replacement for the current `folio-2019` bridge. It uses Vite, Rapier, Three.js r183, TSL/WebGPU-adjacent rendering, a different game loop, and a different static resource layout.
- A safe integration should first run the official repository unchanged, then wrap it as a separate client-only `/explore` runtime or embed its built output behind a Next.js bridge.
- This audit does not claim that the official 2025 runtime has already been integrated into this repository.
