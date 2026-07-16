# bzmxs-world

A warm low-poly 3D personal blog with an explorable world, built with Next.js and React Three Fiber.

## Screenshot

Screenshot placeholder: add a desktop capture of the central island after the visual direction is finalized.

## Features

- Low-poly 3D island with a central plaza, Library, Training Ground, and Home areas.
- Temporary small car character with WASD and arrow-key movement.
- Smooth third-person follow camera.
- Basic ground and building collisions with React Three Rapier.
- Building proximity detection with keyboard and click interaction prompts.
- Two-dimensional article panel for area-specific content.
- Normal reading mode that does not load the 3D scene.
- MDX-based posts with area, category, and tag metadata.
- Static article detail pages that can be refreshed directly.
- Basic mobile virtual direction controls.
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

- `W` / `A` / `S` / `D`: move the vehicle.
- Arrow keys: move the vehicle.
- `E`: open the nearby building content panel.
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

This is a reliable MVP for the first phase. It focuses on a maintainable 3D exploration shell, a working MDX content system, and a separate normal reading mode. The current 3D models are intentionally built from simple geometry and do not use large external assets.

## Roadmap

- Add search, category filters, and archive pages.
- Improve mobile exploration and camera controls.
- Replace sample MDX files with real blog content.
- Add polished visual assets and screenshots.
- Add optional map markers and direct area navigation.
- Prepare a later migration workflow for old blog posts without touching the old server.
