import { type FinancialTrait } from '../components/Quiz';

interface HouseInsight {
    salutation: string;
    strength1: string;
    strength2: string;
    weakness: string;
}

// Unique card content keyed by house name.
// Every one of the 20 possible houses has its own distinct copy.
const houseInsightsMap: Record<string, HouseInsight> = {

    // ── Harry Potter ────────────────────────────────────────────────────────
    'Gryffindor': {
        salutation: 'THE LION-HEARTED INVESTOR',
        strength1: 'You charge markets the way Gryffindors charge Dark wizards — with conviction before the full picture is even clear.',
        strength2: 'When others freeze in volatility, you act. That decisive courage, applied consistently, compounds into extraordinary returns.',
        weakness: 'Bravery without a shield is recklessness. Your biggest financial threat is not the market — it is skipping the safety check before you leap.',
    },
    'Ravenclaw': {
        salutation: 'THE ARCHITECT OF RETURNS',
        strength1: 'You read a balance sheet the way Ravenclaws read restricted texts — with precision, depth, and genuine intellectual curiosity.',
        strength2: 'Your research consistently catches what others miss. You rarely enter a position without already knowing your exit.',
        weakness: 'The perfect analysis never arrives. Sometimes the window closes while you are still perfecting the model. Act on 80% information.',
    },
    'Slytherin': {
        salutation: 'THE CUNNING CAPITAL COMMANDER',
        strength1: 'You see leverage where others see risk and opportunity where others see obstacles. Ambition itself is your compounding interest.',
        strength2: 'You build networks that build wealth. Your deals tend to benefit you long after everyone else has moved on to the next thing.',
        weakness: 'Not every relationship is a transaction. Over-optimising for return can erode trust — and trust is the hardest asset to rebuild.',
    },
    'Hufflepuff': {
        salutation: 'THE STEADFAST VAULT KEEPER',
        strength1: 'Your financial foundation is unshakeable. While others rebuild after every market crash, you simply continue growing.',
        strength2: 'You show up consistently, year after year, contribution after contribution. Compound interest was invented for people exactly like you.',
        weakness: 'Safety has a cost too — the opportunities you never took. A small allocation to growth could amplify your already-solid base dramatically.',
    },

    // ── Game of Thrones ─────────────────────────────────────────────────────
    'House Targaryen': {
        salutation: 'THE DRAGON-BLOODED PIONEER',
        strength1: 'You invest like you have dragons behind you — all-in, with the conviction that your vision will reshape the entire landscape.',
        strength2: 'You see paradigm shifts before they happen and position yourself to lead them, not follow them.',
        weakness: 'Fire that burns everything leaves nothing to rule. A single flame-guard — a stop-loss, a hedge — protects the empire you are building.',
    },
    'House Lannister': {
        salutation: 'THE GOLD-STANDARD STRATEGIST',
        strength1: 'A Lannister always pays their debts — and always structures the deal so those debts earn a return. Leverage is your native language.',
        strength2: 'You understand that reputation IS capital. Your financial credibility opens doors that money alone simply cannot.',
        weakness: 'Gold buys armies but not loyalty. Your wealth strategy is strongest when it creates genuine value for others, not just extraction.',
    },
    'House Stark': {
        salutation: 'THE WINTER-PROOF GUARDIAN',
        strength1: 'When the financial winter arrives — and it always does — you are the only one with reserves deep enough to survive and then acquire.',
        strength2: 'Your emergency fund is not a safety net. It is a strategic weapon. You negotiate from strength, never from desperation.',
        weakness: 'The Wall keeps out opportunity too. Dedicating even 10% of your portfolio to growth assets could dramatically shift your long-term trajectory.',
    },
    'House Baratheon': {
        salutation: 'THE STRATEGIC FURY ANALYST',
        strength1: 'Your fury is calculated. You storm markets with data-backed conviction — hitting positions with both force and precision simultaneously.',
        strength2: 'You combine gut instinct with evidence, a rare combination that most investors spend entire careers trying to develop.',
        weakness: 'Even calculated fury needs patience. Your strongest plays tend to be the ones you held past your first impulse to exit.',
    },

    // ── Marvel ──────────────────────────────────────────────────────────────
    'Team Thor': {
        salutation: 'THE LIGHTNING-STRIKE INVESTOR',
        strength1: 'You make decisions with Mjolnir-level conviction. When you fully commit to a position, that commitment itself often creates the outcome.',
        strength2: 'You thrive in volatile markets that paralyse others. Your composure under financial thunder is a genuine, sustainable edge.',
        weakness: 'Even Thor needs the Warriors Three. Building a trusted advisor circle prevents worthy decisions from becoming unexpectedly costly ones.',
    },
    'Team Strange': {
        salutation: 'THE MULTIVERSAL MARKET SEER',
        strength1: 'You have run 14 million scenarios before making a single move. Your downside protection is exceptional because you have already lived the bad outcomes.',
        strength2: 'You see correlations and patterns that others genuinely cannot. Your portfolio construction is closer to architecture than speculation.',
        weakness: 'In 14 million futures there is always a reason not to act. Trust the model you already built and execute. The perfect moment is usually right now.',
    },
    'Team Iron Man': {
        salutation: 'THE GENIUS WEALTH ENGINEER',
        strength1: 'You do not just invest in the future — you build it. Your portfolio reads like a working blueprint for the next decade.',
        strength2: 'You innovate your financial strategy the way Stark upgrades the suit: constantly iterating toward something smarter and more effective.',
        weakness: 'Mark I suits have exploded in caves before. Not every position needs to be cutting-edge. Sometimes boring and proven compounds beautifully.',
    },
    'Team Cap': {
        salutation: 'THE DISCIPLINED SHIELD BEARER',
        strength1: 'I can do this all day — and so can your portfolio. Your discipline in down markets is precisely where most other investors\' wealth quietly transfers to yours.',
        strength2: 'You invest in alignment with your values, which means you sleep soundly at night and hold through volatility without ever panicking.',
        weakness: 'The world has changed since the 1940s. Inflation quietly erodes what you protect. A modest growth allocation keeps your shield relevant today.',
    },

    // ── Star Wars ────────────────────────────────────────────────────────────
    'The Sith Order': {
        salutation: 'THE DARK SIDE MARKET FORCE',
        strength1: 'Your passion for financial victory drives returns that balanced investors only read about. You do not play not to lose — you play to dominate.',
        strength2: 'You sense market disturbances before they fully form and position with speed and aggression that creates genuinely outsized gains.',
        weakness: 'Anger is a weapon that eventually turns inward. A risk-management protocol — your personal Rule of Two — keeps the power from consuming the portfolio.',
    },
    'The Jedi Council': {
        salutation: 'THE FORCE-BALANCED STRATEGIST',
        strength1: 'Patience, young investor. Your willingness to wait for the right entry point means you almost never overpay for any asset.',
        strength2: 'You sense the market\'s rhythm through the Force of data. Your timing is often uncanny because you have studied deeply when not to act.',
        weakness: 'The Council\'s greatest failure was hesitation at the critical moment. When your analysis signals action, trust it completely and move.',
    },
    'The Mandalorians': {
        salutation: 'THE BESKAR-GRADE ACCUMULATOR',
        strength1: 'This is the way: accumulate hard assets, build diversified income streams, and protect them with Beskar-grade discipline and consistency.',
        strength2: 'You are a bounty hunter of opportunity. When a deal is genuinely worth pursuing, you pursue it relentlessly and close entirely on your terms.',
        weakness: 'Lone wolves miss foundational deals. A proper financial crew — accountant, advisor, tax strategist — multiplies your Beskar significantly over time.',
    },
    'The Rebel Alliance': {
        salutation: 'THE HOPE-ANCHORED GUARDIAN',
        strength1: 'Rebellions — and financial independence — are built on hope backed by rigorous preparation. Your reserves are your real firepower.',
        strength2: 'You protect what matters most. Your financial decisions are grounded in values, not hype — which keeps you from chasing expensive fads.',
        weakness: 'Hope alone does not win. Your rebellion needs a strike team: allocate a focused portion to high-conviction growth to take the fight to the Empire.',
    },

    // ── Money Heist ──────────────────────────────────────────────────────────
    'Team Tokyo': {
        salutation: 'THE ALL-IN ADRENALINE INVESTOR',
        strength1: 'You have nothing to lose — and that fearlessness is your most bankable asset. You enter positions that others are genuinely too scared to touch.',
        strength2: 'Your emotional intensity becomes a weapon in high-stakes moments. When it matters most, you do not flinch.',
        weakness: 'Tokyo\'s story is a warning too. Emotional investing without a written exit plan turns courage into a beautiful disaster. Write your rules before you enter.',
    },
    'Team Professor': {
        salutation: 'THE MASTER PLAN ARCHITECT',
        strength1: 'The plan. Always the plan. Your financial blueprints account for variables that others do not even know to consider.',
        strength2: 'You prepare for failure as rigorously as success. Your contingency planning means setbacks are speed bumps, never walls.',
        weakness: 'Even the Professor\'s plan nearly collapsed because he underestimated emotion. Build human variables into your models — markets are made of people.',
    },
    'Team Berlin': {
        salutation: 'THE ELEGANT EMPIRE BUILDER',
        strength1: 'You treat wealth accumulation as a masterpiece. Every deal is negotiated with the precision and confidence of someone who knows exactly their worth.',
        strength2: 'Your composure in high-pressure financial moments is extraordinary. You never negotiate from fear — only ever from position.',
        weakness: 'Berlin\'s fatal flaw was believing the plan was bigger than the people. The best portfolios diversify relationships as carefully as assets.',
    },
    'Team Nairobi': {
        salutation: 'THE MATRIARCH OF CAPITAL',
        strength1: 'Let the matriarchy begin. You run the numbers, protect the assets, and ensure not a single rupee is wasted in operation.',
        strength2: 'Your operational discipline is exceptional. You know exactly where every resource is allocated and you hold people accountable to the plan.',
        weakness: 'You protect so well that you sometimes protect from the upside too. A managed-risk growth sleeve would give your impeccable base real room to compound.',
    },
};

