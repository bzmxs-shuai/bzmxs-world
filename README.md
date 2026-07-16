# bzmxs-world

A warm low-poly 3D personal blog with an explorable world, built with Next.js and React Three Fiber.

## Screenshot

Screenshot placeholder: add a desktop capture of the central island after the visual direction is finalized.

## Features

- Low-poly 3D island with a central plaza, Library, Training Ground, and Home areas.
- Game-like small vehicle with acceleration, inertia, braking, boost, and respawn.
- Smooth third-person follow camera with speed-based pullback and turn lag.
- Basic ground and building collisions with React Three Rapier.
- Building proximity detection with keyboard and click interaction prompts.
- Two-dimensional article panel for area-specific content.
- Normal reading mode that does not load the 3D scene.
- MDX-based posts with area, category, and tag metadata.
- Static article detail pages that can be refreshed directly.
- Basic mobile virtual direction controls.
- Low / Medium / High quality selector for the 3D world.
- Optional low-volume browser-generated vehicle audio with a mute toggle.
- Loading screen, WebGL fallback, and app-level error boundary.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Three Fiber
- Drei
- React Three Rapier
- Zustand
- Framer Motion
- MDX
- ESLint
- Prettier

## Installation

```bash
npm install
```

This project was initially validated in an environment that used `pnpm`, so `pnpm install` also works.

## Development

```bash
npm run dev
```

Open `http://localhost:3000` after the development server starts.

## Build

```bash
npm run lint
npm run typecheck
npm run build
```

## Controls

- `W` / `A` / `S` / `D`: drive the vehicle.
- Arrow keys: drive the vehicle.
- `Shift`: short boost.
- `Space`: small bounce.
- `R`: respawn at a safe point.
- `M`: open or close the map.
- `E` or `Enter`: open the nearby building content panel.
- `Escape`: close the article panel.
- Click the interaction prompt: open the nearby building content panel.
- Mobile: use the virtual direction buttons in the lower-left corner.

## Directory Structure

```text
app/                 Next.js routes, layout, error and not-found pages
components/world/    3D world, player, camera, island, buildings, interaction zones
components/interface/2D interface, navigation, article panel, map, loading and mobile controls
components/blog/     Article cards, article list, and MDX content wrapper
components/fallback/ WebGL fallback UI
content/posts/       MDX sample posts
lib/                 Post loading and MDX rendering helpers
store/               Zustand world state
public/              Static assets
```

## Current Status

This is a reliable 3D blog MVP with a scene-quality remaster pass. It focuses on a maintainable 3D exploration shell, a working MDX content system, a separate normal reading mode, and a warmer low-poly driving feel built from simple geometry rather than large external assets.

## Credits

The scene-quality remaster studied Bruno Simon's public Folio 2019 project for general low-poly portfolio design language, vehicle feel, camera easing, interaction-zone presentation, and sound/quality organization.

- Reference site: https://bruno-simon.com/
- Reference source: https://github.com/brunosimon/folio-2019
- License: MIT License

No Bruno Simon map, models, textures, audio files, personal content, brand text, or server code are included in this repository. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

## Roadmap

- Add search, category filters, and archive pages.
- Improve mobile exploration and camera controls.
- Replace sample MDX files with real blog content.
- Add polished visual assets and screenshots.
- Add optional map markers and direct area navigation.
- Prepare a later migration workflow for old blog posts without touching the old server.
