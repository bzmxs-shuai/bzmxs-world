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

## Google Draco Decoder

- Source included in `folio-2025`: `public/folio-2025/draco/`
- Upstream project: https://github.com/google/draco
- License: Apache License 2.0, as noted by the included Draco README.

## Runtime Libraries

The Next.js application depends on open-source npm packages including Next.js, React, Zustand, Framer Motion, MDX tooling, Tailwind CSS, ESLint, Prettier, and Prisma-related packages. The static `folio-2025` runtime bundle includes its own runtime libraries from the audited upstream project. License metadata is managed through upstream notices and npm package metadata.

## Asset Notes

The 3D models, shaders, low-poly runtime assets, and sound effects under `public/folio-2025/` are retained from the MIT-licensed `folio-2025` project unless otherwise noted. They are not claimed as original bzmxs.cn work.
