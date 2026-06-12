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

// ── Mahabharata ───────────────────────────────────────────────────────────────

const mbhQuestions: Question[] = [
    {
        id: 'mbh_1',
        text: "Shakuni's ivory dice glint under the torchlight of Hastinapur's sabha. The Pandavas have staked — and lost — Indraprastha in a single sitting. A high-stakes opportunity lands in your lap. What is your instinct?",
        answers: [
            { text: "I play. An empire lost in one sitting can be built back greater. Bold conviction is its own dharma.", trait: 'risk_taker', points: 3 },
            { text: "Shakuni's true weapon wasn't the dice — it was inside information. I study the full odds before I ever sit at the table.", trait: 'analytical', points: 3 },
            { text: "I never stake Indraprastha on a single throw. My wealth spans enough kingdoms that no one loss can take it all.", trait: 'wealth_builder', points: 3 },
            { text: "Yudhishthira's error was that he kept playing. I know when to walk away — protecting the principal is dharma.", trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'mbh_2',
        text: "The Chakravyuha has closed around you — a seven-ringed market spiral designed to trap the underprepared. Abhimanyu knew how to enter but not how to exit. How do you move?",
        answers: [
            { text: "I charge to the innermost ring. Volatility forges warriors. I buy deepest when the formation is tightest.", trait: 'risk_taker', points: 3 },
            { text: "Abhimanyu fell for incomplete knowledge. I map every ring — every exit — before I commit a single rupee.", trait: 'analytical', points: 3 },
            { text: "I build income streams from outside the formation and let the trapped fight their way through while I compound.", trait: 'wealth_builder', points: 3 },
            { text: "I do not enter a formation I cannot exit. Holding reserves outside the Chakravyuha is its own form of victory.", trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'mbh_3',
        text: "On the eve of Kurukshetra, three advisors each offer you one truth to carry into your financial life. Whose counsel shapes you?",
        answers: [
            { text: "Karna's: 'Even knowing the outcome, I stand and fight with everything I have.' Full conviction over safe calculation.", trait: 'risk_taker', points: 3 },
            { text: "Krishna's: 'See the full field, know every warrior, understand the war before the first arrow flies.' Knowledge wins.", trait: 'analytical', points: 3 },
            { text: "Vidura's: 'True wealth flows from dharmic action sustained across decades — not seized in a single battle.' Compounding is the path.", trait: 'wealth_builder', points: 3 },
            { text: "Yudhishthira's: 'The kingdom we already hold is worth more than the empire we might gain.' Guard the foundation above all.", trait: 'cautious_saver', points: 3 },
        ]
    },
];

// ── Dragon Ball Z ─────────────────────────────────────────────────────────────

const dbzQuestions: Question[] = [
    {
        id: 'dbz_1',
        text: 'Your power level just hit 9,000 — and the market just opened. What\'s your move?',
        answers: [
            { text: 'All in. Maximum power means maximum position size. I\'m going beyond!', trait: 'risk_taker', points: 3 },
            { text: 'Channel the energy into building long-term infrastructure, not short-term glory.', trait: 'wealth_builder', points: 3 },
            { text: 'Scan every sector\'s battle data before committing a single Zeni to the fight.', trait: 'analytical', points: 3 },
            { text: 'Conserve my ki. A steady reserve beats burning out before the real battle begins.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'dbz_2',
        text: 'You find all seven Dragon Balls. Instead of immortality, you wish for financial wisdom. What do you ask for?',
        answers: [
            { text: 'The courage to go all-in on the highest-stakes opportunities without hesitation.', trait: 'risk_taker', points: 3 },
            { text: 'The blueprint to build a company as dominant and enduring as Capsule Corporation.', trait: 'wealth_builder', points: 3 },
            { text: 'Perfect knowledge of every market — every power level, every weakness, every cycle.', trait: 'analytical', points: 3 },
            { text: 'Complete financial security for myself and everyone I care about, guaranteed forever.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'dbz_3',
        text: 'A rival threatens to destroy your financial base. How do you respond?',
        answers: [
            { text: 'Meet it head-on. I don\'t dodge — I power up and dominate the threat completely.', trait: 'risk_taker', points: 3 },
            { text: 'Diversify my income streams so no single attack can ever bring down the empire.', trait: 'wealth_builder', points: 3 },
            { text: 'Study their tactics completely first. I need to know their power level before I act.', trait: 'analytical', points: 3 },
            { text: 'Hold strict defensive positioning. Protect the base. Never overextend in battle.', trait: 'cautious_saver', points: 3 },
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
        mbh: {
            risk_taker:    { house: "Karna's Path",          trait: 'risk_taker',    description: "Karna's fearlessness is yours. You back your convictions completely and go all-in where others hesitate. That courage is your greatest financial weapon." },
            analytical:    { house: "Krishna's Council",     trait: 'analytical',    description: "You see the full Kurukshetra before the first arrow flies. Strategy, timing, and cosmic patience — your financial decisions are already three moves ahead." },
            wealth_builder:{ house: "Arjuna's Aim",          trait: 'wealth_builder',description: "Focus is your weapon. You build wealth with the precision of Arjuna's Gandiva — no half measures, no distracted exits, only disciplined execution." },
            cautious_saver:{ house: "Yudhishthira's Dharma", trait: 'cautious_saver',description: "Dharma before desire. You protect your financial kingdom with unwavering principle, building reserves that outlast every market storm." },
        },
        dbz: {
            risk_taker:    { house: 'Team Goku',          trait: 'risk_taker',    description: 'It\'s over 9,000! You are strongest when the odds are against you. Volatility powers you up — your best entries happen when everyone else is running.' },
            analytical:    { house: 'Frieza Force',        trait: 'analytical',    description: 'Cold, calculated, and precise. You survey every sector before committing a single Zeni — and you never enter a market without already knowing your exit.' },
            wealth_builder:{ house: 'Capsule Corp',        trait: 'wealth_builder',description: 'Genius empire architect! You think like Bulma and execute like Vegeta — brilliant systems combined with relentless ambition to build something that outlasts any market cycle.' },
            cautious_saver:{ house: 'Namekian Guardians',  trait: 'cautious_saver',description: 'Like Piccolo mastering his potential through silent training, your wealth builds through unbreakable discipline. Your consistency is your superpower.' },
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
        mbh: mbhQuestions,
        dbz: dbzQuestions,
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
                            key={`${currentQuestionIndex}-${idx}`}
                            className="answer-btn"
                            onMouseEnter={playHoverTick}
                            onClick={(e) => { e.currentTarget.blur(); playClick(); handleAnswerClick(ans.trait, ans.points, ans.text); }}
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