// Max points per trait with 3 questions × 3 points each = 9
export function calculateStars(score: number, isDominant: boolean = false): number {
    const raw = (score / 9) * 3 + 2;
    let rounded = Math.round(raw * 2) / 2;

    if (isDominant) {
        rounded = Math.max(4.5, rounded);
    }

    return Math.max(2.0, rounded);
}

export function getDossierInsights(scores: Record<FinancialTrait, number>, house: string) {
    const sortedTraits = (Object.keys(scores) as FinancialTrait[]).sort((a, b) => scores[b] - scores[a]);
    const primaryTrait = sortedTraits[0];

    const insight = houseInsightsMap[house];

    const starScores = {
        risk_taker:     calculateStars(scores.risk_taker,     primaryTrait === 'risk_taker'),
        analytical:     calculateStars(scores.analytical,     primaryTrait === 'analytical'),
        wealth_builder: calculateStars(scores.wealth_builder, primaryTrait === 'wealth_builder'),
        cautious_saver: calculateStars(scores.cautious_saver, primaryTrait === 'cautious_saver'),
    };

    if (!insight) {
        return {
            salutation: 'A FINANCIAL FORCE',
            strength1: 'Your instincts in high-stakes moments are sharper than most.',
            strength2: 'You have a rare ability to stay composed when others panic.',
            combinedWeakness: 'Your biggest opportunity is consistency. Build the habit and the results compound automatically.',
            starScores,
        };
    }

    return {
        salutation: insight.salutation,
        strength1: insight.strength1,
        strength2: insight.strength2,
        combinedWeakness: insight.weakness,
        starScores,
    };
}
