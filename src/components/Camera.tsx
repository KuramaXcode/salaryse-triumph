import React, { useRef, useState, useCallback } from 'react';
import './Camera.css';
import { type HouseVariant } from './Quiz';
import { playCameraShutter } from '../hooks/useSound';

interface CameraProps {
    onCapture: (imageSrc: string) => void;
    theme: HouseVariant;
}

const Camera: React.FC<CameraProps> = ({ onCapture, theme }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [streamActive, setStreamActive] = useState<boolean>(false);
    const [errorMSG, setErrorMSG] = useState<string | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 1280, height: 720 }
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

    const capturePhoto = () => {
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
    };

    // Start camera on mount, cleanup on unmount
    React.useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
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
                        <div className="capture-overlay">
                            <button className="capture-btn" onClick={capturePhoto}>
                                Capture Image
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Camera;
