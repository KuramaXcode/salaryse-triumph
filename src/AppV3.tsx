import { useEffect, useMemo, useRef, useState } from 'react';
import Camera from './components/Camera';
import Quiz, { type FinalResult, type HouseVariant } from './components/Quiz';
import SortingCeremony from './components/SortingCeremony';
import Result from './components/Result';
import DynamicBackground from './components/DynamicBackground';
import PageTransition from './components/PageTransition';
import { uploadPhotoToDrive, submitFinalCardToSheet, submitToGoogleSheet } from './utils/googleSheets';
import { generateAvatar, type AvatarResult } from './services/avatarService';
import { playClick, playAmbient, playHoverTick } from './hooks/useSound';
import './AppV3.css';

const themeConfig: Record<HouseVariant, { title: string; subtitle: string; welcome: string; className: string; icon: string }> = {
  hp: {
    title: 'Harry Potter',
    subtitle: 'Enter the halls of magic and find your house.',
    welcome: 'Hogwarts',
    className: 'hp-btn',
    icon: '⚡',
  },
  got: {
    title: 'Game of Thrones',
    subtitle: 'Winter is coming. Where do your loyalties lie?',
    welcome: 'Westeros',
    className: 'got-btn',
    icon: '⚔️',
  },
  marvel: {
    title: 'The Marvel Universe',
    subtitle: 'Assemble your team. Discover your heroic identity.',
    welcome: 'The Avengers Initiative',
    className: 'marvel-btn',
    icon: '🛡️',
  },
  sw: {
    title: 'Star Wars Galaxy',
    subtitle: 'The Force awakens. Choose your path.',
    welcome: 'The Galaxy',
    className: 'sw-btn',
    icon: '✦',
  },
  mh: {
    title: 'Money Heist',
    subtitle: 'Bella Ciao. The Professor needs you.',
    welcome: 'La Casa de Papel',
    className: 'mh-btn',
    icon: '🎭',
  },
};

type FlowStep = 'intro' | 'identity' | 'camera' | 'universe' | 'quiz' | 'sorting' | 'result';

