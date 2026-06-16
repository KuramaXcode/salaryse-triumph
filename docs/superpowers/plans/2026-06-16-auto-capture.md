# Auto-Capture Camera Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the manual tap-to-capture button with a motion-stillness detection loop that shows a face-positioning oval, counts down 3-2-1 when the user holds still, fires a full-screen flash, then captures — while keeping the manual button as a fallback.

**Architecture:** All changes are confined to `Camera.tsx` and `Camera.css`. A `requestAnimationFrame` loop compares downscaled (160×90) canvas frames per-tick. When mean absolute diff < 15 for 1500ms, countdown starts. Motion during countdown resets it. On zero, flash + capture fires. An oval ring with a huge `box-shadow` creates the dim overlay without a separate element.

**Tech Stack:** React 19, TypeScript, native Web APIs (`requestAnimationFrame`, Canvas 2D, `getImageData`). No new dependencies.

---

### Task 1: Add constants, state, and refs

**Files:**
- Modify: `src/components/Camera.tsx`

- [ ] **Step 1: Update the React import to include useEffect**

The existing import line is:
```typescript
import React, { useRef, useState, useCallback } from 'react';
```

Replace it with:
```typescript
import React, { useRef, useState, useCallback, useEffect } from 'react';
```

Also replace the existing `React.useEffect` call (line ~60) with the named `useEffect`:
```typescript
// before
React.useEffect(() => {
    startCamera();
    return () => { stopCamera(); };
}, [stopCamera]);

// after — Task 2 will replace this entirely, but fix the form now
useEffect(() => {
    startCamera();
    return () => { stopCamera(); };
}, [stopCamera]);
```

- [ ] **Step 3: Add constants and new type above the component**

Open `src/components/Camera.tsx`. After the imports, add:

```typescript
// Motion detection constants — tunable
const STILL_THRESHOLD = 15;      // Mean absolute diff per channel (0–255); lower = more sensitive
const STILLNESS_DURATION = 1500; // ms of continuous stillness before countdown starts

type CaptureState = 'aligning' | 'countdown' | 'captured';
```

- [ ] **Step 4: Add new state variables inside the component**

Inside `Camera`, after the existing `useState` declarations, add:

```typescript
const [captureState, setCaptureStateRaw] = useState<CaptureState>('aligning');
const [countdownValue, setCountdownValue] = useState<number | null>(null);
const [flash, setFlash] = useState(false);
```

- [ ] **Step 5: Add refs for the rAF loop**

After the existing `useRef` declarations, add:

