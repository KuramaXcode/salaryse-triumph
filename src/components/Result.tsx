import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Result.css';
import { type FinalResult, type HouseVariant } from './Quiz';
import html2canvas from 'html2canvas';
import { getDossierInsights } from '../services/dossierConfig';

type CardVersion = 'v2';

interface ResultProps {
    theme: HouseVariant;
    result: FinalResult;
    userPhoto: string | null;
    userName: string;
    onRestart: () => void;
    onCaptureReady?: (imageData: string, version: CardVersion) => void;
    aiError?: string | null;
    aiPrompt?: string | null;
    aiModel?: string | null;
    aiSuccess?: boolean;
    isGeneratingAvatar?: boolean;
    onRetryArt?: () => void;
    onFinalize?: () => void | Promise<void>;
    isFinalizing?: boolean;
    finalizeMessage?: string | null;
    captureCycle?: number;
    cardDriveUrl?: string | null;
    avatarDriveUrl?: string | null;
}

const houseDetails: Record<string, { motto: string; traits: string[]; color: string }> = {
    'Gryffindor': { motto: '"Where dwell the brave at heart!"', traits: ['Bold Risk-Taker', 'High-Reward Seeker', 'Impulsive but Courageous', 'Action-Oriented Investor'], color: '#740001' },
    'Ravenclaw': { motto: '"Wit beyond measure is man\'s greatest treasure."', traits: ['Data-Driven Analyst', 'Research-First Investor', 'Diversification Expert', 'Long-term Strategist'], color: '#0e1a40' },
    'Slytherin': { motto: '"Those cunning folk use any means to achieve their ends."', traits: ['Aggressive Wealth Builder', 'Opportunistic Investor', 'Power & Status Driven', 'Compound Growth Master'], color: '#1a472a' },
    'Hufflepuff': { motto: '"Those patient Hufflepuffs are true and unafraid of toil."', traits: ['Conservative Saver', 'Steady & Reliable', 'Emergency Fund Champion', 'Community-Minded Spender'], color: '#c79a1a' },
    'House Targaryen': { motto: '"Fire and Blood."', traits: ['Extreme Risk Taker', 'All-in Investor', 'Visionary Leader', 'Burn-to-Earn Mindset'], color: '#cc0000' },
    'House Lannister': { motto: '"A Lannister always pays his debts."', traits: ['Wealth Accumulator', 'Leverage Expert', 'Status Investor', 'Gold Hoarder'], color: '#8c0000' },
    'House Stark': { motto: '"Winter is Coming."', traits: ['Emergency Fund Builder', 'Conservative Planner', 'Debt-Free Advocate', 'Security-First Investor'], color: '#565656' },
    'House Baratheon': { motto: '"Ours is the Fury."', traits: ['Calculated Strategist', 'Value Investor', 'Balanced Portfolio Holder', 'Practical Decision Maker'], color: '#2a2a2a' },
    'Team Thor': { motto: '"Bring me Thanos!"', traits: ['Lightning-Fast Decisions', 'High-Impact Investor', 'Fearless Risk Taker', 'Cosmic-Scale Thinker'], color: '#1565c0' },
    'Team Strange': { motto: '"I\'ve seen 14 million futures."', traits: ['Multi-Variable Analyst', 'Future-Proofed Portfolio', 'Data-Driven Strategist', 'Risk Modeler'], color: '#4a148c' },
    'Team Iron Man': { motto: '"I am Iron Man."', traits: ['Innovation Investor', 'Tech Empire Builder', 'Disruptive Thinker', 'Billion-Dollar Mindset'], color: '#b71c1c' },
    'Team Cap': { motto: '"I can do this all day."', traits: ['Disciplined Saver', 'Values-Driven Investor', 'Long-Term Holder', 'Community First'], color: '#1a237e' },
    'The Sith Order': { motto: '"Peace is a lie, there is only passion."', traits: ['Aggressive Trader', 'Power Investor', 'High-Leverage Player', 'Dominance Seeker'], color: '#b71c1c' },
    'The Jedi Council': { motto: '"Do or do not. There is no try."', traits: ['Balanced Portfolio Master', 'Patient Investor', 'Wisdom-Driven', 'Long-term Visionary'], color: '#1b5e20' },
    'The Mandalorians': { motto: '"This is the way."', traits: ['Bounty Hunter of Deals', 'Asset Accumulator', 'Beskar-Grade Security', 'Never-Quit Investor'], color: '#37474f' },
    'The Rebel Alliance': { motto: '"Rebellions are built on hope."', traits: ['Grassroots Investor', 'Emergency Fund Builder', 'Community Wealth Creator', 'Resilient Saver'], color: '#e65100' },
    'Team Tokyo': { motto: '"I have nothing to lose."', traits: ['All-or-Nothing Mentality', 'Adrenaline Investor', 'High-Stakes Player', 'Impulse Decision Maker'], color: '#d50000' },
    'Team Professor': { motto: '"The plan. Always the plan."', traits: ['Master Strategist', 'Probability Calculator', 'Risk Mitigator', '20-Step-Ahead Planner'], color: '#1a1a1a' },
    'Team Berlin': { motto: '"I\'m not a good person."', traits: ['Luxury Investor', 'Power Negotiator', 'Status-Driven Buyer', 'Art Collector Mindset'], color: '#4e342e' },
    'Team Nairobi': { motto: '"Let the matriarchy begin!"', traits: ['Production Manager', 'Asset Protector', 'Steady Operator', 'Zero-Waste Investor'], color: '#880e4f' },
};

