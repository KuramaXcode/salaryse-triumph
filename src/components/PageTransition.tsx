import { useState, useEffect, type ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
    /** Change this key to trigger a transition */
    transitionKey: string;
    /** Duration in ms */
    duration?: number;
}

function PageTransition({ children, transitionKey, duration = 400 }: PageTransitionProps) {
    const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('visible');
    const [displayedKey, setDisplayedKey] = useState(transitionKey);
    const [displayedChildren, setDisplayedChildren] = useState(children);

    useEffect(() => {
        if (transitionKey !== displayedKey) {
            // Start exit
            setPhase('exit');

            const exitTimer = setTimeout(() => {
                setDisplayedKey(transitionKey);
                setDisplayedChildren(children);
                setPhase('enter');

                const enterTimer = setTimeout(() => {
                    setPhase('visible');
                }, duration);

                return () => clearTimeout(enterTimer);
            }, duration);

            return () => clearTimeout(exitTimer);
        } else {
            // Key matches, update children directly
            setDisplayedChildren(children);
        }
    }, [transitionKey, children, displayedKey, duration]);

    const style: React.CSSProperties = {
        transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
        opacity: phase === 'visible' ? 1 : 0,
        transform: phase === 'exit'
            ? 'translateY(-12px) scale(0.98)'
            : phase === 'enter'
                ? 'translateY(12px) scale(0.98)'
                : 'translateY(0) scale(1)',
        willChange: 'opacity, transform',
    };

    return <div style={style}>{displayedChildren}</div>;
}

export default PageTransition;
