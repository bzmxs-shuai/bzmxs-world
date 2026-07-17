# folio-2025 Runtime Start Flow

## Official Flow

The official runtime creates the `Game` instance inside `sources/index.js`. `Game.init()` loads the first intro resource batch, creates the renderer, starts rendering, then `Reveal.updateStep(0)` displays the intro island and the `CLICK TO START` prompt.

The official start action is intentionally bound to real input inside the runtime document:

- pointer click on the intro reveal sphere through `RayCursor`
- keyboard/gamepad intro actions such as `Enter`, `W`, `D`, arrow keys, or gamepad cross
- audio unlock happens in `Reveal.updateStep(1)` through `this.game.audio.init()`

The Next.js shell must not fake this click because browser audio unlock depends on a trusted user gesture in the runtime document.

## Current Failure Cause

The previous `/explore` integration exposed outer HUD buttons and a loading layer above the iframe. The main scene itself worked, but automated checks often clicked the outer document or the HUD rather than the iframe canvas. That meant the official `RayCursor` click and audio unlock did not always receive the trusted gesture.

The runtime itself is same-origin and accepts direct clicks reliably when `/folio-2025/index.html` is opened directly.

## Fix

- Keep the official start flow inside the iframe.
- Make the loading layer `pointer-events: none`.
- Move the HUD to the top-right and make informational HUD cards non-interactive.
- Leave the iframe as the full viewport click target.
- Keep outer buttons only for explicit shell commands such as Reading Mode, Open Area, and Respawn.
- Add `tabIndex` and `allow="autoplay; gamepad; fullscreen"` to the iframe.
- Add structured bridge commands and runtime events:
  - `folio:ready`
  - `folio:start`
  - `folio:state`
  - `folio:zone-enter`
  - `folio:zone-leave`
  - `folio:open-content`
  - `folio:pause`
  - `folio:resume`
  - `folio:respawn`
  - `folio:error`

## MutationObserver Result

The previous observed error appeared only in the iframe wrapper test and not in the direct runtime route. The rebuilt runtime now forwards `error` and `unhandledrejection` events with stack data to the Next shell. Browser verification after this change is used to confirm whether any observer failure remains.

## Verification Notes

- Desktop: click directly inside the 3D scene prompt.
- Mobile: tap directly inside the 3D scene prompt; the official touch input and nipple control remain responsible for movement.
- The Next shell does not synthesize start clicks.
