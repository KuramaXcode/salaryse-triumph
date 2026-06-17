import React, { useRef, useState, useCallback, useEffect } from 'react';
import './Camera.css';
import { type HouseVariant } from './Quiz';
import { playCameraShutter } from '../hooks/useSound';

const STILL_THRESHOLD = 15;
const STILLNESS_DURATION = 1500;
type CaptureState = 'aligning' | 'countdown' | 'captured';

interface CameraProps {
    onCapture: (imageSrc: string) => void;
    theme: HouseVariant;
}

const Camera: React.FC<CameraProps> = ({ onCapture, theme }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const captureStateRef = useRef<CaptureState>('aligning');
    const offscreenCanvas = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const prevFrameRef = useRef<Uint8ClampedArray | null>(null);
    const rafRef = useRef<number>(0);
    const stillnessAccRef = useRef<number>(0);
    const lastTickRef = useRef<number>(0);
    const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [streamActive, setStreamActive] = useState<boolean>(false);
    const [errorMSG, setErrorMSG] = useState<string | null>(null);
    const [captureState, setCaptureStateRaw] = useState<CaptureState>('aligning');
    const [countdownValue, setCountdownValue] = useState<number | null>(null);
    const [flash, setFlash] = useState(false);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setStreamActive(true);
                setErrorMSG(null);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setErrorMSG("Unable to access camera. Please ensure permissions are granted.");
        }
    };

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            setStreamActive(false);
        }
    }, []);

    const setCaptureState = useCallback((s: CaptureState) => {
        captureStateRef.current = s;
        setCaptureStateRaw(s);
    }, []);

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

    const fireCapture = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        setCaptureState('captured');
        setFlash(true);
        capturePhoto();
    }, [setCaptureState, capturePhoto]);

    useEffect(() => {
        if (countdownValue === null) return;
        let alive = true;
        if (countdownValue === 0) {
            if (alive) fireCapture();
            return () => { alive = false; };
        }
        const timer = setTimeout(() => {
            setCountdownValue(v => (v !== null ? v - 1 : null));
        }, 1000);
        countdownTimerRef.current = timer;
        return () => { alive = false; clearTimeout(timer); };
    }, [countdownValue, fireCapture]);

    const startDetectionLoop = useCallback(() => {
        const oc = offscreenCanvas.current;
        oc.width = 160;
        oc.height = 90;
        const ctx = oc.getContext('2d', { willReadFrequently: true });
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

            let frame: ImageData | null = null;
            try {
                ctx.drawImage(video, 0, 0, 160, 90);
                frame = ctx.getImageData(0, 0, 160, 90);
            } catch {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            if (prevFrameRef.current && frame) {
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

            prevFrameRef.current = new Uint8ClampedArray(frame!.data);
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
    }, [setCaptureState]);

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

    return (
        <div className={`camera-container ${theme}`}>
            <h2>Present Yourself</h2>
            <p>Look into the glass...</p>

            {errorMSG ? (
                <div className="camera-error">
                    <p>{errorMSG}</p>
                    <button onClick={startCamera}>Try Again</button>
                </div>
            ) : (
                <div className="camera-frame">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        disablePictureInPicture
                        className={`video-feed ${streamActive ? 'active' : ''}`}
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />

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
                </div>
            )}
            {flash && (
                <div className="screen-flash" onAnimationEnd={() => setFlash(false)} />
            )}
        </div>
    );
};

export default Camera;
