import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './SortingCeremony.css';
import { type FinalResult, type HouseVariant } from './Quiz';
import { playReveal, playKeystroke } from '../hooks/useSound';

interface SortingCeremonyProps {
    theme: HouseVariant;
    result: FinalResult;
    onReveal: () => void | Promise<void>;
    isAvatarReady?: boolean;
}

const messageMap: Record<HouseVariant, string[]> = {
    hp: [
        "The Sorting Hat stirs...",
        "Hmm, interesting... very interesting...",
        "I see courage... but also cunning...",
        "Where to put you...",
        "Ah, I see it clearly now...",
        "Better be..."
    ],
    got: [
        "The ravens gather...",
        "The Iron Throne demands your allegiance...",
        "Blood and fire... or ice and honour?",
        "The old gods and the new watch...",
        "Your fate is written in the stars...",
        "You belong to..."
    ],
    marvel: [
        "J.A.R.V.I.S. is scanning your profile...",
        "Cross-referencing with the Avengers database...",
        "Power levels... surprisingly interesting...",
        "The multiverse reveals your path...",
        "Nick Fury has made his decision...",
        "Welcome to..."
    ],
    sw: [
        "The Force stirs around you...",
        "A disturbance... I sense great potential...",
        "The light side... or the dark?",
        "The kyber crystals resonate...",
        "Your destiny is clear...",
        "You are aligned with..."
    ],
    mbh: [
        "Vyasa lifts his quill...",
        "Ganesha listens, ready to transcribe your fate...",
        "The eighteen days of Kurukshetra flash before you...",
        "Krishna whispers the Gita into your soul...",
        "The Dharmachakra has measured your path...",
        "You are destined for..."
    ],
    dbz: [
        "The Dragon Balls are gathering...",
        "Scouter is scanning your power level...",
        "IT'S OVER 9,000!!",
        "The Dragon speaks your destiny...",
        "Your ki has been measured...",
        "You fight alongside..."
    ],
};

const SortingCeremony: React.FC<SortingCeremonyProps> = ({ theme, result, onReveal, isAvatarReady = true }) => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [showHouse, setShowHouse] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [intensity, setIntensity] = useState(0);
    const messages = messageMap[theme];

    const particleSeeds = useMemo(() =>
        Array.from({ length: 70 }, () => ({
            left: Math.random() * 100,
            duration: 2 + Math.random() * 4,
            delay: Math.random() * 2,
            baseSize: 2 + Math.random() * 4,
        })),
    []);

    // Typing effect
    useEffect(() => {
        if (showHouse) return;

        const fullText = messages[messageIndex];
        setTypedText('');
        setIsTyping(true);

        let charIdx = 0;
        const typeInterval = setInterval(() => {
            if (charIdx < fullText.length) {
                setTypedText(fullText.slice(0, charIdx + 1));
                charIdx++;
                // Play keystroke every few characters
                if (charIdx % 3 === 0) {
                    playKeystroke(theme);
                }
            } else {
                clearInterval(typeInterval);
                setIsTyping(false);
            }
        }, 40 + Math.random() * 20);

        return () => clearInterval(typeInterval);
    }, [messageIndex, showHouse, messages]);

    // Advance messages
    useEffect(() => {
        if (isTyping || showHouse) return;

        const isLoopingPhase = messageIndex < 3; // Messages 1-4 (indices 0-3)
        const isWaitingPhase = messageIndex === 3; // On message 4

        if (isLoopingPhase) {
            // Normal progression for first 3 messages
            const timer = setTimeout(() => {
                setMessageIndex(prev => prev + 1);
                setIntensity(prev => Math.min(0.8, prev + 0.15));
            }, 1200);
            return () => clearTimeout(timer);
        } else if (isWaitingPhase) {
            // Loop or proceed based on AI status
            if (!isAvatarReady) {
                // Loop back to start after a delay to keep the user engaged
                const timer = setTimeout(() => {
                    setMessageIndex(0);
                    // Reset intensity slightly to feel like a loop
                    setIntensity(prev => Math.max(0.2, prev - 0.4));
                }, 1500);
                return () => clearTimeout(timer);
            } else {
                // AI is ready — proceed to final messages (5 and 6)
                const timer = setTimeout(() => {
                    setMessageIndex(4);
                    setIntensity(0.9);
                    playKeystroke();
                }, 800);
                return () => clearTimeout(timer);
            }
        } else if (messageIndex < messages.length - 1) {
            // Progression through messages 5 and 6
            const timer = setTimeout(() => {
                setMessageIndex(prev => prev + 1);
                setIntensity(prev => Math.min(1, prev + 0.1));
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            // Final reveal
            const timer = setTimeout(() => {
                setIntensity(1);
                setShowHouse(true);
                playReveal(theme);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isTyping, messageIndex, messages.length, showHouse, isAvatarReady]);

    // Auto-proceed to result after reveal
    const handleReveal = useCallback(() => {
        onReveal();
    }, [onReveal]);

    useEffect(() => {
        if (showHouse) {
            const timer = setTimeout(handleReveal, 3500);
            return () => clearTimeout(timer);
        }
    }, [showHouse, handleReveal]);

    return (
        <div className={`ceremony-container ${theme}`} style={{ '--intensity': intensity } as React.CSSProperties}>
            <div className="particles">
                {particleSeeds.slice(0, 40 + Math.round(intensity * 30)).map((p, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${p.left}%`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`,
                            width: `${p.baseSize + intensity * 4}px`,
                            height: `${p.baseSize + intensity * 4}px`,
                        }}
                    />
                ))}
            </div>

            {/* Intensity aura */}
            <div
                className="ceremony-aura"
                style={{ opacity: intensity * 0.5 }}
            />

            {showHouse && <div className="reveal-flash" />}

            <div className="ceremony-content">
                {!showHouse ? (
                    <div className="message-container" key={messageIndex}>
                        <p className="ceremony-message">
                            {typedText}
                            {isTyping && <span className="typing-cursor">|</span>}
                        </p>
                        <div className="pulse-ring"></div>
                    </div>
                ) : (
                    <div className="house-reveal">
                        <h1 className="house-name">{result.house}!</h1>
                        <p className="reveal-trait">{result.trait.replace(/_/g, ' ').toUpperCase()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SortingCeremony;
