const SOUND_ENABLED = true;

const soundMap = {
    click: '/audio/ui_click.mp3',
    hover: '/audio/ui_hover.mp3',
    transition: '/audio/transition_whoosh.mp3',
    shutter: '/audio/camera_shutter.mp3',
    quizLoop: '/audio/quiz_screen_music.mp3',
    textLoading: '/audio/text_loading_screen.mp3',
    houseReveal: '/audio/house_reveal.mp3',
    resultLoop: '/audio/result_page_music.mp3',
} as const;

type SoundName = keyof typeof soundMap;

const baseAudio: Partial<Record<SoundName, HTMLAudioElement>> = {};
let lastHoverAt = 0;
let lastTransitionAt = 0;
let activeAmbient: HTMLAudioElement | null = null;

function ensureBaseAudio(name: SoundName): HTMLAudioElement {
    if (!baseAudio[name]) {
        const audio = new Audio(soundMap[name]);
        audio.preload = 'auto';
        baseAudio[name] = audio;
    }
    return baseAudio[name]!;
}

function playSound(name: SoundName, volume: number) {
    if (!SOUND_ENABLED) return;
    try {
        const sample = ensureBaseAudio(name);
        const audio = sample.cloneNode(true) as HTMLAudioElement;
        audio.volume = volume;
        audio.currentTime = 0;
        void audio.play().catch(() => { });
    } catch {
        // Intentionally silent when audio playback fails (autoplay/device restrictions).
    }
}

export function playClick() {
    playSound('click', 0.45);
}

export function playHoverTick() {
    const now = Date.now();
    if (now - lastHoverAt < 80) return;
    lastHoverAt = now;
    playSound('hover', 0.22);
}

export function playTransitionWhoosh() {
    const now = Date.now();
    if (now - lastTransitionAt < 250) return;
    lastTransitionAt = now;
    playSound('transition', 0.4);
}

export function playCameraShutter() {
    playSound('shutter', 0.5);
}

export function playAmbient(_theme: string): () => void {
    if (!SOUND_ENABLED) return () => { };

    try {
        if (activeAmbient) {
            activeAmbient.pause();
            activeAmbient.currentTime = 0;
            activeAmbient = null;
        }

        if (_theme === 'intro-loop') {
            const audio = new Audio('/audio/intro_theme.mp3');
            audio.preload = 'auto';
            audio.loop = true;
            audio.volume = 0.32;
            void audio.play().catch(() => { });
            activeAmbient = audio;
        } else if (_theme === 'quiz-loop') {
            const audio = new Audio(soundMap.quizLoop);
            audio.preload = 'auto';
            audio.loop = true;
            audio.volume = 0.3;
            void audio.play().catch(() => { });
            activeAmbient = audio;
        } else if (_theme === 'result-loop') {
            const audio = new Audio(soundMap.resultLoop);
            audio.preload = 'auto';
            audio.loop = true;
            audio.volume = 0.3;
            void audio.play().catch(() => { });
            activeAmbient = audio;
        }
    } catch {
        // silent fail on autoplay-restricted platforms
    }

    return () => {
        if (activeAmbient) {
            activeAmbient.pause();
            activeAmbient.currentTime = 0;
            activeAmbient = null;
        }
    };
}

export function playReveal(_theme: string = 'default') {
    playSound('houseReveal', 0.6);
}

export function playKeystroke(_theme: string = 'default') {
    playSound('textLoading', 0.35);
}

export function playHoloHum(): () => void {
    return () => { };
}