```typescript
const captureStateRef = useRef<CaptureState>('aligning');
const offscreenCanvas = useRef<HTMLCanvasElement>(document.createElement('canvas'));
const prevFrameRef = useRef<Uint8ClampedArray | null>(null);
const rafRef = useRef<number>(0);
const stillnessAccRef = useRef<number>(0);
const lastTickRef = useRef<number>(0);
const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

- [ ] **Step 6: Add the setCaptureState helper**

After the refs block, add:

```typescript
const setCaptureState = useCallback((s: CaptureState) => {
    captureStateRef.current = s;
    setCaptureStateRaw(s);
}, []);
```

- [ ] **Step 7: Wrap capturePhoto in useCallback**

Replace the existing `capturePhoto` function with a `useCallback` version so `fireCapture` can depend on it:

```typescript
const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            playCameraShutter();
            const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
            stopCamera();
            onCapture(imageSrc);
        }
    }
}, [stopCamera, onCapture]);
```

- [ ] **Step 8: Verify TypeScript compiles**

```bash
cd /Users/rajatlal/Code/SalarySe_Triumph_v1_Final && npx tsc --noEmit
```

Expected: no errors.

---

### Task 2: Implement the motion detection loop and fireCapture

**Files:**
- Modify: `src/components/Camera.tsx`

- [ ] **Step 1: Add fireCapture**

After `capturePhoto`, add:

```typescript
const fireCapture = useCallback(() => {
    setCaptureState('captured');
    setFlash(true);
    capturePhoto();
}, [setCaptureState, capturePhoto]);
```

- [ ] **Step 2: Add the countdown useEffect**

After `fireCapture`, add:

```typescript
useEffect(() => {
    if (countdownValue === null) return;
    if (countdownValue === 0) {
        fireCapture();
        return;
    }
    const timer = setTimeout(() => {
        setCountdownValue(v => (v !== null ? v - 1 : null));
    }, 1000);
    countdownTimerRef.current = timer;
    return () => clearTimeout(timer);
}, [countdownValue, fireCapture]);
```

- [ ] **Step 3: Add startDetectionLoop**

After the countdown effect, add:

```typescript
const startDetectionLoop = useCallback(() => {
    const oc = offscreenCanvas.current;
    oc.width = 160;
    oc.height = 90;
    const ctx = oc.getContext('2d');
    if (!ctx) return;

    lastTickRef.current = performance.now();
    stillnessAccRef.current = 0;
    prevFrameRef.current = null;

    const tick = (now: number) => {
        if (captureStateRef.current === 'captured') return;

        const video = videoRef.current;
        if (!video || video.readyState < 2) {
            rafRef.current = requestAnimationFrame(tick);
            return;
        }

        const elapsed = now - lastTickRef.current;
        lastTickRef.current = now;

        ctx.drawImage(video, 0, 0, 160, 90);
        const frame = ctx.getImageData(0, 0, 160, 90);

        if (prevFrameRef.current) {
            const data = frame.data;
            const prev = prevFrameRef.current;
            let diff = 0;
            for (let i = 0; i < data.length; i += 4) {
                diff += Math.abs(data[i]     - prev[i]);
                diff += Math.abs(data[i + 1] - prev[i + 1]);
                diff += Math.abs(data[i + 2] - prev[i + 2]);
            }
            const mad = diff / (160 * 90 * 3);

            if (mad < STILL_THRESHOLD) {
                stillnessAccRef.current += elapsed;
            } else {
                stillnessAccRef.current = 0;
                if (captureStateRef.current === 'countdown') {
                    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
                    countdownTimerRef.current = null;
                    setCaptureState('aligning');
                    setCountdownValue(null);
                }
            }

            if (
                stillnessAccRef.current >= STILLNESS_DURATION &&
                captureStateRef.current === 'aligning'
            ) {
                stillnessAccRef.current = 0;
                setCaptureState('countdown');
                setCountdownValue(3);
            }
        }

        prevFrameRef.current = new Uint8ClampedArray(frame.data);
        rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
}, [setCaptureState]);
```

- [ ] **Step 4: Wire loop to stream activation — replace the mount useEffect**

Replace the existing mount/unmount `useEffect` (the one that calls `startCamera()`) with two effects:

```typescript
// Start/stop detection loop when stream changes
useEffect(() => {
    if (streamActive) {
        startDetectionLoop();
    } else {
        cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
}, [streamActive, startDetectionLoop]);

// Start camera on mount, cleanup on unmount
useEffect(() => {
    startCamera();
    return () => stopCamera();
}, [stopCamera]);
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 3: Update JSX — overlay and flash

**Files:**
- Modify: `src/components/Camera.tsx`

- [ ] **Step 1: Replace the streamActive block inside camera-frame**

Find this block inside the `<div className="camera-frame">`:

```tsx
{streamActive && (
    <div className="capture-overlay">
        <button className="capture-btn" onClick={capturePhoto}>
            Capture Image
        </button>
    </div>
)}
```

Replace it with:

```tsx
{streamActive && (
    <>
        {/* Oval ring — box-shadow creates the surrounding dim overlay */}
        <div className={`auto-capture-ring${captureState === 'countdown' ? ' counting' : ''}`} />

        {/* Countdown number — shown inside the oval while counting */}
        {countdownValue !== null && countdownValue > 0 && (
            <div className="auto-capture-countdown">{countdownValue}</div>
        )}

        {/* Hint text — shown while waiting for stillness */}
        {captureState === 'aligning' && (
            <div className="auto-capture-hint">Hold still to capture</div>
        )}

        {/* Manual fallback button */}
        <div className="capture-overlay">
            <button
                className="capture-btn"
                onClick={capturePhoto}
                title="Capture manually"
            />
        </div>
    </>
)}
```

- [ ] **Step 2: Add the full-screen flash div**

Immediately before the closing `</div>` of the outermost `<div className={`camera-container ${theme}`}>`, add:

```tsx
{flash && (
    <div className="screen-flash" onAnimationEnd={() => setFlash(false)} />
)}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 4: Add CSS styles

**Files:**
- Modify: `src/components/Camera.css`

- [ ] **Step 1: Append auto-capture styles to the end of Camera.css**

```css
/* ── Auto-capture overlay ─────────────────────────────────────────────── */

.auto-capture-ring {
    position: absolute;
    width: 260px;
    height: 320px;
    border-radius: 50%;
    left: 50%;
    top: 12%;
    transform: translateX(-50%);
    /* Huge box-shadow dims everything outside the oval */
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
    border: 3px solid rgba(255, 255, 255, 0.6);
    transition: border-color 0.3s ease;
    pointer-events: none;
    z-index: 1;
}

.auto-capture-ring.counting {
    border-color: #22c55e;
    animation: ring-pulse 800ms ease-in-out infinite;
}

@keyframes ring-pulse {
    0%, 100% { transform: translateX(-50%) scale(1); }
    50%       { transform: translateX(-50%) scale(1.02); }
}

.auto-capture-countdown {
    position: absolute;
    left: 50%;
    /* oval top (12%) + half oval height (160px) = vertical center of oval */
    top: calc(12% + 160px);
    transform: translate(-50%, -50%);
    font-size: 5rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    pointer-events: none;
    z-index: 2;
}

.auto-capture-hint {
    position: absolute;
    bottom: 110px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    pointer-events: none;
    z-index: 2;
}

/* ── Full-screen flash ────────────────────────────────────────────────── */

.screen-flash {
    position: fixed;
    inset: 0;
    background: white;
    z-index: 9999;
    pointer-events: none;
    animation: flash-fade 300ms ease-out forwards;
}

@keyframes flash-fade {
    from { opacity: 1; }
    to   { opacity: 0; }
}
```

---

### Task 5: Manual verification and commit

**Files:**
- No code changes — run and observe

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test auto-capture golden path**

1. Open the app and proceed to the camera step
2. The camera frame should show the dim overlay with an oval cutout — you see the live video clearly inside the oval, dark outside
3. Move your face around — the oval ring stays white/muted, no countdown
4. Hold still for ~1.5 seconds — ring turns green and pulses, countdown 3-2-1 appears centered in the oval
5. Stay still through countdown — on 0: full screen flashes white briefly, shutter sound plays, camera closes and proceeds to next step
6. Re-test: move during countdown — numbers should reset silently, ring returns to white

- [ ] **Step 3: Test fallback button**

1. Reach the camera step
2. Click the circular button at the bottom without holding still
3. Should capture immediately — flash + shutter + proceeds

- [ ] **Step 4: Commit**

```bash
git add src/components/Camera.tsx src/components/Camera.css
git commit -m "feat: add auto-capture with face-oval overlay, stillness detection, and screen flash"
```
