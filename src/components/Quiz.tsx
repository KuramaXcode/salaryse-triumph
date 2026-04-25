import React, { useState } from 'react';
import './Quiz.css';
import type { HouseVariant } from '../types';
import { playClick, playHoverTick } from '../hooks/useSound';
export type { HouseVariant } from '../types';

export type FinancialTrait = 'risk_taker' | 'analytical' | 'wealth_builder' | 'cautious_saver';

export interface Answer {
    text: string;
    trait: FinancialTrait;
    points: number;
}

export interface Question {
    id: string;
    text: string;
    answers: Answer[];
}

// ── Harry Potter ──────────────────────────────────────────────────────────────

const hpQuestions: Question[] = [
    {
        id: 'hp_1',
        text: 'The Sorting Hat whispers it sees two paths ahead. One guarantees a comfortable, stable life. The other holds extraordinary power — but a real chance of losing everything. Which calls to you?',
        answers: [
            { text: 'The risky path. If I fall, at least I fell reaching for something extraordinary.', trait: 'risk_taker', points: 3 },
            { text: 'I need the exact odds and expected outcomes of each path before I decide anything.', trait: 'analytical', points: 3 },
            { text: 'The risky path — but I\'ll spend tonight studying every possible advantage I can gain first.', trait: 'wealth_builder', points: 3 },
            { text: 'The safe path. Consistent comfort compounds into something extraordinary over a lifetime.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'hp_2',
        text: 'You\'ve just discovered a forgotten Gringotts vault stuffed with 10,000 Galleons. The goblins confirm it\'s legally yours. What\'s your very first move?',
        answers: [
            { text: 'Invest the entire vault in a volatile new magical enterprise. Fortune favours the bold.', trait: 'risk_taker', points: 3 },
            { text: 'Map every investment category in the wizarding economy before touching a single Galleon.', trait: 'analytical', points: 3 },
            { text: 'Use it as leverage to acquire a controlling stake in Weasleys\' Wizard Wheezes.', trait: 'wealth_builder', points: 3 },
            { text: 'Move it to the most secure Gringotts vault tier and protect it first. Everything else can wait.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'hp_3',
        text: 'A shady wizard offers you a "guaranteed" 10x return on your Galleons in 30 days. Everyone around you is rushing to sign. Your gut says...?',
        answers: [
            { text: 'I\'m in. The potential 10x is worth the risk of losing it all.', trait: 'risk_taker', points: 3 },
            { text: 'I demand a full audit of their books and a verified sample transaction before committing anything.', trait: 'analytical', points: 3 },
            { text: 'I invest a small amount first — if it pays out, I negotiate for a bigger cut with exclusive terms.', trait: 'wealth_builder', points: 3 },
            { text: 'Hard pass. In the wizarding world, if it sounds too good to be true, it\'s always a trap.', trait: 'cautious_saver', points: 3 },
        ]
    },
];

// ── Game of Thrones ───────────────────────────────────────────────────────────

const gotQuestions: Question[] = [
    {
        id: 'got_1',
        text: 'The Iron Throne is empty. Every Great House is rallying. You have one season to prepare before the war begins. What do you do with the crown\'s treasury?',
        answers: [
            { text: 'March immediately. Strike before anyone else can consolidate power.', trait: 'risk_taker', points: 3 },
            { text: 'Survey every house\'s bannermen, outstanding debts, and secret alliances. Information is the real weapon.', trait: 'analytical', points: 3 },
            { text: 'Forge a loan deal with the Iron Bank of Braavos. Whoever controls Westeros\'s debt controls Westeros.', trait: 'wealth_builder', points: 3 },
            { text: 'Fortify my own castle and stockpile grain. Let the others bleed each other out before I move.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'got_2',
        text: 'Chaos erupts in King\'s Landing. Your advisors give you three minutes: burn assets and flee, hold everything, or buy while others panic. You...',
        answers: [
            { text: 'Buy everything in sight. Chaos is just opportunity wearing a bad reputation.', trait: 'risk_taker', points: 3 },
            { text: 'Buy only the three assets my models predict will recover fastest once order is restored.', trait: 'analytical', points: 3 },
            { text: 'Acquire distressed properties and trade routes at rock-bottom prices to build an empire from the ashes.', trait: 'wealth_builder', points: 3 },
            { text: 'Hold everything and wait. Patience has kept my family\'s gold intact through four kings.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'got_3',
        text: 'A raven arrives: the Iron Bank is calling in debts from all your rivals simultaneously, and privately offers YOU a massive loan at 2% interest. What do you do?',
        answers: [
            { text: 'Take everything they\'ll give me and bet it all on a lightning military campaign right now.', trait: 'risk_taker', points: 3 },
            { text: 'Calculate the exact ROI needed to justify every possible use of the loan before signing.', trait: 'analytical', points: 3 },
            { text: 'Take it, but only to buy strategic assets — ports, mines, grain stores that outlast any war.', trait: 'wealth_builder', points: 3 },
            { text: 'Decline entirely. I will not owe the Iron Bank anything. My house survives debt-free or not at all.', trait: 'cautious_saver', points: 3 },
        ]
    },
];

// ── Marvel ────────────────────────────────────────────────────────────────────

const marvelQuestions: Question[] = [
    {
        id: 'marvel_1',
        text: 'Tony Stark calls personally. He\'s offering you a seat on the Avengers\' financial board — but the salary is entirely in volatile Stark Industries stock options, not cash. "I\'m betting on myself," he says. Do you take it?',
        answers: [
            { text: 'Absolutely. If Tony Stark is betting on himself, I\'m betting alongside him.', trait: 'risk_taker', points: 3 },
            { text: 'Send me the last 10 years of Stark Industries financials and the full options vesting schedule first.', trait: 'analytical', points: 3 },
            { text: 'Yes — but I\'m negotiating for double the options and a board seat with actual voting rights.', trait: 'wealth_builder', points: 3 },
            { text: 'No. I need a stable cash salary. I can\'t pay rent with options in a company attacked by aliens.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'marvel_2',
        text: 'A Quantum Realm anomaly lets you see three possible futures. In two of them, early investors in vibranium-backed tokens become billionaires. In one, it collapses to zero. You have ₹5,00,000 to deploy right now. What do you do?',
        answers: [
            { text: 'All ₹5,00,000 in. Two good outcomes outweigh one bad one.', trait: 'risk_taker', points: 3 },
            { text: 'Split it: one third invest, one third hedge, one third wait for more data.', trait: 'analytical', points: 3 },
            { text: 'Invest ₹4,00,000 but also buy equity in the company issuing the tokens. Control the supply chain.', trait: 'wealth_builder', points: 3 },
            { text: 'Keep all ₹5,00,000. I don\'t invest in anything I can\'t fully understand and verify.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'marvel_3',
        text: 'Nick Fury walks in. The Avengers need emergency funding and ask you to personally guarantee a ₹500 crore loan. In return, you get 0.1% of all future Avengers IP and global merchandise forever. Do you sign?',
        answers: [
            { text: 'Sign immediately. 0.1% of the Avengers brand compounds into more than ₹500 crore within a decade.', trait: 'risk_taker', points: 3 },
            { text: 'I need a full actuarial assessment of the Avengers\' survival probability before I guarantee anything.', trait: 'analytical', points: 3 },
            { text: 'Counter: 1% of IP plus veto rights on all licensing deals. Then we have a conversation.', trait: 'wealth_builder', points: 3 },
            { text: 'Absolutely not. I will not personally guarantee ₹500 crore for anyone, regardless of the upside.', trait: 'cautious_saver', points: 3 },
        ]
    },
];

// ── Star Wars ─────────────────────────────────────────────────────────────────

const swQuestions: Question[] = [
    {
        id: 'sw_1',
        text: 'You\'ve stumbled upon a crashed Republic cruiser loaded with 500,000 credits and decommissioned weapons in the Outer Rim. No one knows it\'s there. What do you do?',
        answers: [
            { text: 'Strip it fast, sell everything through the Hutt black market, and vanish before anyone notices.', trait: 'risk_taker', points: 3 },
            { text: 'Catalogue every item, research real-time market rates across five systems, then sell strategically.', trait: 'analytical', points: 3 },
            { text: 'Use the weapons cache as negotiating leverage to secure a long-term Mandalorian trade partnership.', trait: 'wealth_builder', points: 3 },
            { text: 'Take only what I immediately need. The Empire\'s enemies have very long memories.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'sw_2',
        text: 'The galactic credit is collapsing. Hutts are hoarding spice, bankers are fleeing Coruscant, and smugglers are converting to Beskar. You have 48 hours before the markets freeze solid. Your move?',
        answers: [
            { text: 'Short-sell the galactic credit aggressively. The bigger the crash, the bigger my gain.', trait: 'risk_taker', points: 3 },
            { text: 'Run probability models to identify which three asset classes will emerge as the new reserve currency.', trait: 'analytical', points: 3 },
            { text: 'Buy every distressed cargo route available. When currency collapses, trade routes become the new gold.', trait: 'wealth_builder', points: 3 },
            { text: 'Convert everything to physical Beskar immediately. It holds value under any government, any empire.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'sw_3',
        text: 'A Jedi Master senses your financial instincts in the Force. She says: "Your greatest strength is also your greatest danger." Which truth lands hardest?',
        answers: [
            { text: 'My boldness creates opportunity — but one unchecked gamble could destroy everything I\'ve built.', trait: 'risk_taker', points: 3 },
            { text: 'My analysis protects me — but sometimes I calculate so long the opportunity simply disappears.', trait: 'analytical', points: 3 },
            { text: 'My ambition builds empires — but I risk losing the people around me in the relentless pursuit of more.', trait: 'wealth_builder', points: 3 },
            { text: 'My discipline keeps me safe — but playing it too safe means I never reach my true potential.', trait: 'cautious_saver', points: 3 },
        ]
    },
];

// ── Money Heist ───────────────────────────────────────────────────────────────

const mhQuestions: Question[] = [
    {
        id: 'mh_1',
        text: 'The Professor lays out the plan. The heist nets ₹8,000 crore. Your cut is ₹400 crore — but there\'s a 25% chance it all collapses and you walk away with nothing. The alternative: leave right now with ₹16 crore guaranteed. What do you do?',
        answers: [
            { text: 'Stay. ₹400 crore or nothing. That\'s why I joined in the first place.', trait: 'risk_taker', points: 3 },
            { text: 'Run the expected value: 75% × ₹400 Cr = ₹300 Cr vs ₹16 Cr guaranteed. The math says stay. I\'m in.', trait: 'analytical', points: 3 },
            { text: 'Stay — but I\'m negotiating my cut up to ₹600 crore before the heist clock starts.', trait: 'wealth_builder', points: 3 },
            { text: 'Take the ₹16 crore and walk. A guaranteed fortune is worth more than a spectacular gamble.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'mh_2',
        text: 'You\'re inside the mint. Police have surrounded the building. Inspector Sierra offers a deal: surrender now, keep 20% of what\'s already printed, full immunity. The Professor\'s voice crackles: "Don\'t you dare." You...',
        answers: [
            { text: 'Ignore the offer entirely. We finish what we started, all or nothing. Bella Ciao.', trait: 'risk_taker', points: 3 },
            { text: 'Quietly calculate the statistical probability of the Professor\'s escape plan succeeding from here.', trait: 'analytical', points: 3 },
            { text: 'Counter Sierra directly: 40% and full witness protection, or I\'m not moving an inch.', trait: 'wealth_builder', points: 3 },
            { text: '20% and immunity is more than most people earn in ten lifetimes. That\'s a life. I take it.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'mh_3',
        text: 'The heist is over. You\'ve escaped to a safe house on the Portuguese coast with your full share. How do you build a real life with this money?',
        answers: [
            { text: 'Fund a series of high-risk startups across three continents. I didn\'t survive this to live small.', trait: 'risk_taker', points: 3 },
            { text: 'Build a sophisticated offshore portfolio with professional advisors. Make it invisible and permanent.', trait: 'analytical', points: 3 },
            { text: 'Acquire several legitimate businesses to launder and grow the money into a proper, untouchable empire.', trait: 'wealth_builder', points: 3 },
            { text: 'Live modestly, never touch the principal, and survive comfortably on the interest for the rest of my life.', trait: 'cautious_saver', points: 3 },
        ]
    },
];

// ── Score Resolution ──────────────────────────────────────────────────────────

export interface FinalResult {
    house: string;
    trait: FinancialTrait;
    description: string;
    selectedAnswers: string[];
    scores: Record<FinancialTrait, number>;
}

type ScoreResult = Omit<FinalResult, 'selectedAnswers' | 'scores'>;

const resolveScore = (scores: Record<FinancialTrait, number>, theme: HouseVariant): ScoreResult => {
    let dominantTrait: FinancialTrait = 'cautious_saver';
    let maxScore = -1;
    const traits: FinancialTrait[] = ['risk_taker', 'analytical', 'wealth_builder', 'cautious_saver'];

    traits.forEach(t => {
        if (scores[t] > maxScore) {
            maxScore = scores[t];
            dominantTrait = t;
        }
    });

    const houseMap: Record<HouseVariant, Record<FinancialTrait, ScoreResult>> = {
        hp: {
            risk_taker:    { house: 'Gryffindor',     trait: 'risk_taker',    description: 'Bold and fearless! You charge markets the way Gryffindors charge Dark wizards — with courage before the full picture is clear.' },
            analytical:    { house: 'Ravenclaw',       trait: 'analytical',    description: 'Strategic and precise! You read a balance sheet the way Ravenclaws read restricted texts — with depth, care, and genuine curiosity.' },
            wealth_builder:{ house: 'Slytherin',       trait: 'wealth_builder',description: 'Cunning and ambitious! You see leverage where others see risk, and opportunity where others see obstacles.' },
            cautious_saver:{ house: 'Hufflepuff',      trait: 'cautious_saver',description: 'Steady and unshakeable! Your financial foundation is solid. While others rebuild after every crash, you simply continue growing.' },
        },
        got: {
            risk_taker:    { house: 'House Targaryen', trait: 'risk_taker',    description: 'Fire and blood! You invest with dragon-blooded conviction — all-in, trusting your vision will reshape the entire landscape.' },
            analytical:    { house: 'House Baratheon', trait: 'analytical',    description: 'Strategic fury! You combine gut instinct with data — a rare combination that most investors spend careers trying to develop.' },
            wealth_builder:{ house: 'House Lannister', trait: 'wealth_builder',description: 'A Lannister always pays their debts — and always structures the deal so those debts earn a return. Leverage is your native language.' },
            cautious_saver:{ house: 'House Stark',     trait: 'cautious_saver',description: 'Winter is coming — and you\'re the only one prepared. When the financial winter hits, you\'re the one with reserves to survive and acquire.' },
        },
        marvel: {
            risk_taker:    { house: 'Team Thor',       trait: 'risk_taker',    description: 'Lightning-strike investor! You make decisions with Mjolnir-level conviction. When you commit, you commit fully — and it shows in your returns.' },
            analytical:    { house: 'Team Strange',    trait: 'analytical',    description: 'Multiversal seer! You\'ve run 14 million scenarios before making a move. Your downside protection is exceptional because you\'ve already lived the bad outcomes.' },
            wealth_builder:{ house: 'Team Iron Man',   trait: 'wealth_builder',description: 'Genius-level wealth engineer! You don\'t just invest in the future — you build it. Your portfolio reads like a blueprint for the next decade.' },
            cautious_saver:{ house: 'Team Cap',        trait: 'cautious_saver',description: 'I can do this all day — and so can your portfolio. Your discipline in down markets is where most investors\' wealth quietly transfers to yours.' },
        },
        sw: {
            risk_taker:    { house: 'The Sith Order',      trait: 'risk_taker',    description: 'Passion and power! Your drive for financial victory generates returns that balanced investors only read about in case studies.' },
            analytical:    { house: 'The Jedi Council',    trait: 'analytical',    description: 'Patience, young investor. Your willingness to wait for the right entry means you almost never overpay for an asset.' },
            wealth_builder:{ house: 'The Mandalorians',    trait: 'wealth_builder',description: 'This is the way. You are a bounty hunter of opportunity — when a deal is worth pursuing, you pursue it relentlessly and close on your terms.' },
            cautious_saver:{ house: 'The Rebel Alliance',  trait: 'cautious_saver',description: 'Rebellions — and financial independence — are built on hope backed by preparation. Your reserves are your firepower.' },
        },
        mh: {
            risk_taker:    { house: 'Team Tokyo',    trait: 'risk_taker',    description: 'All in, no regrets! You have nothing to lose — and that fearlessness is your most bankable asset. You enter positions others are too scared to touch.' },
            analytical:    { house: 'Team Professor',trait: 'analytical',    description: 'The plan. Always the plan. Your financial blueprints account for variables that others don\'t even know to consider.' },
            wealth_builder:{ house: 'Team Berlin',   trait: 'wealth_builder',description: 'Elegant empire builder! You treat wealth accumulation as a masterpiece. Every deal is negotiated with the precision of someone who knows their worth.' },
            cautious_saver:{ house: 'Team Nairobi',  trait: 'cautious_saver',description: 'Let the matriarchy begin! You run the numbers, protect the assets, and ensure not a single rupee is wasted in operation.' },
        },
    };

    return houseMap[theme][dominantTrait];
};

// ── Component ─────────────────────────────────────────────────────────────────

interface QuizProps {
    theme: HouseVariant;
    onComplete: (result: FinalResult) => void;
}

const Quiz: React.FC<QuizProps> = ({ theme, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [scores, setScores] = useState<Record<FinancialTrait, number>>({
        risk_taker: 0,
        analytical: 0,
        wealth_builder: 0,
        cautious_saver: 0
    });
    const [timeLeft, setTimeLeft] = useState(30);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [currentQuestionIndex]);

    const questionMap: Record<HouseVariant, Question[]> = {
        hp: hpQuestions,
        got: gotQuestions,
        marvel: marvelQuestions,
        sw: swQuestions,
        mh: mhQuestions,
    };
    const questions = questionMap[theme];
    const question = questions[currentQuestionIndex];

    const handleAnswerClick = (trait: FinancialTrait, points: number, answerText: string) => {
        const newScores = { ...scores, [trait]: scores[trait] + points };
        const newAnswers = [...selectedAnswers, answerText];
        setScores(newScores);
        setSelectedAnswers(newAnswers);
        setTimeLeft(30);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            const result = resolveScore(newScores, theme);
            onComplete({ ...result, selectedAnswers: newAnswers, scores: newScores });
        }
    };

    return (
        <div className={`quiz-wrapper ${theme} ${timeLeft === 0 ? 'should-shake' : ''}`}>
            <div className="quiz-timer-container">
                <div className="timer-label-row">
                    <span className="timer-label">TIME REMAINING</span>
                    <span className="timer-text">{timeLeft}s</span>
                </div>
                <div className="timer-bar-wrapper">
                    <div
                        className="timer-bar-fill"
                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="question-card">
                <h3 className="question-number">Question {currentQuestionIndex + 1} of {questions.length}</h3>
                <h2 className="question-text">{question.text}</h2>

                <div className="answers-grid">
                    {question.answers.map((ans, idx) => (
                        <button
                            key={idx}
                            className="answer-btn"
                            onMouseEnter={playHoverTick}
                            onClick={() => { playClick(); handleAnswerClick(ans.trait, ans.points, ans.text); }}
                        >
                            {ans.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
