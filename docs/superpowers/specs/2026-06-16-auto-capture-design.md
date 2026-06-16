# Auto-Capture Camera Design

**Date:** 2026-06-16  
**Status:** Approved  
**Scope:** `src/components/Camera.tsx` only — no other files change

---

## Problem

Users currently must manually tap a button to capture their photo. This creates friction around distance, framing, and timing. The goal is to remove that decision: the camera waits for the user to hold still, counts down, and captures automatically — with a screen flash for added light.

---

## Approach

Motion-stillness detection via `requestAnimationFrame` pixel diff on a downscaled offscreen canvas. No new dependencies. Works on all browsers including Safari.

Manual capture button is kept as a fallback.

---

## State Model

Four internal states drive all UI and logic:

| State | Description |
|---|---|
| `aligning` | Stream active; person is moving or not yet still enough |
| `still` | Stillness threshold met; 1500ms accumulator reached |
| `countdown` | 3-2-1 timer running |
| `captured` | Photo taken; detection loop stops |

Additional state:
- `countdownValue: 3 | 2 | 1 | null` — drives the visible number
- `flash: boolean` — triggers the full-screen white flash div

---

## Motion Detection Loop

Runs via `requestAnimationFrame` while the stream is active. Stops when state reaches `captured`.

**Each tick:**
1. Draw current video frame to a persistent offscreen `<canvas>` at **160×90px** (downscaled for performance — ~14k pixels vs ~1M at full resolution)
2. Call `getImageData()` on the offscreen canvas
3. Compute mean absolute diff (MAD) across R, G, B channels vs the previous frame's pixel data
4. **If MAD < 15** (still): add elapsed ms to a stillness accumulator. *(Threshold 15 is tunable — lower = more sensitive, higher = requires more stillness)*
5. **If MAD ≥ 15** (moving): reset accumulator to 0; if countdown is active, cancel it and return to `aligning`
6. **If accumulator ≥ 1500ms** and state is `aligning`: transition to `countdown`, set `countdownValue` to 3. *(1500ms is tunable — increase if false triggers occur in practice)*
7. Store current frame pixel data as `prevFrameRef` for next tick

**Countdown timing:**
- On entry to `countdown`: `setCountdownValue(3)`
- `useEffect` watches `countdownValue` — on each change, sets a 1000ms `setTimeout` to decrement
- At 0: fire capture sequence (see below)
- If motion detected mid-countdown: clear the timeout, reset `countdownValue` to null, set state back to `aligning`

**Refs used:**
- `offscreenCanvasRef` — persistent 160×90 canvas element (never rendered)
- `prevFrameRef` — `Uint8ClampedArray` of previous frame pixel data
- `rafRef` — rAF handle for cancellation on unmount / stream stop
- `stillnessAccRef` — ms accumulated of continuous stillness
- `lastTickRef` — timestamp of previous rAF tick (for delta-time calculation)
- `countdownTimerRef` — setTimeout handle for countdown decrement

---

## Capture Sequence

When `countdownValue` reaches 0:
1. Set `flash: true` — renders full-screen white div immediately
2. Call `capturePhoto()` synchronously — white screen adds real illumination to the subject's face at capture moment
3. Schedule `setFlash(false)` after 300ms (CSS transition handles the fade)
4. Set state to `captured` — stops the rAF loop
5. The returned photo base64 is passed up via the existing `onCapture` prop — no change to AppV3

---

## Overlay UI

Rendered as absolutely-positioned children over the `<video>` element. The video wrapper gets `position: relative`.

### Dim layer
- `position: absolute; inset: 0`
- `background: rgba(0,0,0,0.55)`
- Oval cutout via inline SVG `clipPath` using even-odd fill rule. The SVG is rendered as a sibling to the dim div; the dim div references the clip via `clipPath`. Oval dimensions: **260px wide × 320px tall**, centred horizontally, top edge at **12% from the top** of the video container (face-height bias). These values are constants — no runtime computation needed.

### Oval ring
- `position: absolute` — matched to oval cutout position
- `border-radius: 50%`
- No background fill
- `border: 3px solid` — color transitions:
  - `rgba(255,255,255,0.6)` during `aligning`
  - `#22c55e` (green-500) during `countdown` with a CSS `pulse` keyframe animation (scale 1 → 1.02 → 1, 800ms loop)

### Countdown number
- Absolutely centred within oval bounds
- `font-size: 5rem; font-weight: 700; color: white`
- Visible only when `countdownValue` is not null

### Hint text
- Below oval, centred
- `"Hold still to capture"` — visible during `aligning`, hidden during `countdown`

### Flash div
```
position: fixed; inset: 0; z-index: 9999;
background: white;
opacity: flash ? 1 : 0;
transition: opacity 300ms ease-out;
pointer-events: none;
```

---

## Manual Fallback Button

Existing capture button is relabelled *"Capture manually"* and remains visible below the video at all times during `aligning` and `countdown` states. Clicking it fires `capturePhoto()` directly, skipping detection.

---

## Cleanup

On component unmount (or `stopCamera()`):
- Cancel rAF loop via `cancelAnimationFrame(rafRef.current)`
- Clear any active countdown `setTimeout`
- Release `prevFrameRef` data

---

## What Does Not Change

- `capturePhoto()` function — unchanged
- `onCapture` prop interface — unchanged
- `AppV3.tsx` — no changes
- All other components — no changes
- No new npm dependencies
