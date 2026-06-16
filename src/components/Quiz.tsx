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
        text: "Shakuni's scheme has collapsed Indraprastha's trade routes overnight. The merchants who supplied your region are gone and prices are in freefall. You still hold capital. What do you do?",
        answers: [
            { text: "Buy aggressively. An empire's collapse is a trader's opportunity — I acquire distressed assets before anyone else recovers.", trait: 'risk_taker', points: 3 },
            { text: "I study the full damage before touching a single rupee. Shakuni's weapon was rushing — I won't repeat that mistake.", trait: 'analytical', points: 3 },
            { text: "I was diversified across enough kingdoms that this route's collapse barely touches me. Now I quietly buy what the panicked are selling.", trait: 'wealth_builder', points: 3 },
            { text: "I liquidate my exposure to the affected region immediately and protect the principal. Preservation comes before opportunity.", trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'mbh_2',
        text: "A Chakravyuha has formed in the markets — prices have spiraled down 40% across all sectors in seven days. You have fresh capital ready to deploy. How do you move?",
        answers: [
            { text: "I charge into the deepest ring. Volatility forges wealth. I buy heaviest when the spiral is tightest.", trait: 'risk_taker', points: 3 },
            { text: "Abhimanyu fell for entering without knowing every exit. I map every sector's recovery path before I commit a single rupee.", trait: 'analytical', points: 3 },
            { text: "My income streams sit outside this formation. I let the spiral exhaust itself and compound quietly while others fight through it.", trait: 'wealth_builder', points: 3 },
            { text: "I do not enter a formation I cannot exit. Holding dry powder outside the Chakravyuha is its own victory.", trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'mbh_3',
        text: "The Pandava treasury must be allocated before Kurukshetra: recruit powerful new allies with gold, or hold reserves for a long campaign? How do you divide the war chest?",
        answers: [
            { text: "Spend it all recruiting the most powerful warriors available. Like Karna, I back full conviction over half-measures — the battle is won before it starts.", trait: 'risk_taker', points: 3 },
            { text: "Survey every allied kingdom's strength and cost before allocating a single coin. Krishna won by knowing the full field — I do the same.", trait: 'analytical', points: 3 },
            { text: "Split the gold across multiple alliances so no single desertion breaks us. True strength is distributed, not concentrated in one great warrior.", trait: 'wealth_builder', points: 3 },
            { text: "Hold most of it in reserve. The army we already have is our foundation — Yudhishthira's lesson is that overextending the treasury loses wars.", trait: 'cautious_saver', points: 3 },
        ]
    },
];

// ── Dragon Ball Z ─────────────────────────────────────────────────────────────

const dbzQuestions: Question[] = [
    {
        id: 'dbz_1',
        text: "Capsule Corporation's new energy reactor just went public and the stock is surging. You have a sizeable chunk of Zeni saved up. What's your move?",
        answers: [
            { text: "All in, maximum position. It's Capsule Corp — this thing only goes beyond from here.", trait: 'risk_taker', points: 3 },
            { text: "I take a stake now and funnel the gains into building long-term assets. One IPO win becomes the foundation for something bigger.", trait: 'wealth_builder', points: 3 },
            { text: "I scan every financial report and tech spec before committing. Power level means nothing without knowing if the fundamentals back it up.", trait: 'analytical', points: 3 },
            { text: "I wait for the hype to settle. A steady reserve beats burning out chasing the first surge — I'll invest when the dust clears.", trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'dbz_2',
        text: "Bulma discovers a reactor that cuts energy costs by 80%. She offers you a private stake in Capsule Corp before the public announcement. What do you do?",
        answers: [
            { text: "I take the maximum stake she'll allow. The upside is enormous and I trust my read on the opportunity.", trait: 'risk_taker', points: 3 },
            { text: "I negotiate hard for a meaningful stake plus future licensing rights. One deal should open three more doors.", trait: 'wealth_builder', points: 3 },
            { text: "I ask for the full technical specs and financial projections first. I need to know the power level of this investment before I commit.", trait: 'analytical', points: 3 },
            { text: "I wait for the public launch and verified results before putting Zeni in. Inside information doesn't guarantee the tech actually works.", trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'dbz_3',
        text: "Frieza's empire is buying up every trade route in your sector. In 30 days your primary income stream gets cut off. How do you respond?",
        answers: [
            { text: "I move aggressively to lock in alternative routes before Frieza completes the monopoly. Attack the problem head-on while there's still time.", trait: 'risk_taker', points: 3 },
            { text: "I build three new income streams outside Frieza's reach before the deadline hits. No single enemy should ever be able to cut off my empire.", trait: 'wealth_builder', points: 3 },
            { text: "I map every route Frieza hasn't acquired yet and move on the gaps strategically. Knowing their power level tells me exactly where the opening is.", trait: 'analytical', points: 3 },
            { text: "I cut expenses immediately and build a cash reserve large enough to survive the income gap. Protect the base — then counter.", trait: 'cautious_saver', points: 3 },
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
