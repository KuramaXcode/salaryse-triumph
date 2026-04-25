import { type FinancialTrait } from '../components/Quiz';

export interface DossierEntry {
    label: string;
    strength: string;
    weakness: string;
    solution: string; // The "fix" for the participant
    axis: string;
}

export const dossierMap: Record<FinancialTrait, DossierEntry & { salutation: string }> = {
    risk_taker: {
        axis: 'RISK TOLERANCE',
        label: 'Daring',
        salutation: 'A BRAVE VISIONARY',
        strength: 'Your capital thrives on high-stakes maneuvers, turning market volatility into a tactical arena of power.',
        weakness: 'Extreme exposure to volatile sectors can jeopardize your core mission during unexpected shifts.',
        solution: 'deploy strategic collateral to shield your primary holdings'
    },
    analytical: {
        axis: 'STRATEGIC DEPTH',
        label: 'Logic',
        salutation: 'A STRATEGIC MASTERMIND',
        strength: 'With a logic-driven pulse and market-piercing vision, you decode complex financial webs with ease.',
        weakness: 'Precision-lock on data can sometimes delay critical strikes when the window of opportunity is narrow.',
        solution: 'trust your early modeling to execute rapid maneuvers'
    },
    wealth_builder: {
        axis: 'GROWTH POTENTIAL',
        label: 'Expansion',
        salutation: 'A POTENT WEALTH ARCHITECT',
        strength: 'You command a growing empire, masterfully capturing assets today to fuel a unstoppable legacy tomorrow.',
        weakness: 'Over-extending your reach can leave vital sectors vulnerable to sudden environmental pressures.',
        solution: 'diversify your canopy across different soil types'
    },
    cautious_saver: {
        axis: 'STABILITY RATING',
        label: 'Resilience',
        salutation: 'A RESILIENT GUARDIAN',
        strength: 'Your financial shield is impenetrable, providing a solid bedrock for long-term security and peace.',
        weakness: 'Excessive defense can occasionally isolate you from lucrative high-impact trade routes.',
        solution: 'dedicate reserve assets to bold experimental voyages'
    }
};

const salutationMatrix: Record<FinancialTrait, Record<string, string>> = {
    risk_taker: {
        analytical: 'STRATEGIC RISK ARCHITECT',
        wealth_builder: 'BOLD GROWTH VENTURER',
        cautious_saver: 'CALIBRATED VISIONARY',
        default: 'BRAVE VENTURE MASTER'
    },
    analytical: {
        risk_taker: 'DYNAMIC STRATEGIC ANALYST',
        wealth_builder: 'PRECISION WEALTH MASTERMIND',
        cautious_saver: 'ELITE SYSTEMIC GUARDIAN',
        default: 'SUPREME LOGIC ARCHITECT'
    },
    wealth_builder: {
        risk_taker: 'AGGRESSIVE GROWTH PIONEER',
        analytical: 'STRATEGIC ASSET COMMANDER',
        cautious_saver: 'RESILIENT WEALTH BUILDER',
        default: 'POTENT MARKET ARCHITECT'
    },
    cautious_saver: {
        risk_taker: 'TACTICAL SHIELD COMMANDER',
        analytical: 'METHODICAL ASSET PROTECTOR',
        wealth_builder: 'STABLE GROWTH GUARDIAN',
        default: 'RESILIENT FORTRESS WARDEN'
    }
};

/**
 * Maps quiz points (0-15) to stars (2.0-5.0)
 * Logic: (score/15 * 3) + 2 [Floored at 2.0]
 * @param score The raw quiz points
 * @param isDominant If true, boost the result to be at least 4.5
 */
export function calculateStars(score: number, isDominant: boolean = false): number {
    const raw = (score / 15) * 3 + 2;
    let rounded = Math.round(raw * 2) / 2;

    if (isDominant) {
        // Boost the dominant trait to at least 4.5
        rounded = Math.max(4.5, rounded);
    }

    return Math.max(2.0, rounded);
}

export function getDossierInsights(scores: Record<FinancialTrait, number>) {
    const sortedTraits = (Object.keys(scores) as FinancialTrait[]).sort((a, b) => scores[b] - scores[a]);

    const primaryTrait = sortedTraits[0];
    const secondaryTrait = sortedTraits[1];

    const topTraitData = dossierMap[primaryTrait];
    const strength1 = topTraitData.strength;
    const strength2 = dossierMap[secondaryTrait].strength;

    // Generate Composite Salutation
    const salutation = salutationMatrix[primaryTrait][secondaryTrait] || salutationMatrix[primaryTrait].default;

    const wTrait = dossierMap[sortedTraits[sortedTraits.length - 1]];
    const combinedWeakness = `Your primary challenge is ${wTrait.label.toLowerCase()}. By ${wTrait.solution.toLowerCase()}, you become undefeatable.`;

    // Map each score to a star value
    const starScores = {
        risk_taker: calculateStars(scores.risk_taker, primaryTrait === 'risk_taker'),
        analytical: calculateStars(scores.analytical, primaryTrait === 'analytical'),
        wealth_builder: calculateStars(scores.wealth_builder, primaryTrait === 'wealth_builder'),
        cautious_saver: calculateStars(scores.cautious_saver, primaryTrait === 'cautious_saver')
    };

    return { strength1, strength2, combinedWeakness, salutation, starScores };
}
