# folio-2025 Integration Decision

## Adopted Scheme

Adopted scheme: **Scheme B, same-domain independent runtime build with a Next.js bridge layer**.

The official Vite/Three.js runtime is built separately and copied to `public/folio-2025`. Next.js owns `/`, `/explore`, `/reading`, `/posts/[slug]`, and `/admin`. The `/explore` page renders a same-origin runtime iframe and uses `postMessage` events from the official runtime to open the existing two-dimensional article panel.

## Why This Scheme

- It preserves the official folio-2025 game loop, vehicle, camera, Rapier physics, loading reveal, HUD, mobile controls, audio framework, quality settings, and asset loading pipeline.
- It avoids rewriting the official runtime as React Three Fiber.
- It keeps `/reading`, `/posts/[slug]`, and `/admin` in the current Next.js app.
- It avoids loading the large 3D runtime on ordinary reading pages.

## Why Not Scheme A Yet

Directly mounting the official runtime as a Next.js client module is possible later, but it would require WebGPU/TSL, WASM, Vite plugin, Stylus, public asset, and top-level-await handling inside the Next.js toolchain. That is higher risk and more likely to damage the official driving feel.

## Why Not Scheme C As Final Architecture

The current bridge uses a same-origin iframe as a pragmatic runtime boundary. It is acceptable as the first stable integration because the runtime remains same-domain and sends structured area events to Next. A future upgrade can replace the iframe boundary with a custom element or client module once the build tooling risk is lower.

## Route Structure

| Route | Owner | Notes |
|---|---|---|
| `/` | Next.js | Loads `FolioExploreClient` |
| `/explore` | Next.js | Loads `FolioExploreClient` |
| `/folio-2025/index.html` | Static Vite output | Official folio runtime |
| `/reading` | Next.js | Existing normal reading mode |
| `/posts/[slug]` | Next.js | Existing static article pages |
| `/admin` | Next.js | Existing protected admin foundation |

## Bridge

- Runtime file: `sources/bzmxsBridge.js` in the patched folio-2025 build.
- Message source: `bzmxs-folio-2025`.
- Runtime sends `state` messages with the current mapped area.
- Runtime sends `open-area` when the iframe has focus and the user presses `E` or `Enter`.
- Next shows article counts and opens the existing `ArticlePanel`.

## Vercel Deployment

The runtime is static content under `public/folio-2025`, so Vercel serves it with the same origin as the Next.js app. No production DNS changes are required.

## Future Runtime Upgrades

1. Re-clone the official `brunosimon/folio-2025` repository at a chosen commit.
2. Reapply the minimal bzmxs patches:
   - `build.target = "esnext"`
   - `bzmxsBridge.js`
   - neutralized metadata and personal content
   - disabled server/private features
3. Rebuild and replace `public/folio-2025`.
4. Re-run `/explore`, `/reading`, `/posts/[slug]`, and `/admin` checks.

