import { useEffect, useMemo, useRef, useState } from 'react';

if (import.meta.env.VITE_APP_CLOSED === 'true') {
    document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#0a0a0a;color:#fff;font-family:sans-serif;text-align:center;gap:16px;">
            <div style="font-size:48px;">🏆</div>
            <h1 style="font-size:28px;font-weight:700;margin:0;">The Event Has Concluded</h1>
            <p style="font-size:16px;color:#888;margin:0;">Thank you for being part of SalarySe Triumph.</p>
        </div>`;
    throw new Error('App closed');
}

import Camera from './components/Camera';
import Quiz, { type FinalResult, type HouseVariant } from './components/Quiz';
import SortingCeremony from './components/SortingCeremony';
import Result from './components/Result';
import DynamicBackground from './components/DynamicBackground';
import PageTransition from './components/PageTransition';
import { uploadPhotoToDrive, submitToGoogleSheet } from './utils/googleSheets';
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
  const [finalizeMessage, setFinalizeMessage] = useState<string | null>(null);
  const [healthWarning, setHealthWarning] = useState<string | null>(null);
  const [avatarDriveUrl, setAvatarDriveUrl] = useState<string | null>(null);

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
        uploadPhotoToDrive(userName, avatarRes.imageBase64, 'avatar')
          .then(r => { if (r.success && r.photoUrl) setAvatarDriveUrl(r.photoUrl); })
          .catch(e => console.error("AI Avatar Drive upload failed", e));
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
    console.log('📤 Uploading result card to Drive...');
    const uploadRes = await uploadPhotoToDrive(userName, imageData, 'result', 'v2');
    const isRealDriveUrl = (url: string | null) =>
      typeof url === 'string' && url.startsWith('https://drive.google.com/file/d/');

    if (uploadRes.success && isRealDriveUrl(uploadRes.photoUrl)) {
      console.log('✅ Result card Drive URL:', uploadRes.photoUrl);
      setResultCardUrl(uploadRes.photoUrl);
      setFinalizeMessage('Card uploaded and ready to finalize.');
    } else {
      const hint = uploadRes.photoUrl?.startsWith('Upload Error')
        ? 'Drive access denied — run runPermissionCheck() in your GAS script to authorize DriveApp.'
        : (uploadRes.error || 'Card upload failed.');
      console.warn('⚠️ Card Drive upload failed:', hint, '| raw response:', uploadRes);
      setResultCardUrl(null);
    }
  };

  const handleRetryArt = () => {
    const referencePhoto = rawPhoto || photoUrl;
    if (!finalResult || !theme || !referencePhoto || isGeneratingAvatar) return;
    startAvatarGeneration(finalResult, theme, referencePhoto);
  };

  const handleRestart = () => {
    playClick();
    setTheme(null);
    setFinalResult(null);
    setAvatarResult(null);
    setIsGeneratingAvatar(false);
    setResultCardUrl(null);
    setFinalizeMessage(null);
    setAvatarDriveUrl(null);
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
    setFinalizeMessage(null);
    setAvatarDriveUrl(null);
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
                  <div className="fps3-brand-logo">
                    <svg width="180" height="44" viewBox="0 0 118 29" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SalarySe">
                      <g clipPath="url(#clip0_94_1605)">
                        <path d="M-0.462891 4.74718L13.1452 -0.206C13.7103 -0.411694 14.3029 0.0206597 14.3029 0.638692V8.13279C14.3029 8.51257 14.0707 8.85108 13.7234 8.97748L-0.462891 14.1411V4.74718Z" fill="#292CAD"/>
                        <path d="M-0.462891 19.3168L14.3029 11.7563V19.7551C14.3029 19.9471 14.2436 20.1373 14.1138 20.2788C13.9053 20.5061 13.7554 20.5795 13.5233 20.6984L0.790683 27.5283C0.213399 27.8239 -0.462891 27.389 -0.462891 26.7221L-0.462891 19.3168Z" fill="url(#paint0_linear_94_1605)"/>
                        <path d="M3.34961 6.57977C3.34961 6.09858 3.71617 5.57508 4.16834 5.4105L11.7416 2.65407C12.1937 2.4895 12.5603 2.74616 12.5603 3.22735V4.09862L3.34961 7.45104V6.57977Z" fill="#E5E50B"/>
                        <path d="M3.34961 9.84686C3.34961 9.36567 3.71617 8.84217 4.16834 8.67759L11.7416 5.92116C12.1937 5.75658 12.5603 6.01325 12.5603 6.49444V7.36571L3.34961 10.7181V9.84686Z" fill="#E5E50B"/>
                        <path d="M-0.462891 15.6666L13.1452 20.6012C13.7103 20.8061 14.3029 20.3754 14.3029 19.7597V10.7723C14.3029 10.3939 14.0707 10.0567 13.7234 9.93076L-0.462891 4.78651V15.6666Z" fill="#3D41FA"/>
                        <path d="M-0.462891 5.9502L12.9333 10.6969C13.1942 10.7893 13.3686 11.0361 13.3686 11.3128V19.2556C13.3686 19.406 13.2197 19.5111 13.078 19.4609L-0.462891 14.6629" stroke="#EEFF41" strokeWidth="0.108909" strokeDasharray="0.22 0.22"/>
                        <path d="M33.3352 15.8814C33.3352 16.708 33.1444 17.4472 32.7629 18.099C32.3972 18.7507 31.8011 19.2594 30.9745 19.6251C30.1637 19.9907 29.0907 20.1735 27.7554 20.1735C26.8174 20.1735 25.9749 20.1179 25.2277 20.0066C24.4965 19.9112 23.7493 19.7205 22.9863 19.4343V15.786C23.8288 16.1675 24.6793 16.4457 25.5377 16.6206C26.3962 16.7795 27.0718 16.859 27.5646 16.859C28.0733 16.859 28.4469 16.8034 28.6853 16.6921C28.9238 16.5808 29.043 16.4139 29.043 16.1913C29.043 16.0006 28.9635 15.8337 28.8045 15.6906C28.6456 15.5475 28.3594 15.3885 27.9461 15.2137C27.5487 15.0388 26.9764 14.8004 26.2293 14.4983C25.498 14.1963 24.886 13.8704 24.3932 13.5207C23.9163 13.155 23.5586 12.7258 23.3201 12.233C23.0817 11.7243 22.9624 11.1123 22.9624 10.3969C22.9624 9.10927 23.4552 8.13956 24.4409 7.48779C25.4424 6.83602 26.7618 6.51013 28.3992 6.51013C29.2735 6.51013 30.0922 6.60551 30.8552 6.79628C31.6183 6.98704 32.4131 7.26523 33.2398 7.63086L31.9998 10.5638C31.5706 10.3572 31.1255 10.1823 30.6645 10.0392C30.2194 9.89617 29.7981 9.78489 29.4007 9.70541C29.0192 9.62592 28.6933 9.58618 28.423 9.58618C28.0733 9.58618 27.7951 9.63387 27.5884 9.72925C27.3977 9.82463 27.3023 9.95976 27.3023 10.1346C27.3023 10.2936 27.3659 10.4367 27.4931 10.5638C27.6361 10.691 27.8984 10.8341 28.28 10.9931C28.6615 11.152 29.2179 11.3825 29.9491 11.6846C30.7122 11.9866 31.3401 12.3204 31.8329 12.6861C32.3416 13.0358 32.7152 13.465 32.9536 13.9737C33.208 14.4665 33.3352 15.1024 33.3352 15.8814ZM41.3377 6.51013C43.0069 6.51013 44.3104 6.92345 45.2483 7.75009C46.1862 8.57673 46.6552 9.7531 46.6552 11.2792V19.9351H43.5076L42.6253 18.1943H42.53C42.1643 18.6554 41.7828 19.0369 41.3854 19.3389C41.0039 19.6251 40.5587 19.8317 40.05 19.9589C39.5413 20.102 38.9214 20.1735 38.1901 20.1735C37.4271 20.1735 36.7435 20.0225 36.1394 19.7205C35.5353 19.4025 35.0584 18.9336 34.7087 18.3136C34.359 17.6777 34.1841 16.8749 34.1841 15.9052C34.1841 14.4904 34.669 13.4412 35.6387 12.7576C36.6243 12.074 38.047 11.6925 39.907 11.613L42.1007 11.5415V11.3507C42.1007 10.7626 41.9577 10.3492 41.6715 10.1108C41.3854 9.85643 40.9959 9.72925 40.5031 9.72925C39.9785 9.72925 39.3983 9.82463 38.7624 10.0154C38.1265 10.1903 37.4827 10.4208 36.8309 10.7069L35.5194 7.7024C36.2825 7.30498 37.1409 7.01088 38.0947 6.82012C39.0644 6.61346 40.1454 6.51013 41.3377 6.51013ZM41.0754 14.093C40.2488 14.1247 39.6606 14.2758 39.3108 14.546C38.977 14.8004 38.8101 15.166 38.8101 15.6429C38.8101 16.088 38.9293 16.4218 39.1678 16.6444C39.4062 16.8511 39.7242 16.9544 40.1216 16.9544C40.678 16.9544 41.1469 16.7795 41.5285 16.4298C41.9259 16.0801 42.1246 15.627 42.1246 15.0706V14.0453L41.0754 14.093ZM53.3569 19.9351H48.8024V1.8126H53.3569V19.9351ZM61.7562 6.51013C63.4254 6.51013 64.7289 6.92345 65.6668 7.75009C66.6048 8.57673 67.0737 9.7531 67.0737 11.2792V19.9351H63.9261L63.0438 18.1943H62.9485C62.5828 18.6554 62.2013 19.0369 61.8039 19.3389C61.4224 19.6251 60.9773 19.8317 60.4686 19.9589C59.9599 20.102 59.3399 20.1735 58.6086 20.1735C57.8456 20.1735 57.162 20.0225 56.5579 19.7205C55.9538 19.4025 55.4769 18.9336 55.1272 18.3136C54.7775 17.6777 54.6026 16.8749 54.6026 15.9052C54.6026 14.4904 55.0875 13.4412 56.0572 12.7576C57.0428 12.074 58.4655 11.6925 60.3255 11.613L62.5193 11.5415V11.3507C62.5193 10.7626 62.3762 10.3492 62.09 10.1108C61.8039 9.85643 61.4144 9.72925 60.9216 9.72925C60.397 9.72925 59.8168 9.82463 59.1809 10.0154C58.545 10.1903 57.9012 10.4208 57.2494 10.7069L55.9379 7.7024C56.701 7.30498 57.5594 7.01088 58.5132 6.82012C59.4829 6.61346 60.5639 6.51013 61.7562 6.51013ZM61.4939 14.093C60.6673 14.1247 60.0791 14.2758 59.7293 14.546C59.3955 14.8004 59.2286 15.166 59.2286 15.6429C59.2286 16.088 59.3478 16.4218 59.5863 16.6444C59.8247 16.8511 60.1427 16.9544 60.5401 16.9544C61.0965 16.9544 61.5654 16.7795 61.947 16.4298C62.3444 16.0801 62.5431 15.627 62.5431 15.0706V14.0453L61.4939 14.093ZM76.9468 6.51013C77.2012 6.51013 77.4634 6.52603 77.7337 6.55782C78.0039 6.58962 78.2027 6.62141 78.3298 6.6532L77.9245 10.9454C77.7655 10.9136 77.5668 10.8818 77.3283 10.85C77.1058 10.8182 76.7878 10.8023 76.3745 10.8023C76.0884 10.8023 75.7784 10.8341 75.4445 10.8977C75.1266 10.9454 74.8166 11.0566 74.5146 11.2315C74.2284 11.4064 73.99 11.6687 73.7992 12.0184C73.6243 12.3681 73.5369 12.845 73.5369 13.4491V19.9351H68.9825V6.74859H72.3685L73.0839 8.84698H73.2985C73.5369 8.41776 73.8469 8.02829 74.2284 7.67855C74.61 7.31293 75.0312 7.02678 75.4922 6.82012C75.9691 6.61346 76.454 6.51013 76.9468 6.51013ZM79.0392 6.74859H83.8321L86.0736 14.3076C86.1054 14.4188 86.1372 14.554 86.169 14.7129C86.2008 14.8719 86.2246 15.0388 86.2405 15.2137C86.2723 15.3885 86.2882 15.5634 86.2882 15.7383H86.3836C86.4154 15.4203 86.4551 15.1501 86.5028 14.9275C86.5664 14.6891 86.622 14.4904 86.6697 14.3314L88.9589 6.74859H93.6087L88.3866 20.7696C87.9892 21.8347 87.5202 22.7329 86.9797 23.4642C86.4551 24.1954 85.8034 24.7439 85.0244 25.1095C84.2455 25.4751 83.2757 25.6579 82.1153 25.6579C81.702 25.6579 81.3443 25.6341 81.0422 25.5864C80.7402 25.5546 80.4779 25.5149 80.2553 25.4672V21.8904C80.4302 21.9222 80.6369 21.954 80.8753 21.9858C81.1297 22.0176 81.392 22.0334 81.6622 22.0334C82.1709 22.0334 82.5763 21.9301 82.8783 21.7235C83.1963 21.5168 83.4586 21.2466 83.6652 20.9127C83.8719 20.5948 84.0467 20.245 84.1898 19.8635L84.2375 19.7443L79.0392 6.74859Z" fill="white"/>
                        <path d="M103.839 21.8428C103.839 22.6694 103.648 23.4086 103.267 24.0604C102.901 24.7122 102.305 25.2209 101.478 25.5865C100.668 25.9521 99.5946 26.1349 98.2593 26.1349C97.3213 26.1349 96.4788 26.0793 95.7317 25.968C95.0004 25.8726 94.2532 25.6819 93.4902 25.3957V21.7474C94.3327 22.1289 95.1832 22.4071 96.0416 22.582C96.9001 22.741 97.5757 22.8204 98.0685 22.8204C98.5772 22.8204 98.9508 22.7648 99.1892 22.6535C99.4277 22.5422 99.5469 22.3753 99.5469 22.1528C99.5469 21.962 99.4674 21.7951 99.3085 21.652C99.1495 21.5089 98.8633 21.35 98.45 21.1751C98.0526 21.0002 97.4803 20.7618 96.7332 20.4597C96.0019 20.1577 95.3899 19.8318 94.8971 19.4821C94.4202 19.1165 94.0625 18.6872 93.824 18.1944C93.5856 17.6857 93.4663 17.0737 93.4663 16.3583C93.4663 15.0707 93.9592 14.101 94.9448 13.4492C95.9463 12.7974 97.2657 12.4716 98.9031 12.4716C99.7774 12.4716 100.596 12.5669 101.359 12.7577C102.122 12.9485 102.917 13.2267 103.744 13.5923L102.504 16.5253C102.075 16.3186 101.629 16.1437 101.168 16.0007C100.723 15.8576 100.302 15.7463 99.9046 15.6668C99.5231 15.5873 99.1972 15.5476 98.9269 15.5476C98.5772 15.5476 98.299 15.5953 98.0923 15.6907C97.9016 15.7861 97.8062 15.9212 97.8062 16.096C97.8062 16.255 97.8698 16.3981 97.997 16.5253C98.14 16.6524 98.4023 16.7955 98.7839 16.9545C99.1654 17.1135 99.7218 17.344 100.453 17.646C101.216 17.948 101.844 18.2819 102.337 18.6475C102.846 18.9972 103.219 19.4264 103.458 19.9351C103.712 20.428 103.839 21.0638 103.839 21.8428ZM110.864 12.4716C112.152 12.4716 113.256 12.6941 114.178 13.1392C115.116 13.5843 115.832 14.252 116.325 15.1422C116.833 16.0325 117.088 17.1532 117.088 18.5044V20.5313H108.956C108.988 21.2148 109.242 21.7792 109.719 22.2243C110.212 22.6694 110.92 22.892 111.842 22.892C112.668 22.892 113.423 22.8125 114.107 22.6535C114.79 22.4945 115.498 22.2402 116.229 21.8905V25.1573C115.593 25.4911 114.894 25.7375 114.131 25.8965C113.384 26.0555 112.438 26.1349 111.293 26.1349C109.958 26.1349 108.766 25.9044 107.716 25.4434C106.683 24.9665 105.864 24.2273 105.26 23.2258C104.656 22.2243 104.354 20.9446 104.354 19.3867C104.354 17.797 104.624 16.4935 105.165 15.4761C105.721 14.4587 106.484 13.7036 107.454 13.2108C108.44 12.718 109.576 12.4716 110.864 12.4716ZM111.031 15.5715C110.49 15.5715 110.037 15.7384 109.672 16.0722C109.322 16.406 109.115 16.9386 109.052 17.6698H112.962C112.962 17.2724 112.883 16.9227 112.724 16.6206C112.581 16.3027 112.366 16.0484 112.08 15.8576C111.794 15.6668 111.444 15.5715 111.031 15.5715Z" fill="#DBDB00"/>
                      </g>
                      <defs>
                        <linearGradient id="paint0_linear_94_1605" x1="-1.45742" y1="23.5786" x2="16.5086" y2="19.6872" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#3D41FA"/>
                          <stop offset="0.51" stopColor="#292CAD"/>
                        </linearGradient>
                        <clipPath id="clip0_94_1605">
                          <rect width="117.048" height="28.3025" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <h1>Triumph</h1>
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
              onFullReset={handleFullReset}
              onCaptureReady={handleUploadResultCard}
              aiError={avatarResult?.error}
              aiPrompt={avatarResult?.prompt}
              aiModel={avatarResult?.modelName}
              aiSuccess={avatarResult?.success || false}
              isGeneratingAvatar={isGeneratingAvatar}
              onRetryArt={handleRetryArt}
              finalizeMessage={finalizeMessage}
              captureCycle={cardCaptureCycle}
              cardDriveUrl={resultCardUrl}
              avatarDriveUrl={avatarDriveUrl}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default AppV3;
