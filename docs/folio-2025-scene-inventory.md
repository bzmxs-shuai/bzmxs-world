# folio-2025 Scene Inventory

Source repository: <https://github.com/brunosimon/folio-2025>
Audited commit: `41046b57eeed8d156d9c3fd7fa259900baef7816`

| Scene name | Code entry | Blender source | Model file | Materials / textures | Collision | Animation / behavior | Server dependency | License |
|---|---|---|---|---|---|---|---|---|
| Landing / spawn | `World/Intro.js`, `Respawns.js`, `LandingArea.js` | `resources/folio-2025.blend` | `static/respawns/respawnsReferences*.glb`, `static/areas/areas*.glb` | `intro/*`, `palette.*`, `behindTheScene/stars.*` | Respawn references and area objects | Official loading reveal, intro ring, start label | None | MIT |
| Vehicle | `Physics/PhysicsVehicle.js`, `World/VisualVehicle.js`, `Player.js`, `View.js` | `resources/folio-2025.blend` | `static/vehicle/default*.glb`, related vehicle assets | Palette and vehicle materials | Rapier raycast vehicle | Acceleration, steering, jumping, respawn, camera follow | None | MIT |
| Terrain / roads | `Terrain.js`, `World/Floor.js`, `World/Scenery.js`, `World/Grass.js` | `resources/folio-2025.blend` | `static/terrain/terrain*.glb`, `static/scenery/scenery*.glb`, `static/playground/*` | `terrain/terrain.*`, `floor/slabs.*`, foliage textures | Terrain and fixed/dynamic objects | Tracks, grass, foliage, weather interaction | None | MIT |
| Library candidate: Lab | `World/Areas/LabArea.js`, `sources/data/lab.js` | `resources/folio-2025.blend` | `static/areas/areas*.glb` | `static/lab/images/*`, palette/material system | Area object extraction via `Objects.addFromModel` | Carousel, mechanism sounds, interactive point | Original links replaced | MIT |
| Training Ground candidate: Circuit | `World/Areas/CircuitArea.js` | `resources/folio-2025.blend` | `static/areas/areas*.glb`, `static/playground/*` | Circuit materials inside GLB, `ui/previews/circuit.webp` | Checkpoints, bounds, obstacles, reset objects | Countdown, timer, race, respawn, banners, start lights | Leaderboard server disabled/offline | MIT |
| Training Ground candidate: Bowling | `World/Areas/BowlingArea.js` | `resources/folio-2025.blend` | `static/areas/areas*.glb` | `jukebox/*`, bowling materials | Dynamic pins and ball via Rapier | Pushable ball/pins, jukebox, restart | None | MIT |
| Home candidate: Career | `World/Areas/CareerArea.js` | `resources/folio-2025.blend` | `static/areas/areas*.glb` | `static/career/*` | Area fixed objects | Sliding stones / timeline presentation | None | MIT |
| My Room in 3D | `sources/data/lab.js` item only | Not a separate local scene in this repo | No dedicated room model found in static scan | `static/lab/images/my-room-in-3d*` | None | Lab carousel image/link only | Original external link removed | MIT-covered repository asset, but not a complete local area |
| HUD / menu | `Menu.js`, `Modals.js`, `Inputs/*`, `Options.js`, `Quality.js`, `Map.js` | N/A | N/A | `static/ui/**`, fonts | N/A | Menu, map, quality, audio toggle, controls | Whispers/leaderboard server parts disabled or offline | MIT plus third-party decoder/font notices |
| Mobile controls | `Inputs/Nipple.js`, `Inputs/InteractiveButtons.js`, HTML touch buttons | N/A | N/A | `static/ui/controls/*` | N/A | Touch drive controls and action buttons | None | MIT |
| Audio | `Audio.js` | N/A | N/A | `static/sounds/**` | N/A | Vehicle, ambience, area sounds, effects | None | MIT; music folder includes CC0 notice |

## Blog Area Mapping

| Blog area | Official source used | Notes |
|---|---|---|
| Library | Lab area | Full official Lab area is used; Lab data has been replaced with bzmxs.cn technical note entries. |
| Training Ground | Circuit + Bowling | Circuit remains the main driving challenge; Bowling is also mapped to Training Ground for pushable-object gameplay. |
| Home | Career area | `My Room in 3D` was verified as a Lab carousel image/link, not a complete local drivable room scene. Career is currently the closest complete official personal/life-like area. |

