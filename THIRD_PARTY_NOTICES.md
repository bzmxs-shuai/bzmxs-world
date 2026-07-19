# Third Party Notices

## Bruno Simon folio-2025

- Official public site source path: <https://bruno-simon.com/> → Behind the scene → Source code
- Source: https://github.com/brunosimon/folio-2025
- Audited commit: `41046b57eeed8d156d9c3fd7fa259900baef7816`
- License: MIT License
- Copyright: Copyright (c) 2025 Bruno Simon
- Preserved license file: `LICENSE.folio-2025.md`

The `folio-2025` repository is the official source for Bruno Simon's newer public portfolio. It contains the Blender source file `resources/folio-2025.blend`, runtime code under `sources/Game/`, and public runtime assets under `static/`.

Important notes:

- The public README states that server code is not shared, while the portfolio works without it.
- Music files under `static/sounds/musics/` include a CC0 1.0 Universal license file.
- Any adoption into this project must remove or replace Bruno Simon personal identity, original customer/project content, Three.js Journey promotions, private server/ranking/whisper behavior, analytics, and unverified third-party content.
- The active `/explore` runtime uses a patched static build of the public `folio-2025` frontend under `public/folio-2025`. Modifications remove public-facing personal branding, analytics, private server messaging, project/social data, and add a bzmxs.cn blog bridge.

## Bruno Simon folio-2019

- Source: https://github.com/brunosimon/folio-2019
- License: MIT License
- Copyright: Copyright (c) 2019 Bruno SIMON
- Preserved license file: `LICENSE.folio-2019.md`

This project uses the open-source `folio-2019` project as the 3D runtime base. The copied and modified parts are used to preserve the original low-poly driving experience, including vehicle physics, camera behavior, collisions, pushable objects, loading flow, sound framework, shaders, and mobile controls.

Copied or adapted source paths:

- `lib/folio-runtime/`
- `lib/shaders/`
- `lib/images/mobile/`
- `public/folio/models/`
- `public/folio/sounds/`
- `public/folio/draco/`

Modified for this project:

- `lib/folio-runtime/Application.js`
- `lib/folio-runtime/Resources.js`
- `lib/folio-runtime/Utils/Loader.js`
- `lib/folio-runtime/World/index.js`
- `lib/folio-runtime/World/Controls.js`
- `lib/folio-runtime/World/Sounds.js`
- `lib/folio-runtime/World/Sections/IntroSection.js`
- `lib/folio-runtime/World/Sections/BlogAreasSection.js`

Removed or excluded from the active runtime:

- Bruno Simon personal metadata, name display, contact links, and analytics snippets.
- Three.js Journey promotional overlay and discount easter egg.
- Original client/project showcase list and external project links.
- Original social images and favicon branding.
- Customer project slide images and unrelated award/contact label assets.

## Google Draco Decoder

- Source included in `folio-2019`: `public/folio/draco/`
- Upstream project: https://github.com/google/draco
- License: Apache License 2.0, as noted by the included Draco README.

## Runtime Libraries

The project depends on open-source npm packages including Next.js, React, Three.js, Cannon.js, GSAP, Howler.js, Zustand, Framer Motion, MDX tooling, Tailwind CSS, ESLint, and Prettier. Their license metadata is managed through npm package metadata and lockfiles.

## Asset Notes

The 3D models, shaders, low-poly runtime assets, and sound effects under `public/folio/`, `lib/folio-runtime/`, `lib/shaders/`, and `lib/images/mobile/` are retained from the MIT-licensed `folio-2019` project unless otherwise noted. They are not claimed as original bzmxs.cn work.