const Result: React.FC<ResultProps> = ({
    theme,
    result,
    userPhoto,
    userName,
    onRestart,
    onCaptureReady,
    aiError,
    aiPrompt,
    aiModel,
    aiSuccess = false,
    isGeneratingAvatar = false,
    onRetryArt,
    onFinalize,
    isFinalizing = false,
    finalizeMessage = null,
    captureCycle = 0,
    cardDriveUrl = null,
    avatarDriveUrl = null,
}) => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [cardReady, setCardReady] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [heroImageLoaded, setHeroImageLoaded] = useState(false);
    const [cachedCardImage, setCachedCardImage] = useState<string | null>(null);
    const [showCardModal, setShowCardModal] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const heroImageRef = useRef<HTMLImageElement>(null);
    const uploadedCycleRef = useRef<number>(-1);
    const captureAttemptRef = useRef(0);

    const details = houseDetails[result.house] || { motto: '', traits: [], color: '#333' };
    const dossier = getDossierInsights(result.scores, result.house);

    const extractDriveId = (url: string) => url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ?? null;

    const downloadPageUrl = useMemo(() => {
        if (!cardDriveUrl) return null;
        const cardId = extractDriveId(cardDriveUrl);
        if (!cardId) return null;
        const avatarId = avatarDriveUrl ? extractDriveId(avatarDriveUrl) : null;
        const base = typeof window !== 'undefined' ? window.location.origin : '';
        const params = new URLSearchParams({ card: cardId, name: userName, house: result.house });
        if (avatarId) params.set('avatar', avatarId);
        return `${base}/api/download-page?${params.toString()}`;
    }, [cardDriveUrl, avatarDriveUrl, userName, result.house]);

    const qrCodeUrl = useMemo(() => {
        if (!downloadPageUrl) return null;
        return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(downloadPageUrl)}&color=ffd700&bgcolor=03060d&margin=12`;
    }, [downloadPageUrl]);

    const waitForFonts = async () => {
        if (document.fonts && 'ready' in document.fonts) {
            try {
                await document.fonts.ready;
            } catch {
            }
        }
    };

    const waitForImages = async (root: HTMLElement) => {
        const images = Array.from(root.querySelectorAll('img'));
        if (!images.length) return;
        await Promise.all(images.map((img) => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            return new Promise<void>((resolve) => {
                const done = () => {
                    img.removeEventListener('load', done);
                    img.removeEventListener('error', done);
                    resolve();
                };
                img.addEventListener('load', done);
                img.addEventListener('error', done);
            });
        }));
    };

    const captureCardImage = async (
        format: 'image/png' | 'image/jpeg' = 'image/png',
        scale = 2,
    ): Promise<string | null> => {
        if (!cardRef.current) return null;
        const sourceNode = cardRef.current;

        // Always capture at the card's intended design size (420×800) so the
        // downloaded image looks identical regardless of the user's screen size.
        const CARD_W = 420;
        const CARD_H = 800;

        const clone = sourceNode.cloneNode(true) as HTMLElement;
        clone.classList.add('capture-safe');
        clone.classList.add('capture-clone');
        clone.style.width = `${CARD_W}px`;
        clone.style.height = `${CARD_H}px`;
        clone.style.maxWidth = 'none';
        clone.style.maxHeight = 'none';
        clone.style.transform = 'none';
        clone.style.transformOrigin = 'top left';

        // html2canvas doesn't honour object-fit on <img>; swap to a CSS background instead.
        const heroImg = clone.querySelector('img.hero-image') as HTMLImageElement | null;
        if (heroImg) {
            const heroSection = heroImg.closest('.card-hero-section') as HTMLElement | null;
            const src = heroImg.currentSrc || heroImg.src;
            if (heroSection && src) {
                heroSection.style.backgroundImage = `url("${src}")`;
                heroSection.style.backgroundSize = 'cover';
                heroSection.style.backgroundPosition = 'center 15%';
                heroSection.style.backgroundRepeat = 'no-repeat';
                heroImg.style.visibility = 'hidden';
            }
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'capture-clone-wrapper';
        wrapper.style.width = `${CARD_W}px`;
        wrapper.style.height = `${CARD_H}px`;
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);
        try {
            setIsCapturing(true);
            await waitForFonts();
            await waitForImages(clone);
            const canvas = await html2canvas(clone, {
                backgroundColor: '#03060d',
                scale,
                logging: false,
                useCORS: true,
                allowTaint: false,
                width: CARD_W,
                height: CARD_H,
            });
            if (format === 'image/jpeg') {
                return canvas.toDataURL('image/jpeg', 0.9);
            }
            return canvas.toDataURL('image/png');
        } catch (err) {
            console.error('Failed to capture dossier card:', err);
            return null;
        } finally {
            setIsCapturing(false);
            wrapper.remove();
        }
    };

    const StarRating = ({ value }: { value: number }) => {
        const fullCount = Math.max(3, Math.min(5, Math.round(value)));
        const stars = ['☆', '☆', '☆', '☆', '☆'];
        for (let i = 0; i < fullCount; i++) stars[i] = '★';

        return (
            <div className="star-row">
                {stars.map((s, i) => {
                    let starClass = 'star-icon';
                    if (s === '★') starClass += ' full';
                    else starClass += ' empty';
                    return <span key={i} className={starClass}>{s}</span>;
                })}
            </div>
        );
    };

    useEffect(() => {
        const delay = setTimeout(() => setCardReady(true), 300);
        return () => clearTimeout(delay);
    }, []);

    useEffect(() => {
        if (!userPhoto) {
            setHeroImageLoaded(true);
            return;
        }
        const img = heroImageRef.current;
        if (img && img.complete && img.naturalWidth > 0) {
            setHeroImageLoaded(true);
        } else {
            setHeroImageLoaded(false);
        }
    }, [userPhoto]);

    useEffect(() => {
        if (!onCaptureReady || !cardRef.current) return;
        if (uploadedCycleRef.current === captureCycle) return;
        if (!heroImageLoaded) return;

        captureAttemptRef.current = 0;
        let cancelled = false;

        const attemptCapture = async () => {
            if (cancelled) return;
            captureAttemptRef.current += 1;
            try {
                const dataUrl = await captureCardImage('image/jpeg');
                if (dataUrl) {
                    setCachedCardImage(dataUrl);
                    onCaptureReady(dataUrl, 'v2');
                    uploadedCycleRef.current = captureCycle;
                    return;
                }
            } catch (err) {
                console.error('Failed to capture dossier card:', err);
            }

            if (captureAttemptRef.current < 8) {
                setTimeout(attemptCapture, 600);
            }
        };

        const timer = setTimeout(attemptCapture, 450);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [captureCycle, heroImageLoaded, onCaptureReady]);

    const handleDownloadCard = async () => {
        const fileBase = `${userName || 'Character'}_Dossier_Card`.replace(/[^a-zA-Z0-9_-]/g, '_');

        let imageDataUrl = await captureCardImage('image/png', 2);
        if (!imageDataUrl) {
            await new Promise((resolve) => setTimeout(resolve, 220));
            imageDataUrl = await captureCardImage('image/png', 1.25);
        }
        if (!imageDataUrl && cachedCardImage) {
            imageDataUrl = cachedCardImage;
        }
        if (!imageDataUrl) {
            window.alert('Could not download full card right now. Please wait a moment and try again.');
            return;
        }

        const downloadLink = document.createElement('a');
        downloadLink.href = imageDataUrl;
        downloadLink.download = `${fileBase}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const handleOpenCardModal = async () => {
        let imageDataUrl = cachedCardImage;
        if (!imageDataUrl) {
            imageDataUrl = await captureCardImage('image/png', 2);
        }
        if (!imageDataUrl) {
            await new Promise((resolve) => setTimeout(resolve, 220));
            imageDataUrl = await captureCardImage('image/png', 1.25);
        }
        if (!imageDataUrl) {
            window.alert('Could not prepare the card preview right now. Please wait a moment and try again.');
            return;
        }
        setModalImage(imageDataUrl);
        setShowCardModal(true);
    };

    const handlePrintCard = async () => {
        const fileBase = `${userName || 'Character'}_Dossier_Card`.replace(/[^a-zA-Z0-9_-]/g, '_');
        let imageDataUrl = cachedCardImage;
        if (!imageDataUrl) {
            imageDataUrl = await captureCardImage('image/png', 2);
        }
        if (!imageDataUrl) {
            window.alert('Could not prepare print preview right now. Please wait a moment and try again.');
            return;
        }

        const printWindow = window.open('', '_blank', 'width=900,height=1200');
        if (!printWindow) return;

        printWindow.document.write(`
<!doctype html>
<html>
<head>
  <title>${fileBase}</title>
  <style>
    @page { size: auto; margin: 0; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: #000;
    }
    .wrap {
      width: 100%;
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      width: auto;
      height: 100vh;
      max-width: 100vw;
      object-fit: contain;
      display: block;
    }
  </style>
</head>
<body>
  <div class="wrap"><img id="cardImage" src="${imageDataUrl}" alt="Dossier Card" /></div>
  <script>
    const img = document.getElementById('cardImage');
    if (img) {
      img.onload = () => setTimeout(() => window.print(), 150);
      img.onerror = () => { document.body.innerHTML = '<div style="color:white;font-family:sans-serif;padding:24px;">Failed to load card image for print preview.</div>'; };
    }
  </script>
</body>
</html>
        `);
        printWindow.document.close();
        printWindow.focus();
    };

    return (
        <div className={`result-container ${theme}`}>
            <div className="house-glow" style={{ background: `radial-gradient(circle at center, ${details.color}25 0%, transparent 70%)` }} />

            <div className={`character-card-wrapper ${cardReady ? 'revealed' : ''}`}>
                <div
                    ref={cardRef}
                    className={`character-card v2 rekonstrukt ${isCapturing ? 'capture-safe' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={handleOpenCardModal}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleOpenCardModal();
                        }
                    }}
                >
                    <div className="card-inner-frame">
                        <div className="card-universe-label">SALARYSE TRIUMPH</div>

                        <div className="card-hero-section" style={{ borderColor: details.color }}>
                            {userPhoto ? (
                                <img
                                    ref={heroImageRef}
                                    src={userPhoto}
                                    alt="Participant"
                                    className="hero-image"
                                    crossOrigin="anonymous"
                                    onLoad={() => setHeroImageLoaded(true)}
                                    onError={() => setHeroImageLoaded(true)}
                                />
                            ) : (
                                <div className="hero-placeholder">
                                    <div className="avatar-shimmer"></div>
                                    <span>IDENTIFYING SUBJECT...</span>
                                </div>
                            )}

                            <div className="card-identity-bar">
                                <span className="v2-name">{userName.toUpperCase()}</span>
                                <span className="v2-salutation">{dossier.salutation}</span>
                            </div>
                        </div>

                        <div className="stats-star-grid">
                            <div className="star-stat-item">
                                <span className="star-label">RISK TOLERANCE</span>
                                <StarRating value={dossier.starScores.risk_taker} />
                            </div>
                            <div className="star-stat-item">
                                <span className="star-label">STRATEGIC DEPTH</span>
                                <StarRating value={dossier.starScores.analytical} />
                            </div>
                            <div className="star-stat-item">
                                <span className="star-label">GROWTH POTENTIAL</span>
                                <StarRating value={dossier.starScores.wealth_builder} />
                            </div>
                            <div className="star-stat-item">
                                <span className="star-label">STABILITY RATING</span>
                                <StarRating value={dossier.starScores.cautious_saver} />
                            </div>
                        </div>

                        <div className="dossier-insights">
                            <div className="insight-box strengths">
                                <span className="box-label">STRENGTHS</span>
                                <ul className="insight-list">
                                    <li>{dossier.strength1}</li>
                                    <li>{dossier.strength2}</li>
                                </ul>
                            </div>
                            <div className="insight-box weakness-fix">
                                <span className="box-label">WEAKNESS</span>
                                <ul className="insight-list">
                                    <li>{dossier.combinedWeakness}</li>
                                </ul>
                            </div>
                        </div>

                        <div className="house-banner">
                            <div className="house-banner-line"></div>
                            <span className="house-banner-text">{result.house.toUpperCase()}</span>
                            <div className="house-banner-line"></div>
                        </div>
                    </div>
                </div>
            </div>

            {userPhoto && (
                <div className="ai-status-controls">
                    {aiError && (
                        <div className="ai-status-tag error">⚠️ AI Error: {aiError.substring(0, 50)}...</div>
                    )}
                    {!aiError && aiSuccess && (
                        <div className="ai-status-tag success" onClick={() => setShowPrompt(!showPrompt)}>
                            ✨ AI Persona Generated (Tap to see prompt)
                        </div>
                    )}

                    {showPrompt && (aiPrompt || aiError) && (
                        <div className="ai-prompt-overlay" onClick={() => setShowPrompt(false)}>
                            <div className="ai-prompt-content">
                                <h3>AI Generation Info</h3>
                                <div className="ai-info-row">
                                    <span className="info-label">Model Used:</span>
                                    <span className="info-value">{aiModel || 'Unknown'}</span>
                                </div>
                                <div className="ai-info-row">
                                    <span className="info-label">Prompt:</span>
                                    <p className="prompt-text">{aiPrompt || 'Prompt not available'}</p>
                                </div>
                                {aiError && <p className="error-detail">Error: {aiError}</p>}
                                <button className="close-prompt">Close</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="external-ops">
                {onRetryArt && (
                    <button className="ops-btn retry-art-btn" onClick={onRetryArt} disabled={isGeneratingAvatar}>
                        {isGeneratingAvatar ? 'RETRYING ART...' : 'RETRY ART'}
                    </button>
                )}
                {onFinalize && (
                    <button className="ops-btn finalize-btn" onClick={() => onFinalize()} disabled={isFinalizing || isGeneratingAvatar}>
                        {isFinalizing ? 'FINALIZING...' : 'FINALIZE CARD'}
                    </button>
                )}
            </div>
            {finalizeMessage && <p className="finalize-note">{finalizeMessage}</p>}

            <div className="result-actions">
                <div className="primary-action-btn print-btn disabled">
                    TAP CARD TO OPEN
                </div>
                {cardReady && (
                    <button className="primary-action-btn scan-btn" onClick={() => setShowQR(true)}>
                        SCAN TO DOWNLOAD
                    </button>
                )}
                <button className="secondary-action-btn restart-btn" onClick={onRestart}>
                    BEGIN NEW CEREMONY
                </button>
            </div>

            {showQR && (
                <div className="qr-overlay" onClick={() => setShowQR(false)}>
                    <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
                        {qrCodeUrl ? (
                            <>
                                <p className="qr-eyebrow">SCAN WITH YOUR PHONE CAMERA</p>
                                <div className="qr-frame">
                                    <img src={qrCodeUrl} alt="Download QR Code" className="qr-image" />
                                </div>
                                <p className="qr-sub">Opens a download page in your browser</p>
                                <p className="qr-sub">Card + AI Portrait — no app needed</p>
                            </>
                        ) : (
                            <>
                                <p className="qr-eyebrow">PREPARING YOUR DOWNLOAD</p>
                                <div className="qr-preparing">
                                    <div className="qr-spinner"></div>
                                    <p className="qr-sub">Uploading card to cloud...</p>
                                    <p className="qr-sub">This takes a few seconds. Close and try again shortly.</p>
                                </div>
                            </>
                        )}
                        <button className="qr-close-btn" onClick={() => setShowQR(false)}>
                            CLOSE
                        </button>
                    </div>
                </div>
            )}

            {showCardModal && modalImage && (
                <div className="card-preview-overlay" onClick={() => setShowCardModal(false)}>
                    <div className="card-preview-modal" onClick={(e) => e.stopPropagation()}>
                        <img src={modalImage} alt="Dossier Card Preview" className="card-preview-image" />
                        <div className="card-preview-actions">
                            <button className="primary-action-btn print-btn" onClick={handleDownloadCard}>
                                DOWNLOAD IMAGE
                            </button>
                            <button className="secondary-action-btn print-btn" onClick={handlePrintCard}>
                                PRINT CARD
                            </button>
                            <button className="secondary-action-btn restart-btn" onClick={() => setShowCardModal(false)}>
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Result;
