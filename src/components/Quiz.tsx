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
    {
        id: 'hp_4',
        text: 'You discover a spell that can double your money, but it has a 30% chance of vanishing it entirely. Do you cast it?',
        answers: [
            { text: 'Absolutely! A 70% chance to double is a risk worth taking.', trait: 'risk_taker', points: 3 },
            { text: 'I force someone else to cast it on a small amount of my money first to test the risk.', trait: 'wealth_builder', points: 3 },
            { text: 'Never. I work too hard for my Galleons to risk them vanishing.', trait: 'cautious_saver', points: 3 },
            { text: 'I would calculate if the expected value outpaces my current interest rates before deciding.', trait: 'analytical', points: 3 },
        ]
    },
    {
        id: 'hp_5',
        text: 'What is your ultimate financial goal in the magical world?',
        answers: [
            { text: 'Having enough wealth to live comfortably without ever worrying about surprise expenses.', trait: 'cautious_saver', points: 3 },
            { text: 'Achieving perfect financial efficiency so my money works for me invisibly.', trait: 'analytical', points: 3 },
            { text: 'Using my wealth to gain influence, power, and the finest magical items.', trait: 'wealth_builder', points: 3 },
            { text: 'Having the freedom to fund wild expeditions and dangerous magical experiments.', trait: 'risk_taker', points: 3 },
        ]
    }
];

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
    {
        id: 'got_4',
        text: 'You\'ve acquired a rare, valuable Valyrian steel sword. What\'s your financial play?',
        answers: [
            { text: 'Have it appraised and use it as collateral to secure massive loans at favorable rates.', trait: 'analytical', points: 3 },
            { text: 'Sell it to the highest bidder to fund my campaign for the Iron Throne.', trait: 'wealth_builder', points: 3 },
            { text: 'Lock it deep in my family\'s vault as the ultimate emergency fund asset.', trait: 'cautious_saver', points: 3 },
            { text: 'Wield it in battle to strike fear into my enemies and claim their lands.', trait: 'risk_taker', points: 3 },
        ]
    },
    {
        id: 'got_5',
        text: 'What makes a great leader of a Great House?',
        answers: [
            { text: 'Having the largest gold reserves to buy loyalty whenever needed.', trait: 'wealth_builder', points: 3 },
            { text: 'The audacity to make high-stakes gambles that reshape the entire map.', trait: 'risk_taker', points: 3 },
            { text: 'The ability to outsmart opponents through superior economic data networks.', trait: 'analytical', points: 3 },
            { text: 'Never putting the family\'s core assets at risk, ensuring survival across generations.', trait: 'cautious_saver', points: 3 },
        ]
    }
];

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
    {
        id: 'marvel_4',
        text: 'A portal to another dimension opens, offering alien technology for trade. Your move?',
        answers: [
            { text: 'Dive in head-first and start trading! First-mover advantage is everything.', trait: 'risk_taker', points: 3 },
            { text: 'Send an economic assessment team to evaluate currency exchange rates and demand.', trait: 'analytical', points: 3 },
            { text: 'Draft exclusive trade agreements and monopolize the inter-dimensional market.', trait: 'wealth_builder', points: 3 },
            { text: 'Wait and watch. Let others test the volatile market while I protect my earthly assets.', trait: 'cautious_saver', points: 3 },
        ]
    },
    {
        id: 'marvel_5',
        text: 'If you could pick one superpower for managing your investments, what would it be?',
        answers: [
            { text: 'Super intelligence to perfectly model every market variable and beat the algorithms.', trait: 'analytical', points: 3 },
            { text: 'Time travel, so I can know exactly what high-risk stock will explode next.', trait: 'risk_taker', points: 3 },
            { text: 'Mind control, ensuring everyone agrees to my terms in every massive negotiation.', trait: 'wealth_builder', points: 3 },
            { text: 'Invulnerability, knowing no economic crash or financial crisis can ever hurt me.', trait: 'cautious_saver', points: 3 },
        ]
    }
];

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
    {
        id: 'sw_4',
        text: 'What do you consider your most valuable asset in the galaxy?',
        answers: [
            { text: 'My expanding network of profitable trade routes and mining colonies.', trait: 'wealth_builder', points: 3 },
            { text: 'My deep understanding of galactic interest rates and market fluctuations.', trait: 'analytical', points: 3 },
            { text: 'My untouchable emergency fund hidden safely on a remote ice planet.', trait: 'cautious_saver', points: 3 },
            { text: 'My willingness to make the boldest, most unpredictable moves when others hesitate.', trait: 'risk_taker', points: 3 },
        ]
    },
    {
        id: 'sw_5',
        text: 'A rebellion threatens intergalactic trade. Where do you align financially?',
        answers: [
            { text: 'I supply both sides with resources, ensuring I profit regardless of who wins.', trait: 'wealth_builder', points: 3 },
            { text: 'I analyze the probability of the rebellion\'s success before committing any capital.', trait: 'analytical', points: 3 },
            { text: 'I bet everything on the underdog rebellion—the potential return on investment is astronomical.', trait: 'risk_taker', points: 3 },
            { text: 'I withdraw my investments from conflict zones entirely and wait for stability to return.', trait: 'cautious_saver', points: 3 },
        ]
    }
];

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
    {
        id: 'mh_4',
        text: 'A rival crew offers to buy your exclusive heist plans for a hefty sum. What do you say?',
        answers: [
            { text: 'Sell them the plans, but establish a royalty system so I get a cut of their take.', trait: 'wealth_builder', points: 3 },
            { text: 'Refuse. I only execute plans where I have total control of the risk variables.', trait: 'analytical', points: 3 },
            { text: 'Never. I keep my intellectual property secure and trust no one outside the team.', trait: 'cautious_saver', points: 3 },
            { text: 'Sell them a slightly altered, riskier plan and bet against them succeeding.', trait: 'risk_taker', points: 3 },
        ]
    },
    {
        id: 'mh_5',
        text: 'The Professor offers you a second, infinitely more dangerous heist. Your response?',
        answers: [
            { text: 'I\'m in! The adrenaline and the legendary payout are exactly what I live for.', trait: 'risk_taker', points: 3 },
            { text: 'Only if I am designated the primary financial controller with a larger equity stake.', trait: 'wealth_builder', points: 3 },
            { text: 'Show me the blueprints. If the risk-reward matrix checks out, I\'m on board.', trait: 'analytical', points: 3 },
            { text: 'No way. We got away clean. I\'m retiring to protect what I already have.', trait: 'cautious_saver', points: 3 },
        ]
    }
];

