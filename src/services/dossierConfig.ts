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

    // ── Dragon Ball Z ────────────────────────────────────────────────────────
    'Team Goku': {
        salutation: 'THE SAIYAN MARKET WARRIOR',
        strength1: 'You are strongest when the odds are stacked against you. Volatility does not scare you — it powers you up. Your best entries happen precisely when everyone else is running.',
        strength2: 'You push past perceived limits constantly. Where others see a ceiling, you see the next level. That relentless drive turns small positions into transformative ones over time.',
        weakness: 'Even Goku needed a Senzu Bean. Going Ultra Instinct on every trade without a recovery plan means one bad fight can set you back an entire saga. Build your reserve before the next arc.',
    },
    'Capsule Corp': {
        salutation: 'THE GENIUS EMPIRE ARCHITECT',
        strength1: 'You think like Bulma and execute like Vegeta. You combine brilliant systems thinking with relentless ambition to build something that outlasts any single market cycle.',
        strength2: 'You invest in infrastructure, not just assets. The businesses, systems, and networks you build compound in ways a pure trader never experiences.',
        weakness: 'Not every problem needs a time machine. Over-engineering your financial systems can delay execution. Sometimes the best capsule is the one you open, not the one you are still designing.',
    },
    'Frieza Force': {
        salutation: 'THE GALACTIC MARKET EMPEROR',
        strength1: 'You survey every sector with cold, calculated precision before committing a single credit. Your due diligence is legendary — you never enter a market without already knowing your exit.',
        strength2: 'You understand power structures better than anyone. You know which assets are truly dominant and which ones merely look impressive. That distinction alone is worth a fortune.',
        weakness: "Frieza's empire fell because he underestimated the intangibles. Not every competitive advantage shows up in the numbers. Leave room in your model for what the data cannot quantify.",
    },
    'Namekian Guardians': {
        salutation: 'THE GUARDIAN OF THE LONG GAME',
        strength1: 'Like Piccolo mastering his potential through years of silent training, your wealth builds through unbreakable discipline rather than explosive bursts. Your consistency is your superpower.',
        strength2: 'You guard your financial health with the same dedication Piccolo guards the Earth. While others overspend in bull markets, your reserves are always ready for the real opportunity.',
        weakness: 'Even Piccolo eventually fused with Nail to unlock new power. A small growth allocation could dramatically amplify your already-solid base without compromising the foundation you have built.',
    },

    // ── Mahabharata ─────────────────────────────────────────────────────────────
    "Karna's Path": {
        salutation: 'THE FEARLESS VALOR INVESTOR',
        strength1: "You back convictions the way Karna backed his — completely, no reserves held. That fearlessness lands you opportunities others only watch pass.",
        strength2: "Your abundance mindset draws deals and partnerships that flow only to those who are never seen as small or afraid.",
        weakness: "Karna's loyalty was both his power and his blindness. Know when devotion to a position has become the position that defeats you.",
    },
    "Krishna's Council": {
        salutation: 'THE DIVINE MARKET STRATEGIST',
        strength1: "You see the full Kurukshetra before the first arrow flies. Your decisions account for ripple effects most investors never model.",
        strength2: "You grasp that timing IS the strategy. Patience has protected your wealth through cycles that demolished less disciplined portfolios.",
        weakness: "The Gita was spoken in a moment of crisis. Stop waiting for cosmic clarity — the market rewards decisive entry, not perfect analysis.",
    },
    "Arjuna's Aim": {
        salutation: 'THE PRECISE WEALTH ARCHER',
        strength1: "Your focus is your Gandiva. When you commit to a position, you commit fully — no half measures, no distracted exits.",
        strength2: "Your returns reflect expertise built through genuine study and practice, not luck. That edge compounds quietly for decades.",
        weakness: "Even Arjuna needed Krishna to see the bigger picture. Narrow focus misses macro shifts — build one lens that challenges your thesis.",
    },
    "Yudhishthira's Dharma": {
        salutation: 'THE DHARMIC WEALTH GUARDIAN',
        strength1: "Your word is your bond and your portfolio reflects it. You never chase returns that compromise your peace of mind — genuinely rare.",
        strength2: "You protect the kingdom before expanding it. Conservative allocations others dismiss have saved you from crises that wiped out the bold.",
        weakness: "Even Yudhishthira's dharma led him to wager too cautiously. Allocate a disciplined growth portion — your kingdom deserves to expand.",
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
