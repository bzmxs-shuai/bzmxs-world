# bzmxs-world

A warm low-poly 3D personal blog with an explorable driving world, built with Next.js and based on Bruno Simon's open-source `folio-2019` runtime.

## Screenshot

Screenshot placeholder: add a desktop capture from the Vercel Preview after visual QA.

## Features

- 3D exploration mode based on the `folio-2019` Three.js driving runtime.
- Original car physics, third-person camera, collisions, pushable objects, loading flow, mobile controls, and sound framework retained from the open-source base.
- Blog-specific central spawn, Library, Training Ground, and Home content entry points.
- `E` / `Enter` / mouse click area interactions that open a 2D article panel.
- Normal reading mode that does not depend on the 3D runtime.
- MDX posts with area, category, tags, SEO metadata, and static article detail routes.
- WebGL fallback, quality selector, mute control, and respawn control.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zustand
- Framer Motion
- MDX
- Three.js
- Cannon.js
- GSAP
- Howler.js
- ESLint
- Prettier

The previous MVP dependencies for React Three Fiber, Drei, and React Three Rapier are still present while the rebuild branch is being evaluated, but the active `/explore` runtime now uses the original Three.js architecture from `folio-2019`.

## Installation

```bash
npm install
```

This workspace has also been validated with `pnpm`.

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run lint
npm run typecheck
npm run build
```

## Controls

- `W` / `A` / `S` / `D` or arrow keys: drive.
- `Shift`: boost.
- `Space` / `Ctrl`: brake.
- `R`: respawn.
- `E` / `Enter`: open the current blog area.
- `M`: mute / unmute through the original runtime shortcut; the HUD also includes a mute button.
- Mobile: touch controls are provided by the original runtime.

## Directory Structure

```text
app/                  Next.js routes, layout, error and not-found pages
components/folio/     Next.js bridge for the folio-2019 runtime
components/interface/ 2D article panel, loading UI, navigation helpers
components/blog/      Article cards, article list, and MDX content wrapper
content/posts/        MDX sample posts
lib/folio-runtime/    Modified folio-2019 Three.js runtime
lib/shaders/          folio-2019 GLSL shaders used by the runtime
lib/images/           folio-2019 mobile control UI images
lib/                  Post loading and MDX rendering helpers
public/folio/         folio-2019 models, sounds, and Draco decoder assets used by the runtime
store/                Zustand world state
docs/                 Reference comparison notes
```

## Current Status

This branch is a folio-base rebuild preview. The stable public version remains on `main`; this branch should be reviewed through a Pull Request and Vercel Preview before merging.

## Roadmap

- Replace temporary canvas-text area signs with polished low-poly text/model assets.
- Further reduce unused legacy dependencies after the folio-base direction is approved.
- Add a richer article search/filter UI to normal reading mode.
- Add screenshot assets and final production QA notes before binding any custom domain.

## Credits

Built upon the open-source `folio-2019` project by Bruno Simon. The original project is licensed under the MIT License. Modifications include the bzmxs.cn blog content system, redesigned content areas, Chinese interface, and personal branding.

The official newer portfolio source has also been audited at [brunosimon/folio-2025](https://github.com/brunosimon/folio-2025), linked from bruno-simon.com → Behind the scene → Source code. The audited repository is MIT licensed and includes Blender/source assets; see [LICENSE.folio-2025.md](./LICENSE.folio-2025.md) and [docs/new-portfolio-source-audit.md](./docs/new-portfolio-source-audit.md).

See [LICENSE.folio-2019.md](./LICENSE.folio-2019.md), [LICENSE.folio-2025.md](./LICENSE.folio-2025.md), and [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for license and attribution details.
