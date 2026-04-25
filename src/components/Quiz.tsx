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
        text: 'You receive your first paycheck as a newly graduated wizard. What\'s your first move?',
        answers: [
            { text: 'Splurge on immediate upgrades for my broomstick and wardrobe! (Easy come, easy go)', trait: 'risk_taker', points: 3 },
            { text: 'Start a detailed ledger of my living expenses in Diagon Alley.', trait: 'analytical', points: 3 },
            { text: 'Use it to buy rare potion ingredients in bulk to sell for a profit later.', trait: 'wealth_builder', points: 3 },
            { text: 'Hide most of it securely in my Gringotts vault for a rainy day.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'hp_2',
        text: 'A mysterious wizard offers you an investment in a "guaranteed" magical artifact. How do you respond?',
        answers: [
            { text: 'I trust my gut and invest everything for the chance at a massive return.', trait: 'risk_taker', points: 3 },
            { text: 'I demand to see the artifact\'s historical magical appraisal and return projections.', trait: 'analytical', points: 3 },
            { text: 'I negotiate to only invest if I get exclusive distribution rights.', trait: 'wealth_builder', points: 3 },
            { text: 'I politely decline. I only put my Galleons into Gringotts-approved funds.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'hp_3',
        text: 'Your friend wants to borrow money to start a joke shop. What do you do?',
        answers: [
            { text: 'Ask to see their business plan and target market analysis first.', trait: 'analytical', points: 3 },
            { text: 'Give them the money! It sounds like a fun adventure.', trait: 'risk_taker', points: 3 },
            { text: 'Give them the money, but only after making them sign a contract giving me 25% of the profits.', trait: 'wealth_builder', points: 3 },
            { text: 'Tell them I\'d rather help them build a budget than risk my own savings.', trait: 'cautious_saver', points: 3 },
        ]
    },
];

// ── Game of Thrones ───────────────────────────────────────────────────────────

const gotQuestions: Question[] = [
    {
        id: 'got_1',
        text: 'You inherit a small piece of land in Westeros. What\'s your strategy?',
        answers: [
            { text: 'Build modest defenses and stockpile food for the winter.', trait: 'cautious_saver', points: 3 },
            { text: 'Survey the land for natural resources and calculate crop yields for the next decade.', trait: 'analytical', points: 3 },
            { text: 'Immediately pledge it to a larger house in exchange for a massive loan to throw a huge tournament.', trait: 'risk_taker', points: 3 },
            { text: 'Start taxing the local peasants heavily to build my own personal army.', trait: 'wealth_builder', points: 3 },
        ]
    },
    {
        id: 'got_2',
        text: 'Winter is finally here. How did you prepare financially?',
        answers: [
            { text: 'I established lucrative trade routes with Essos years ago to keep my wealth growing.', trait: 'wealth_builder', points: 3 },
            { text: 'I saved every copper I could and avoided all unnecessary spending for years.', trait: 'cautious_saver', points: 3 },
            { text: 'I calculated the exact amount of grain needed per person and bought it during the summer dip.', trait: 'analytical', points: 3 },
            { text: 'I didn\'t. I\'ll just conquer a neighboring castle if I need resources.', trait: 'risk_taker', points: 3 },
        ]
    },
    {
        id: 'got_3',
        text: 'A powerful merchant offers you a loan with very high interest to fund a war. Do you take it?',
        answers: [
            { text: 'Yes, if winning the war means I can seize their bank later and cancel the debt.', trait: 'wealth_builder', points: 3 },
            { text: 'Yes! I need the gold now to win the glory, I\'ll figure out how to pay it back later.', trait: 'risk_taker', points: 3 },
            { text: 'Only if my strategists determine the war effort has an 80%+ chance of success.', trait: 'analytical', points: 3 },
            { text: 'I prefer to avoid debt entirely, relying only on what my own lands produce.', trait: 'cautious_saver', points: 3 },
        ]
    },
];

// ── Marvel ────────────────────────────────────────────────────────────────────

const marvelQuestions: Question[] = [
    {
        id: 'marvel_1',
        text: 'Stark Industries offers you a massive signing bonus. What do you do with it?',
        answers: [
            { text: 'Start a high-tech venture capital firm to fund the next big startup.', trait: 'wealth_builder', points: 3 },
            { text: 'Invest it entirely in a promising but volatile energy sector stock.', trait: 'risk_taker', points: 3 },
            { text: 'Analyze global market trends and diversify across 12 different sectors.', trait: 'analytical', points: 3 },
            { text: 'Put it in a high-yield savings account and stick to my original financial plan.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'marvel_2',
        text: 'You discover a new element that could revolutionize clean energy. How do you monetize it?',
        answers: [
            { text: 'Patent it immediately and license it exclusively to the highest bidders.', trait: 'wealth_builder', points: 3 },
            { text: 'Launch a massive IPO and hype it up before the tech is fully proven.', trait: 'risk_taker', points: 3 },
            { text: 'Run extensive cost-benefit analyses on production and supply chain logistics before moving.', trait: 'analytical', points: 3 },
            { text: 'Keep it a secret until I\'ve secured enough capital to manufacture it safely myself.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'marvel_3',
        text: 'The Avengers need funding to rebuild their headquarters. How do you raise the capital?',
        answers: [
            { text: 'Leverage the Avengers brand into a global merchandising empire.', trait: 'wealth_builder', points: 3 },
            { text: 'Bet big on a single high-yield, high-risk government defense contract.', trait: 'risk_taker', points: 3 },
            { text: 'Create a detailed business plan outlining projected costs and ROI for major investors.', trait: 'analytical', points: 3 },
            { text: 'Cut unnecessary superhero expenses and slowly save up the funds from existing operations.', trait: 'cautious_saver', points: 3 },
        ]
    },
];

// ── Star Wars ─────────────────────────────────────────────────────────────────

const swQuestions: Question[] = [
    {
        id: 'sw_1',
        text: 'You\'ve acquired a beat-up old freighter. What\'s your business plan?',
        answers: [
            { text: 'Run highly dangerous, highly lucrative smuggling routes past Imperial blockades.', trait: 'risk_taker', points: 3 },
            { text: 'Use it to corner the local shipping market by undercutting larger competitors.', trait: 'wealth_builder', points: 3 },
            { text: 'Calculate the maximum fuel efficiency routes for steady, reliable cargo hauling.', trait: 'analytical', points: 3 },
            { text: 'Keep it docked until I\'ve saved up enough credits for a full insurance policy and repairs.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'sw_2',
        text: 'The galactic economy is crashing. How do you protect your credits?',
        answers: [
            { text: 'Convert all my credits to physical beskar—it holds value no matter who\'s in power.', trait: 'cautious_saver', points: 3 },
            { text: 'Diversify across multiple star systems to minimize regional economic risk.', trait: 'analytical', points: 3 },
            { text: 'Buy up distressed planetary assets at rock-bottom prices and build an empire.', trait: 'wealth_builder', points: 3 },
            { text: 'Short-sell the core worlds\' markets and profit massively from the chaos.', trait: 'risk_taker', points: 3 },
        ]
    },
    {
        id: 'sw_3',
        text: 'You are negotiating a major deal with a Hutt crime lord. What is your strategy?',
        answers: [
            { text: 'I bluff completely, demanding double their offer and threatening to walk away.', trait: 'risk_taker', points: 3 },
            { text: 'I play them against a rival syndicate to negotiate the absolute best price for myself.', trait: 'wealth_builder', points: 3 },
            { text: 'I bring my own protocol droid to audit their ledgers and ensure due diligence.', trait: 'analytical', points: 3 },
            { text: 'I take a safe, smaller deal and leave quickly. It\'s not worth angering a Hutt.', trait: 'cautious_saver', points: 3 },
        ]
    },
];

// ── Money Heist ───────────────────────────────────────────────────────────────

const mhQuestions: Question[] = [
    {
        id: 'mh_1',
        text: 'You\'ve successfully pulled off a massive heist. What\'s your first financial move?',
        answers: [
            { text: 'Hide the money securely in multiple locations and live modestly to avoid detection.', trait: 'cautious_saver', points: 3 },
            { text: 'Create a complex network of offshore accounts and shell companies to launder it perfectly.', trait: 'analytical', points: 3 },
            { text: 'Invest it all into legitimate businesses to build an untouchable financial empire.', trait: 'wealth_builder', points: 3 },
            { text: 'Blow a massive chunk on an extravagant party—what\'s the point of money if you don\'t live?', trait: 'risk_taker', points: 3 },
        ]
    },
    {
        id: 'mh_2',
        text: 'The police are closing in, offering a deal: take 10% of the vault safely, or risk it all for 100%. Choose.',
        answers: [
            { text: 'Risk it all! 100% or nothing—that\'s why we started this.', trait: 'risk_taker', points: 3 },
            { text: 'Negotiate for 50% immunity AND a cut of the seized funds.', trait: 'wealth_builder', points: 3 },
            { text: 'Calculate the precise statistical probability of escape before deciding.', trait: 'analytical', points: 3 },
            { text: 'Take the guaranteed 10%. A safe fortune beats spending life in prison.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'mh_3',
        text: 'How do you prefer your team to handle the group\'s communal expenses?',
        answers: [
            { text: 'Strict rationing and a dedicated emergency fund for unexpected crises.', trait: 'cautious_saver', points: 3 },
            { text: 'Detailed spreadsheets tracking every single euro spent and projected.', trait: 'analytical', points: 3 },
            { text: 'Invest the communal fund in high-yield short-term assets to grow our operational budget.', trait: 'wealth_builder', points: 3 },
            { text: 'Keep it loose. If we need more money for gear, we\'ll figure out a way to get it quickly.', trait: 'risk_taker', points: 3 },
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
