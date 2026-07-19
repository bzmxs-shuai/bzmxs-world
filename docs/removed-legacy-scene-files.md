# Removed / Disabled Legacy Scene Files

This branch does not physically delete the old React Three Fiber scene files yet, because the new runtime integration still needs broader Vercel Preview validation. The old scene entry points have been disabled for the public routes by replacing `/` and `/explore` with `FolioExploreClient`.

## Disabled Runtime Entry Points

| Old entry | Status | Replacement |
|---|---|---|
| `components/world/WorldClient.tsx` from `/` | No longer used by `app/page.tsx` | `components/folio/FolioExploreClient.tsx` |
| `components/world/WorldClient.tsx` from `/explore` | No longer used by `app/explore/page.tsx` | `components/folio/FolioExploreClient.tsx` |
| Programmatic Library geometry | Kept in Git history, not active on `/` or `/explore` | Official Lab area |
| Programmatic Training Ground geometry | Kept in Git history, not active on `/` or `/explore` | Official Circuit + Bowling areas |
| Programmatic Home geometry | Kept in Git history, not active on `/` or `/explore` | Official Career area |

## Files To Delete After Preview Sign-off

- `components/world/LibraryBuilding.tsx`
- `components/world/TrainingGround.tsx`
- `components/world/HomeBuilding.tsx`
- Old R3F-only scene modules under `components/world/`
- Old folio-2019 bridge modules under `lib/folio-runtime/`
- Old public folio-2019 decoder/static files under `public/folio/`

Deletion is intentionally postponed until the folio-2025 Preview is visually confirmed online.