export interface FinalResult {
    house: string;
    trait: FinancialTrait;
    description: string;
    selectedAnswers: string[];
    scores: Record<FinancialTrait, number>;
}

type ScoreResult = Omit<FinalResult, 'selectedAnswers' | 'scores'>;

const resolveScore = (scores: Record<FinancialTrait, number>, theme: HouseVariant): ScoreResult => {
    // Find highest trait
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
            risk_taker: { house: 'Gryffindor', trait: 'risk_taker', description: 'Bold and impulsive! You make financial moves with courage, seeking high rewards.' },
            analytical: { house: 'Ravenclaw', trait: 'analytical', description: 'Strategic and wise! You research the markets thoroughly before parting with a single Knut.' },
            wealth_builder: { house: 'Slytherin', trait: 'wealth_builder', description: 'Ambitious and cunning! You know the value of compounding wealth and always seek the upper hand in a deal.' },
            cautious_saver: { house: 'Hufflepuff', trait: 'cautious_saver', description: 'Loyal and prepared! You prefer the safety of a full vault and only invest in reliable, steady ventures.' },
        },
        got: {
            risk_taker: { house: 'House Targaryen', trait: 'risk_taker', description: 'Fire and Blood! You take massive financial risks, burning through capital to conquer new markets.' },
            analytical: { house: 'House Baratheon', trait: 'analytical', description: 'Ours is the Fury, tempered with strategy. You are practical and calculated in your economic conquests.' },
            wealth_builder: { house: 'House Lannister', trait: 'wealth_builder', description: 'Hear Me Roar! You understand that gold is power, and you aggressively accumulate wealth to maintain your status.' },
            cautious_saver: { house: 'House Stark', trait: 'cautious_saver', description: 'Winter is Coming! You are conservative with your coin, always saving for leaner times and preferring deep security over flashy investments.' },
        },
        marvel: {
            risk_taker: { house: 'Team Thor', trait: 'risk_taker', description: 'Worthy of Mjölnir! You charge into financial battles with thunderous confidence, trusting bold moves will pay off.' },
            analytical: { house: 'Team Strange', trait: 'analytical', description: 'You\'ve seen 14 million possible outcomes. Every investment is calculated, every risk is modeled, every move is precise.' },
            wealth_builder: { house: 'Team Iron Man', trait: 'wealth_builder', description: 'Genius, billionaire, investor. You build financial empires with relentless innovation and strategic acquisitions.' },
            cautious_saver: { house: 'Team Cap', trait: 'cautious_saver', description: 'I can do this all day. You protect your financial position with unwavering discipline and serve the greater good.' },
        },
        sw: {
            risk_taker: { house: 'The Sith Order', trait: 'risk_taker', description: 'The Dark Side fuels your ambition! You embrace aggressive financial plays, knowing passion and daring lead to power.' },
            analytical: { house: 'The Jedi Council', trait: 'analytical', description: 'Patience, young investor. You meditate on every financial decision, seeking balance and wisdom before acting.' },
            wealth_builder: { house: 'The Mandalorians', trait: 'wealth_builder', description: 'This is the way. You are a bounty hunter of opportunity, accumulating beskar and assets through relentless dealing.' },
            cautious_saver: { house: 'The Rebel Alliance', trait: 'cautious_saver', description: 'Hope is your greatest asset. You protect what you have, build grassroots wealth, and fight for financial freedom.' },
        },
        mh: {
            risk_taker: { house: 'Team Tokyo', trait: 'risk_taker', description: 'All in, no regrets! You live for the adrenaline of high-stakes financial moves. Calculated? Maybe. Exciting? Always.' },
            analytical: { house: 'Team Professor', trait: 'analytical', description: 'Every detail is planned. You are the mastermind who sees 20 moves ahead, turning financial chaos into clockwork precision.' },
            wealth_builder: { house: 'Team Berlin', trait: 'wealth_builder', description: 'Elegant, strategic, and relentless. You treat wealth accumulation as an art form and negotiation as your masterpiece.' },
            cautious_saver: { house: 'Team Nairobi', trait: 'cautious_saver', description: 'Let the matriarchy begin! You protect the team\'s assets, ensure production runs smooth, and never waste a single euro.' },
        },
    };

    return houseMap[theme][dominantTrait];
};

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

    // Timer logic
    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [currentQuestionIndex]); // Reset timer on each question

    const questionMap: Record<HouseVariant, Question[]> = { hp: hpQuestions, got: gotQuestions, marvel: marvelQuestions, sw: swQuestions, mh: mhQuestions };
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
            // Finished
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
