import type { HouseVariant } from '../types';

export interface UniverseStyle {
    artStyle: string;
    setting: string;
    mood: string;
}

export const universeStyles: Record<HouseVariant, UniverseStyle> = {
    hp: {
        artStyle: 'magical fantasy illustration, warm painterly style, Harry Potter cinematic universe aesthetic',
        setting: 'Hogwarts castle hallway with floating candles and enchanted ceiling',
        mood: 'mystical, warm golden lighting, magical atmosphere',
    },
    got: {
        artStyle: 'dark medieval fantasy, gritty realistic oil painting, Game of Thrones cinematic style',
        setting: 'Iron Throne room with dramatic stone architecture',
        mood: 'dark, dramatic, fire-lit, intense atmosphere',
    },
    marvel: {
        artStyle: 'modern superhero comic art, vibrant digital illustration, Marvel cinematic poster style',
        setting: 'high-tech Avengers headquarters with holographic displays',
        mood: 'heroic, energetic, bold lighting with lens flares',
    },
    sw: {
        artStyle: 'sci-fi space opera, Star Wars concept art style, dramatic cinematic lighting',
        setting: 'starship bridge overlooking a galaxy with distant planets',
        mood: 'epic, cosmic, blue and purple nebula lighting',
    },
    mh: {
        artStyle: 'stylish crime thriller, cinematic neo-noir digital art, Money Heist visual aesthetic',
        setting: 'inside the Royal Mint of Spain vault with gold bars and red jumpsuits',
        mood: 'intense, red-tinted, dramatic shadows, heist atmosphere',
    },
};

export const houseAccents: Record<string, string> = {
    // Harry Potter
    'Gryffindor': 'wearing crimson and gold robes, lion crest, brave stance with wand drawn',
    'Ravenclaw': 'wearing blue and bronze robes, eagle crest, scholarly pose with ancient tome',
    'Slytherin': 'wearing green and silver robes, serpent crest, cunning smirk, dark elegance',
    'Hufflepuff': 'wearing yellow and black robes, badger crest, warm friendly expression',

    // Game of Thrones
    'House Targaryen': 'platinum hair flowing, dragon scale armor, fire in the background',
    'House Lannister': 'golden armor with lion sigil, regal posture, crown of wealth',
    'House Stark': 'fur-lined northern armor, direwolf at side, snow falling',
    'House Baratheon': 'antlered helm, war hammer, stag banner behind',

    // Marvel
    'Team Thor': 'lightning crackling around arms, Asgardian armor, Mjolnir in hand',
    'Team Strange': 'mystical orange portals opening, Cloak of Levitation, third eye glowing',
    'Team Iron Man': 'sleek nanotech armor materializing, arc reactor glowing, HUD overlay',
    'Team Cap': 'patriotic suit with shield, determined expression, dawn light behind',

    // Star Wars
    'The Sith Order': 'red lightsaber ignited, dark robes, crackling dark side energy',
    'The Jedi Council': 'green lightsaber, serene expression, Temple pillars behind',
    'The Mandalorians': 'beskar armor with jetpack, visor reflecting starlight',
    'The Rebel Alliance': 'flight suit with rebel insignia, X-wing cockpit behind',

    // Money Heist
    'Team Tokyo': 'red jumpsuit and Salvador Dalí mask pulled up, intense eyes, guns blazing',
    'Team Professor': 'smart glasses, chess pieces floating, blueprints projected holographically',
    'Team Berlin': 'elegant suit under red jumpsuit, gold watch, commanding presence',
    'Team Nairobi': 'red jumpsuit, gold press running behind, protective leadership pose',
};

export const traitDescriptions: Record<string, string> = {
    'risk_taker': 'bold, daring, fearless expression, dynamic action pose',
    'analytical': 'calculating, focused, surrounded by data and charts, precise posture',
    'wealth_builder': 'powerful, ambitious, surrounded by symbols of wealth, commanding stance',
    'cautious_saver': 'protective, steady, shielded stance, calm and composed expression',
};

/**
 * Global prompt instructions to ensure consistency and quality.
 */
export const getBaseInstructions = (isTextOnly: boolean): string[] => {
    const base = [
        'Artistic portrait orientation.',
        'Cinematic composition with detailed face.',
        'Style the character to organically belong in this fictional universe.',
        'High quality digital art, 8k resolution, masterpiece painting.',
    ];

    if (!isTextOnly) {
        base.push('Character must look exactly like the reference photo (face, features, skin tone).');
    }

    return base;
};
