# folio-2025 Asset Usage Audit

Original copied runtime size before this pass: `203M`.

Optimized runtime size after this pass: `36M`.

| Resource | Size | Used By | Needed | Compressible / Removed | Deletion Risk |
|---|---:|---|---|---|---|
| `sounds/musics/*.wav` | ~130M | Not referenced by runtime; mp3 versions are referenced | No | Removed | Low |
| `sounds/musics/*.mp3` | ~18M | `Audio.js` music jukebox | Yes | Kept | Medium |
| `projects/images/*` | ~10M | Disabled `ProjectsArea` only | No | Removed | Low |
| `career/*` textures | <1M | Original career labels; Home hides labels | No | Removed from resource list and public output | Low |
| `draco/*encoder*` | ~1.8M | Encoding only, not browser decoding | No | Removed | Low |
| `*-compressed.glb` | varies | Compressed runtime resource path | Yes | Kept | High |
| uncompressed `*.glb` with compressed sibling | varies | Not used when `VITE_COMPRESSED=1` | No | Removed | Medium |
| `*.ktx` texture siblings | varies | Compressed runtime resource path | Yes | Kept | High |
| `*.png` with same-name `*.ktx` or `*.webp` sibling | varies | Not used by compressed runtime or UI | No | Removed | Medium |
| `lab/images/{attractors,particles-system,stylized-low-poly,holographic-terrain,organic-sphere,infinite-world}*.ktx` | <1M | Blog Library carousel data | Yes | Kept | High |
| unused `lab/images/*` examples | <1M | Not referenced by current blog data | No | Removed | Low |
| `assets/index-*.js` | ~4.8M | Runtime bundle | Yes | Kept | High |
| `rapier_wasm3d_bg-*.wasm` | ~1.6M | Physics runtime | Yes | Kept | High |
| `basis/*decoder*` / `basis_transcoder.*` | ~0.6M | KTX/Basis compressed textures | Yes | Kept | High |
| `draco/*decoder*` | ~1.6M | Draco GLB decoding | Yes | Kept | High |
| source maps | 0 in current build | Debug only | No | Removed if present | Low |

## Notes

- `VITE_COMPRESSED=1` is enabled for the folio build, so the runtime requests compressed models and KTX textures.
- No Blender source files are deployed.
- Ordinary `/reading` and `/posts/[slug]` routes do not import or load `public/folio-2025` resources.
- Further reduction is possible by cutting unused official areas from the model/resources, but this pass avoids deleting core scene content that may affect driving continuity.
