# Asset Audit

Date: 2026-07-17

Scope: `/explore` on `feature/folio-base-rebuild`.

## Summary

The core folio assets are present in `public/folio` and match the paths used by `lib/folio-runtime/Resources.js`. The incomplete scene was not caused by missing vehicle or building GLB files. The root rendering failure was caused by project-local GLSL includes such as `#include ../partials/easeSin.glsl` and `#include ../partials/blur9.glsl` being shipped to WebGL without inlining. That broke the matcap and blur shaders, making the loaded vehicle and building meshes fail to render while simple text planes and floor shadows remained visible.

Path scan result:

- `Resources.js` static references checked: 95
- Missing resource files: 0
- Case-sensitive path mismatches: 0
- Draco decoder path `/folio/draco/` is a decoder directory, not a missing asset.

## Required Asset Table

| 资源 | 原项目路径 | 当前路径 | 是否存在 | 请求状态 | 被哪个模块使用 |
|---|---|---|---|---|---|
| 默认车辆车身 | `work/folio-2019-ref/static/models/car/default/chassis.glb` | `public/folio/models/car/default/chassis.glb` | Yes | 200 locally observed | `Resources.js`, `World/Car.js` |
| 默认车辆车轮 | `work/folio-2019-ref/static/models/car/default/wheel.glb` | `public/folio/models/car/default/wheel.glb` | Yes | 200 locally observed | `Resources.js`, `World/Car.js` |
| 默认车辆刹车灯 | `work/folio-2019-ref/static/models/car/default/backLightsBrake.glb` | `public/folio/models/car/default/backLightsBrake.glb` | Yes | 200 locally observed | `Resources.js`, `World/Car.js` |
| 默认车辆倒车灯 | `work/folio-2019-ref/static/models/car/default/backLightsReverse.glb` | `public/folio/models/car/default/backLightsReverse.glb` | Yes | 200 locally observed | `Resources.js`, `World/Car.js` |
| 默认车辆天线 | `work/folio-2019-ref/static/models/car/default/antena.glb` | `public/folio/models/car/default/antena.glb` | Yes | 200 locally observed | `Resources.js`, `World/Car.js` |
| 车辆 matcap / white | `work/folio-2019-ref/static/models/matcaps/white.png` | `public/folio/models/matcaps/white.png` | Yes | 200 locally observed | `Materials.js`, `Matcap.js` |
| 车辆 matcap / orange | `work/folio-2019-ref/static/models/matcaps/orange.png` | `public/folio/models/matcaps/orange.png` | Yes | 200 locally observed | `Materials.js`, `Matcap.js` |
| 地图基础模型 / intro | `work/folio-2019-ref/static/models/intro/static/base.glb` | `public/folio/models/intro/static/base.glb` | Yes | 200 locally observed | `IntroSection.js` |
| 地图基础碰撞 / intro | `work/folio-2019-ref/static/models/intro/static/collision.glb` | `public/folio/models/intro/static/collision.glb` | Yes | 200 locally observed | `IntroSection.js`, `Physics.js` |
| 地图阴影 / intro | `work/folio-2019-ref/static/models/intro/static/floorShadow.png` | `public/folio/models/intro/static/floorShadow.png` | Yes | 200 locally observed | `IntroSection.js`, `FloorShadow.js` |
| 道路与连接区模型 | `work/folio-2019-ref/static/models/crossroads/static/base.glb` | `public/folio/models/crossroads/static/base.glb` | Yes | 200 locally observed | `CrossroadsSection.js` |
| 道路与连接区碰撞 | `work/folio-2019-ref/static/models/crossroads/static/collision.glb` | `public/folio/models/crossroads/static/collision.glb` | Yes | 200 locally observed | `CrossroadsSection.js`, `Physics.js` |
| 图书馆主体模型 | `work/folio-2019-ref/static/models/projects/board/structure.glb` | `public/folio/models/projects/board/structure.glb` | Yes | 200 locally observed | `BlogAreasSection.js` |
| 图书馆碰撞 | `work/folio-2019-ref/static/models/projects/board/collision.glb` | `public/folio/models/projects/board/collision.glb` | Yes | 200 locally observed | `BlogAreasSection.js`, `Physics.js` |
| 图书馆阴影 | `work/folio-2019-ref/static/models/projects/board/floorShadow.png` | `public/folio/models/projects/board/floorShadow.png` | Yes | 200 locally observed | `BlogAreasSection.js`, `FloorShadow.js` |
| 训练场主体模型 | `work/folio-2019-ref/static/models/playground/static/base.glb` | `public/folio/models/playground/static/base.glb` | Yes | 200 locally observed | `PlaygroundSection.js` |
| 训练场碰撞 | `work/folio-2019-ref/static/models/playground/static/collision.glb` | `public/folio/models/playground/static/collision.glb` | Yes | 200 locally observed | `PlaygroundSection.js`, `Physics.js` |
| 训练场阴影 | `work/folio-2019-ref/static/models/playground/static/floorShadow.png` | `public/folio/models/playground/static/floorShadow.png` | Yes | 200 locally observed | `PlaygroundSection.js`, `FloorShadow.js` |
| 小房子主体模型 | `work/folio-2019-ref/static/models/information/static/base.glb` | `public/folio/models/information/static/base.glb` | Yes | 200 locally observed | `BlogAreasSection.js` |
| 小房子碰撞 | `work/folio-2019-ref/static/models/information/static/collision.glb` | `public/folio/models/information/static/collision.glb` | Yes | 200 locally observed | `BlogAreasSection.js`, `Physics.js` |
| 小房子阴影 | `work/folio-2019-ref/static/models/information/static/floorShadow.png` | `public/folio/models/information/static/floorShadow.png` | Yes | 200 locally observed | `BlogAreasSection.js`, `FloorShadow.js` |
| 可推动物体 / 砖块 | `work/folio-2019-ref/static/models/brick/base.glb` | `public/folio/models/brick/base.glb` | Yes | 200 locally observed | `PlaygroundSection.js`, `Walls.js` |
| 可推动物体 / 保龄球 | `work/folio-2019-ref/static/models/bowlingBall/base.glb` | `public/folio/models/bowlingBall/base.glb` | Yes | 200 locally observed | `PlaygroundSection.js` |
| 可推动物体 / 保龄球瓶 | `work/folio-2019-ref/static/models/bowlingPin/base.glb` | `public/folio/models/bowlingPin/base.glb` | Yes | 200 locally observed | `PlaygroundSection.js`, `Walls.js` |
| 共享材质 / matcaps | `work/folio-2019-ref/static/models/matcaps/*.png` | `public/folio/models/matcaps/*.png` | Yes | 200 locally observed | `Resources.js`, `Materials.js` |
| Draco decoder JS | `work/folio-2019-ref/static/draco/draco_decoder.js` | `public/folio/draco/draco_decoder.js` | Yes | 200 locally observed | `Utils/Loader.js`, `DRACOLoader` |
| Draco decoder WASM | `work/folio-2019-ref/static/draco/draco_decoder.wasm` | `public/folio/draco/draco_decoder.wasm` | Yes | Available | `DRACOLoader` fallback/runtime |
| 区域交互图标 | `work/folio-2019-ref/static/models/area/*.png` | `public/folio/models/area/*.png` | Yes | 200 locally observed | `Area.js`, `Areas.js` |
| 音效 / reveal | `work/folio-2019-ref/static/sounds/reveal/reveal-1.mp3` | `public/folio/sounds/reveal/reveal-1.mp3` | Yes | 200 locally observed | `Sounds.js` |
| 音效 / engine | `work/folio-2019-ref/static/sounds/engines/1/*.mp3` | `public/folio/sounds/engines/1/*.mp3` | Yes | 200 locally observed | `Sounds.js` |
| 音效 / collision | `work/folio-2019-ref/static/sounds/car-hits/*.mp3` | `public/folio/sounds/car-hits/*.mp3` | Yes | 200 locally observed | `Sounds.js` |
| 物理碰撞数据 / tiles | `work/folio-2019-ref/static/models/tiles/*/collision.glb` | `public/folio/models/tiles/*/collision.glb` | Yes | 200 locally observed | `Tiles.js`, `Physics.js` |

## Browser Findings Before Fix

- Local development `/explore` initially displayed only the ground gradient, START area, text sign, HUD, and floor shadows.
- After triggering START, the vehicle and core buildings were created but their shader materials failed.
- Console errors:
  - `Fragment shader is not compiled` at `#include ../partials/blur9.glsl`
  - `Vertex shader is not compiled` at `#include ../partials/easeSin.glsl`
  - `THREE.Object3D.add: object not an instance of THREE.Object3D. TransformControls`
- Observed core GLB requests included car chassis/wheel, project board, information static, playground static, tiles, and pushable object models.

## Fix Notes

- Added `scripts/glsl-include-loader.cjs` to inline project-local GLSL partials during Next/Webpack builds.
- Kept Three.js native chunks such as `#include <common>` untouched.
- Limited `TransformControls` to debug mode so it no longer emits runtime errors in normal exploration.
- Added required resource failure reporting in `Loader.js`, `Resources.js`, and `FolioWorld.jsx`.
- Added `/explore-debug` for development and Preview diagnostics.
