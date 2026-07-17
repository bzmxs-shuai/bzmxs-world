# folio-2025 Runtime Verification

Date: 2026-07-17
Branch: `feature/new-portfolio-cms-rebuild`

## Official Source

- Official website path: `bruno-simon.com` -> Behind the scene -> Source code
- Repository: <https://github.com/brunosimon/folio-2025>
- Commit: `41046b57eeed8d156d9c3fd7fa259900baef7816`
- License: MIT, preserved in `LICENSE.folio-2025.md`

## Environment

| Item | Result |
|---|---|
| Node.js | `v24.14.0` from the Codex bundled runtime |
| Official package manager | README documents `npm install --force`, `npm run dev`, `npm run build` |
| Actual package manager used locally | `pnpm 11.9.0`, because this environment does not expose an `npm` executable |
| Dev command used | `pnpm exec vite --mode development --host 127.0.0.1 --port 1234` |
| Build command used | `pnpm run build` |

## Compatibility Notes

- The unmodified official build failed under the current pnpm/Vite/esbuild resolution with `vite-plugin-top-level-await` target conversion:
  `Transforming destructuring to the configured target environment ... is not supported yet`.
- The minimal compatibility fix was adding `build.target = "esnext"` in the temporary official clone's `vite.config.js`.
- `pnpm approve-builds` was required for `@swc/core`, `esbuild`, and `sharp`.
- Static asset path warnings for fonts/UI files were emitted by Vite but resolved at runtime.

## Development Runtime Result

- Dev server started at `http://127.0.0.1:1234/`.
- Browser verification showed:
  - Canvas rendered.
  - Official loading/intro state displayed.
  - Vehicle appeared after entering the runtime.
  - Official landing scene, car, terrain, lighting, HUD, map/menu buttons and low-poly assets were visible.
  - Console warnings/errors: none captured during local verification.
  - Server status was offline, which is expected because the official README states server code is not shared and the portfolio works without it.

## Production Build Result

- Production build succeeded after the `esnext` target compatibility fix.
- Production preview at `http://127.0.0.1:1235/` rendered the official intro/loading scene and vehicle.
- Captured runtime state included `data-game-public="true"` after the bzmxs bridge patch.

## Server-Dependent Features

| Feature | Server dependency | Local no-server behavior |
|---|---|---|
| WebSocket server | `VITE_SERVER_URL` | Empty, runtime marks server offline |
| Circuit leaderboard | Private server data | UI can show offline/no score state |
| Whispers | Private server and public user messages | Disabled in the bzmxs build |
| Analytics | Google tag in original HTML | Removed in the bzmxs build |