function AppV3() {
  const [theme, setTheme] = useState<HouseVariant | null>(null);
  const [step, setStep] = useState<FlowStep>('intro');
  const [userName, setUserName] = useState<string>('');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [rawPhoto, setRawPhoto] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null); // Drive URL
  // AppV3.tsx - Changes to support early photo description fetch

  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [introReady, setIntroReady] = useState(false);
  const ambientStopRef = useRef<(() => void) | null>(null);

  // Avatar generation state
  const [avatarResult, setAvatarResult] = useState<AvatarResult | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const avatarPromiseRef = useRef<Promise<AvatarResult> | null>(null);
  const [cardCaptureCycle, setCardCaptureCycle] = useState(0);
  const [resultCardUrl, setResultCardUrl] = useState<string | null>(null);
  const [latestCardImageData, setLatestCardImageData] = useState<string | null>(null);
  const [isFinalizingCard, setIsFinalizingCard] = useState(false);
  const [finalizeMessage, setFinalizeMessage] = useState<string | null>(null);
  const [healthWarning, setHealthWarning] = useState<string | null>(null);

  // Pre-fetch state for AI Vision Model

  // Computed: what image to show on the result card
  const resultImage = avatarResult?.success
    ? (avatarResult.imageBase64 || avatarResult.imageUrl)
    : (rawPhoto || userPhoto);

  // Intro entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIntroReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/health')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Health check failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data && data.replicateConfigured === false) {
          setHealthWarning('Replicate API is not configured. Set REPLICATE_API_TOKEN in your local .env and in Vercel Environment Variables.');
        } else {
          setHealthWarning(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHealthWarning('Health check failed. API may be unreachable in this environment.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Manage ambient sound per theme
  useEffect(() => {
    if (step === 'quiz') {
      ambientStopRef.current = playAmbient('quiz-loop');
    } else if (step === 'result') {
      ambientStopRef.current = playAmbient('result-loop');
    } else if (step === 'intro' || step === 'identity' || step === 'camera' || step === 'universe') {
      ambientStopRef.current = playAmbient('intro-loop');
    } else {
      ambientStopRef.current = playAmbient('none');
    }
    return () => {
      if (ambientStopRef.current) {
        ambientStopRef.current();
        ambientStopRef.current = null;
      }
    };
  }, [step]);

  const flow = useMemo(
    () => [
      { id: 'intro', label: 'Intro' },
      { id: 'identity', label: 'Identify' },
      { id: 'camera', label: 'Photo' },
      { id: 'universe', label: 'Universe' },
      { id: 'quiz', label: 'Quiz' },
      { id: 'sorting', label: 'Reveal' },
      { id: 'result', label: 'Result' },
    ] as const,
    [],
  );

  const goToStep = (next: FlowStep) => {
    playClick();
    setStep(next);
  };

  const startCeremony = () => {
    playClick();
    goToStep('identity');
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      playClick();
      goToStep('camera');
    }
  };

  // ── Photo capture: store locally + upload to Drive + Fetch Description ──
  const handlePhotoCapture = (imageSrc: string) => {
    setUserPhoto(imageSrc);
    setRawPhoto(imageSrc);
    setResultCardUrl(null);
    setLatestCardImageData(null);
    setFinalizeMessage(null);

    // Upload to Drive in background
    uploadPhotoToDrive(userName, imageSrc).then((result) => {
      if (result.success && result.photoUrl) {
        setPhotoUrl(result.photoUrl);
        console.log('📸 Photo uploaded to Drive:', result.photoUrl);
      }
    });

    setTimeout(() => {
      goToStep('universe');
    }, 800);
  };

  const skipCamera = () => {
    playClick();
    setUserPhoto(null);
    setRawPhoto(null);
    setPhotoUrl(null);
    goToStep('universe');
  };

  const startAvatarGeneration = (
    result: FinalResult,
    activeTheme: HouseVariant,
    sourcePhoto: string,
  ) => {
    setIsGeneratingAvatar(true);
    setFinalizeMessage(null);

    const promiseWithDescription = (async () => {
      return generateAvatar(
        {
          house: result.house,
          universe: activeTheme,
          trait: result.trait,
          userName: userName,
        },
        sourcePhoto,
        null
      );
    })();

    avatarPromiseRef.current = promiseWithDescription;

    promiseWithDescription.then((avatarRes) => {
      if (avatarRes.success) {
        setResultCardUrl(null);
        setCardCaptureCycle((v) => v + 1);
      }

      if (avatarRes.success && avatarRes.imageBase64) {
        console.log("Initiating AI Avatar upload to Drive...");
        uploadPhotoToDrive(userName, avatarRes.imageBase64, 'avatar').catch(e => console.error("AI Avatar Drive upload failed", e));
      }
      setAvatarResult(avatarRes);
      setIsGeneratingAvatar(false);
      if (avatarRes.success) {
        console.log('🎨 Avatar generated successfully!');
      } else {
        console.warn('🎨 Avatar generation failed:', avatarRes.error);
        console.log('🎨 Prompt used:', avatarRes.prompt);
      }
    });
  };

  // ── Quiz complete: submit to Sheet + start avatar generation ──
  const handleQuizComplete = (result: FinalResult) => {
    setFinalResult(result);
    goToStep('sorting');

    // Submit quiz results to Google Sheet
    submitToGoogleSheet({
      userName: userName,
      theme: theme || '',
      house: result.house,
      trait: result.trait,
      description: result.description,
      answers: result.selectedAnswers,
      photoUrl: photoUrl,
      photoTaken: !!userPhoto,
    });

    // Start AI avatar generation in parallel with sorting ceremony
    const referencePhoto = rawPhoto || photoUrl;
    if (referencePhoto && theme) {
      startAvatarGeneration(result, theme, referencePhoto);
    }
  };

  // ── Sorting ceremony reveal: wait for avatar if still generating ──
  const handleSortingReveal = async () => {
    const referencePhoto = rawPhoto || photoUrl;
    if (!avatarResult && !isGeneratingAvatar && finalResult && theme && referencePhoto) {
      startAvatarGeneration(finalResult, theme, referencePhoto);
    }
    // If avatar is still generating, wait for it (up to 30s more)
    if (avatarPromiseRef.current) {
      console.log('⏳ Waiting for avatar generation to complete...');
      const timeout = new Promise<void>((resolve) => setTimeout(resolve, 30000));
      await Promise.race([avatarPromiseRef.current, timeout]);
    }
    // If generation failed or never produced success, retry once before revealing.
    if (finalResult && theme && referencePhoto && !avatarResult?.success && !isGeneratingAvatar) {
      startAvatarGeneration(finalResult, theme, referencePhoto);
      if (avatarPromiseRef.current) {
        const retryTimeout = new Promise<void>((resolve) => setTimeout(resolve, 30000));
        await Promise.race([avatarPromiseRef.current, retryTimeout]);
      }
    }
    setStep('result');
  };

  useEffect(() => {
    if (step !== 'result') return;
    const referencePhoto = rawPhoto || photoUrl;
    if (avatarResult || isGeneratingAvatar || !finalResult || !theme || !referencePhoto) return;
    startAvatarGeneration(finalResult, theme, referencePhoto);
  }, [step, avatarResult, isGeneratingAvatar, finalResult, theme, rawPhoto, photoUrl]);

  const handleUploadResultCard = async (imageData: string, version: 'v2') => {
    if (version !== 'v2') return;
    setLatestCardImageData(imageData);
    const uploadRes = await uploadPhotoToDrive(userName, imageData, 'result', 'v2');
    if (uploadRes.success && uploadRes.photoUrl) {
      setResultCardUrl(uploadRes.photoUrl);
      setFinalizeMessage('Card uploaded and ready to finalize.');
    } else if (!uploadRes.success) {
      setFinalizeMessage(uploadRes.error || 'Card upload failed. Please retry art once, then finalize again.');
      setResultCardUrl(null);
    }
    console.log('🖼️ Final Result Card (V2) uploaded to Drive');
  };

  const handleRetryArt = () => {
    const referencePhoto = rawPhoto || photoUrl;
    if (!finalResult || !theme || !referencePhoto || isGeneratingAvatar) return;
    startAvatarGeneration(finalResult, theme, referencePhoto);
  };

  const handleFinalizeCard = async () => {
    if (!theme || !finalResult) return;
    let selectedUrl = resultCardUrl;
    if (!selectedUrl && latestCardImageData) {
      const uploadRes = await uploadPhotoToDrive(userName, latestCardImageData, 'result', 'v2');
      if (uploadRes.success && uploadRes.photoUrl) {
        selectedUrl = uploadRes.photoUrl;
        setResultCardUrl(uploadRes.photoUrl);
      }
    }
    if (!selectedUrl) {
      setCardCaptureCycle((v) => v + 1);
      setFinalizeMessage('Card is preparing. Wait 2-3 seconds and tap FINALIZE CARD again.');
      return;
    }

    setIsFinalizingCard(true);
    setFinalizeMessage(null);
    const result = await submitFinalCardToSheet({
      userName,
      theme,
      house: finalResult.house,
      trait: finalResult.trait,
      cardVersion: 'v2',
      cardUrl: selectedUrl,
    });
    setIsFinalizingCard(false);
    setFinalizeMessage(result.success ? 'Finalized card for printing.' : (result.error || 'Failed to finalize card.'));
  };

  const handleRestart = () => {
    playClick();
    setTheme(null);
    setFinalResult(null);
    setAvatarResult(null);
    setIsGeneratingAvatar(false);
    setResultCardUrl(null);
    setLatestCardImageData(null);
    setFinalizeMessage(null);
    avatarPromiseRef.current = null;
    goToStep('universe');
  };

  const handleFullReset = () => {
    playClick();
    setStep('intro');
    setTheme(null);
    setUserName('');
    setUserPhoto(null);
    setRawPhoto(null);
    setPhotoUrl(null);
    setFinalResult(null);
    setAvatarResult(null);
    setIsGeneratingAvatar(false);
    setResultCardUrl(null);
    setLatestCardImageData(null);
    setFinalizeMessage(null);
    avatarPromiseRef.current = null;
  };

  const activeStepIndex = flow.findIndex((s) => s.id === step);

  return (
    <div className="fps3-root" data-theme={theme || 'hp'}>
      {/* Dynamic canvas background */}
      <DynamicBackground theme={theme} />

      <div className="cinematic-overlay"></div>

      <div className="fps3-app">
        {healthWarning && (
          <div className="env-warning" role="status">
            {healthWarning}
          </div>
        )}
        {step !== 'intro' && step !== 'sorting' && step !== 'result' && (
          <header className="fps3-header">
            {step === 'universe' || step === 'quiz' ? (
              <button
                className="fps3-back-btn"
                onMouseEnter={playHoverTick}
                onClick={handleFullReset}
              >
                ← Start Over
              </button>
            ) : (
              <div></div>
            )}

            <div className="fps3-pipeline" aria-label="Ceremony progress">
              {flow.map((item, idx) => (
                <span
                  key={item.id}
                  className={`fps3-pipe-item ${idx <= activeStepIndex ? 'active' : ''} ${idx === activeStepIndex ? 'current' : ''}`}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </header>
        )}

        <main className="fps3-main">
          <PageTransition transitionKey={step}>
            {step === 'intro' && (
              <div className={`fps3-landing fps3-intro ${introReady ? 'ready' : ''}`}>
                <header className="fps3-hero">
                  <div className="fps3-logo-glyph">✧</div>
                  <h1>SalarySe Triumph</h1>
                  <p className="fps3-subtitle">Get your Financial Trump Card</p>
                </header>
                <div className="fps3-actions">
                  <button className="start-btn fps3-glow-btn" onMouseEnter={playHoverTick} onClick={startCeremony}>
                    <span className="btn-shimmer"></span>
                    Begin Your Journey
                  </button>
                </div>
              </div>
            )}

            {step === 'identity' && (
              <div className="identity-form">
                <div className="identity-card-preview">
                  <div className="id-card-inner">
                    <svg viewBox="0 0 100 100" className="silhouette-svg">
                      <circle cx="50" cy="35" r="18" fill="currentColor" opacity="0.9" />
                      <path d="M20 85 C20 65 30 55 50 55 C70 55 80 65 80 85" fill="currentColor" opacity="0.9" />
                    </svg>
                    <div className="id-card-scanline"></div>
                  </div>
                  <div className="id-card-glow"></div>
                </div>
                <h2>What is your name?</h2>
                <p className="identity-sub">State your name for the record.</p>
                <form onSubmit={handleNameSubmit} className="identity-fields">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your Name"
                    required
                    autoFocus
                    className="fps3-input"
                  />
                  <button type="submit" className="start-btn fps3-glow-btn" onMouseEnter={playHoverTick}>
                    Continue
                  </button>
                </form>
              </div>
            )}

            {step === 'camera' && (
              <>
                <Camera onCapture={handlePhotoCapture} theme={'hp'} />
                <button className="fps3-skip-btn" onMouseEnter={playHoverTick} onClick={skipCamera}>
                  Skip photo and continue
                </button>
              </>
            )}

            {step === 'universe' && (
              <div className="fps3-landing fps3-universe-select">
                <header className="fps3-hero">
                  <h1>Choose Your Universe</h1>
                  <p className="fps3-subtitle">Welcome, <strong>{userName}</strong>. Where do you wish to test your wits?</p>
                </header>

                <div className="fps3-theme-grid">
                  {(Object.keys(themeConfig) as HouseVariant[]).map((key) => {
                    const cfg = themeConfig[key];
                    return (
                      <button
                        key={key}
                        className={`fps3-theme-btn ${cfg.className}`}
                        onMouseEnter={playHoverTick}
                        onClick={() => {
                          playClick();
                          setTheme(key);
                          goToStep('quiz');
                        }}
                      >
                        <span className="theme-btn-icon">{cfg.icon}</span>
                        <h2>{cfg.title}</h2>
                        <p>{cfg.subtitle}</p>
                        <span className="theme-btn-glow"></span>
                      </button>
                    );
                  })}

                  {/* Coming Soon Tile for symmetry */}
                  <div className="fps3-theme-btn locked">
                    <span className="theme-btn-icon">⏳</span>
                    <h2>More Universes</h2>
                    <p>Coming Soon...</p>
                    <div className="locked-overlay">
                      <span>LOCKED</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'quiz' && theme && <Quiz theme={theme} onComplete={handleQuizComplete} />}
          </PageTransition>

          {step === 'sorting' && theme && finalResult && (
            <SortingCeremony
              theme={theme}
              result={finalResult}
              onReveal={handleSortingReveal}
              isAvatarReady={!rawPhoto || !!avatarResult?.success}
            />
          )}

          {step === 'result' && theme && finalResult && (
            <Result
              theme={theme}
              result={finalResult}
              userPhoto={resultImage || null}
              userName={userName}
              onRestart={handleRestart}
              onCaptureReady={handleUploadResultCard}
              aiError={avatarResult?.error}
              aiPrompt={avatarResult?.prompt}
              aiModel={avatarResult?.modelName}
              aiSuccess={avatarResult?.success || false}
              isGeneratingAvatar={isGeneratingAvatar}
              onRetryArt={handleRetryArt}
              onFinalize={handleFinalizeCard}
              isFinalizing={isFinalizingCard}
              finalizeMessage={finalizeMessage}
              captureCycle={cardCaptureCycle}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default AppV3;
