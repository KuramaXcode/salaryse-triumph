import { useState } from 'react'
import './App.css'
import Camera from './components/Camera'
import Quiz, { type FinalResult, type HouseVariant } from './components/Quiz'
import SortingCeremony from './components/SortingCeremony'
import Result from './components/Result'
import { submitToGoogleSheet } from './utils/googleSheets'

const themeConfig: Record<HouseVariant, { title: string; subtitle: string; welcome: string; className: string }> = {
  hp: { title: 'Harry Potter', subtitle: 'Enter the halls of magic and find your house.', welcome: 'Hogwarts', className: 'hp-btn' },
  got: { title: 'Game of Thrones', subtitle: 'Winter is coming. Where do your loyalties lie?', welcome: 'Westeros', className: 'got-btn' },
  marvel: { title: 'The Marvel Universe', subtitle: 'Assemble your team. Discover your heroic identity.', welcome: 'The Avengers Initiative', className: 'marvel-btn' },
  sw: { title: 'Star Wars Galaxy', subtitle: 'The Force awakens. Choose your path.', welcome: 'The Galaxy', className: 'sw-btn' },
  mh: { title: 'Money Heist', subtitle: 'Bella Ciao. The Professor needs you.', welcome: 'La Casa de Papel', className: 'mh-btn' },
};

function App() {
  const [theme, setTheme] = useState<HouseVariant | null>(null);
  const [step, setStep] = useState<'intro' | 'camera' | 'quiz' | 'sorting' | 'result'>('intro');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);

  const startCeremony = () => {
    setStep('camera');
  };

  const handlePhotoCapture = (imageSrc: string) => {
    setUserPhoto(imageSrc);
    setTimeout(() => {
      setStep('quiz');
    }, 1000);
  };

  const handleQuizComplete = (result: FinalResult) => {
    setFinalResult(result);
    setStep('sorting');

    submitToGoogleSheet({
      userName: userName || 'Dossier Subject',
      theme: theme || '',
      house: result.house,
      trait: result.trait,
      description: result.description,
      answers: result.selectedAnswers,
      photoUrl: null, // This would be populated if we had the Drive upload result
      photoTaken: !!userPhoto,
    });
  };

  const handleSortingReveal = () => {
    setStep('result');
  };

  const handleRestart = () => {
    setStep('intro');
    setUserPhoto(null);
    setFinalResult(null);
  };

  return (
    <div className={`app-container ${theme ? '' : 'theme-selection'}`} data-theme={theme || 'hp'}>
      <div className="cinematic-overlay"></div>

      {!theme ? (
        <div className="landing-page">
          <header>
            <h1>Financial Persona Sorting</h1>
            <p>Discover your true economic nature</p>
          </header>

          <main className="theme-selectors">
            {(Object.keys(themeConfig) as HouseVariant[]).map((key) => {
              const cfg = themeConfig[key];
              return (
                <button
                  key={key}
                  className={`theme-btn ${cfg.className}`}
                  onClick={() => { setTheme(key); setStep('intro'); }}
                >
                  <h2>{cfg.title}</h2>
                  <p>{cfg.subtitle}</p>
                </button>
              );
            })}
          </main>
        </div>
      ) : (
        <div className="active-app">
          {step !== 'sorting' && (
            <header className="app-header">
              <button className="back-btn" onClick={() => { setTheme(null); handleRestart(); }}>
                ← Choose Universe
              </button>
            </header>
          )}

          <main className="quiz-container">
            {step === 'intro' && (
              <>
                <h1>Welcome to {themeConfig[theme].welcome}</h1>
                <p>Your sorting ceremony is about to begin...</p>
                <div className="name-input-section">
                  <input
                    type="text"
                    placeholder="ENTER YOUR NAME"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value.toUpperCase())}
                    className="dossier-name-input"
                  />
                </div>
                <button
                  className="start-btn"
                  onClick={startCeremony}
                  disabled={!userName.trim()}
                >
                  Step Forward
                </button>
              </>
            )}

            {step === 'camera' && (
              <Camera onCapture={handlePhotoCapture} theme={theme} />
            )}

            {step === 'quiz' && (
              <Quiz theme={theme} onComplete={handleQuizComplete} />
            )}

            {step === 'sorting' && finalResult && (
              <SortingCeremony theme={theme} result={finalResult} onReveal={handleSortingReveal} />
            )}

            {step === 'result' && finalResult && (
              <Result
                theme={theme}
                result={finalResult}
                userPhoto={userPhoto}
                userName={userName || 'DOSSIER SUBJECT'}
                onRestart={handleRestart}
              />
            )}
          </main>
        </div>
      )}
    </div>
  )
}

export default App
