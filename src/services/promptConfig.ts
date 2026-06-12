import type { HouseVariant } from '../types';

export interface UniverseStyle {
    artStyle: string;
    setting: string;
    mood: string;
}

export const universeStyles: Record<HouseVariant, UniverseStyle> = {
    hp: {
        artStyle: 'magical fantasy illustration, warm painterly style, Harry Potter cinematic universe aesthetic',
        setting: 'Hogwarts castle hallway with floating candles and enchanted ceiling in the background',
        mood: 'mystical, warm golden lighting, magical atmosphere',
    },
    got: {
        artStyle: 'dark medieval fantasy, gritty realistic oil painting, Game of Thrones cinematic style',
        setting: 'Iron Throne room with dramatic stone architecture in the background',
        mood: 'dark, dramatic, fire-lit, intense atmosphere',
    },
    marvel: {
        artStyle: 'semi-realistic cinematic portrait in the Marvel Cinematic Universe — stylized digital painting with bold heroic lighting and MCU concept art color grading, while the face retains the real person\'s photorealistic features and structure, NOT a comic-book illustration face',
        setting: 'high-tech Avengers headquarters with holographic displays in the background',
        mood: 'heroic, energetic, bold lighting with subtle lens flares',
    },
    sw: {
        artStyle: 'sci-fi space opera, Star Wars concept art style, dramatic cinematic lighting',
        setting: 'starship bridge overlooking a galaxy with distant planets in the background',
        mood: 'epic, cosmic, blue and purple nebula lighting',
    },
    mbh: {
        artStyle: 'semi-realistic digital portrait in the Mahabharata universe — richly detailed illustration with jewel-toned colors, golden divine lighting, and Indian epic film visual language, while the face retains the real person\'s photorealistic features and structure, NOT full stylized mythological illustration anatomy',
        setting: 'grand Hastinapur palace with ornate golden pillars and royal war banners in the background',
        mood: 'majestic, warm golden hour lighting, ancient Indian epic atmosphere with divine radiance',
    },
    dbz: {
        artStyle: 'semi-realistic anime-influenced digital portrait in the Dragon Ball Z universe — stylized illustration with bold cel-shading, vibrant saturated colors, and DBZ energy aesthetics, while the face retains the real person\'s photorealistic features and structure, NOT full Toriyama cartoon anatomy',
        setting: 'dramatic rocky landscape with distant mountains and golden ki energy crackling in the sky in the background',
        mood: 'powerful, energetic, bold orange and gold lighting with glowing ki aura atmosphere',
    },
};

// Accents describe wardrobe and background ONLY.
// No action poses, no hand-held objects near the face, no masks/visors/helmets covering features.
// This keeps the framing tight on the face so the reference photo dominates.
export const houseAccents: Record<string, string> = {
    // Harry Potter
    'Gryffindor': 'wearing crimson and gold Gryffindor robes with the lion crest on the chest, Gryffindor common room fireplace softly out of focus behind',
    'Ravenclaw': 'wearing blue and bronze Ravenclaw robes with the eagle crest on the chest, ancient library shelves softly out of focus behind',
    'Slytherin': 'wearing green and silver Slytherin robes with the serpent crest on the chest, dungeon torchlight softly out of focus behind',
    'Hufflepuff': 'wearing yellow and black Hufflepuff robes with the badger crest on the chest, warm Hufflepuff common room softly out of focus behind',

    // Game of Thrones
    'House Targaryen': 'wearing dark Targaryen leather garb with subtle dragon-scale texture on the shoulders, distant fire glow softly out of focus behind',
    'House Lannister': 'wearing crimson and gold Lannister attire with a small lion sigil at the collar, Casterly Rock hall softly out of focus behind',
    'House Stark': 'wearing fur-lined northern garb with a small direwolf sigil at the collar, snowy Winterfell courtyard softly out of focus behind',
    'House Baratheon': 'wearing black and gold Baratheon attire with a small stag sigil at the collar, Storm’s End hall softly out of focus behind',

    // Marvel
    ‘Team Thor’: ‘wearing Asgardian ceremonial armor on the shoulders and chest, soft lightning glow in the background — face and facial features preserved from reference photo, stylized in MCU cinematic aesthetic, no objects in front of the face’,
    ‘Team Strange’: ‘wearing the Cloak of Levitation\’s collar and a hint of mystical orange sigils glowing softly in the background — face and facial features preserved from reference photo, stylized in MCU cinematic aesthetic, no objects in front of the face’,
    ‘Team Iron Man’: ‘wearing a sleek nanotech chest plate with a soft arc-reactor glow at sternum level, faint HUD lines in the background — face and facial features preserved from reference photo, stylized in MCU cinematic aesthetic, no helmet on’,
    ‘Team Cap’: ‘wearing the patriotic suit visible at the shoulders with a small star on the chest, dawn light softly out of focus behind — face and facial features preserved from reference photo, stylized in MCU cinematic aesthetic, shield is not in frame’,

    // Star Wars
    'The Sith Order': 'wearing dark Sith robes at the shoulders, faint red glow in the background — no lightsaber or hands in front of the face',
    'The Jedi Council': 'wearing simple Jedi robes at the shoulders, Jedi Temple pillars softly out of focus behind — no lightsaber or hands in front of the face',
    'The Mandalorians': 'wearing Mandalorian beskar shoulder pauldrons, helmet OFF and held out of frame, starfield softly out of focus behind — face fully visible, no visor',
    'The Rebel Alliance': 'wearing an orange Rebel flight suit visible at the shoulders with the rebel insignia patch, hangar bay softly out of focus behind — helmet off, face fully visible',

    // Dragon Ball Z
    'Team Goku': 'wearing a vibrant orange Saiyan gi with blue undershirt visible at the collar, grassy plains and distant mountains softly out of focus behind — face and facial features preserved from reference photo, stylized in DBZ illustration aesthetic, no aura effects in front of the face',
    'Capsule Corp': 'wearing a sleek Capsule Corp branded jacket with the CC logo subtly on the chest, futuristic laboratory with holographic capsule displays softly out of focus behind — face and facial features preserved from reference photo, stylized in DBZ illustration aesthetic',
    'Frieza Force': 'wearing elegant Frieza Force armor with white and purple shoulderpads, space battleship interior with planet views softly out of focus behind — face and facial features preserved from reference photo, stylized in DBZ illustration aesthetic, no helmet or visor',
    'Namekian Guardians': 'wearing a martial arts gi with a weighted cape visible at the shoulders, lush green Namekian landscape softly out of focus behind — face and facial features preserved from reference photo, stylized in DBZ illustration aesthetic',

    // Mahabharata
    "Karna's Path": "wearing golden Karna kavach chest armor with sun-disc shoulder guards, a radiant sunset battlefield with scattered arrows softly out of focus behind — face and facial features preserved from reference photo, stylized in Indian epic film aesthetic, no weapons in front of face",
    "Krishna's Council": "wearing a royal peacock-feather adorned turban and blue-gold uttariya draped at the shoulders, a celestial Kurukshetra landscape with divine light softly out of focus behind — face and facial features preserved from reference photo, stylized in Indian epic film aesthetic",
    "Arjuna's Aim": "wearing Pandava warrior shoulder armor with a jeweled crown motif, a celestial chariot with golden divine light softly out of focus behind — face and facial features preserved from reference photo, stylized in Indian epic film aesthetic, no bow or weapons near the face",
    "Yudhishthira's Dharma": "wearing a white and gold dharmaraj crown and royal Pandava court garb at the shoulders, the grand Indraprastha palace court with ornate pillars softly out of focus behind — face and facial features preserved from reference photo, stylized in Indian epic film aesthetic",
};

// Trait phrases now describe expression and energy ONLY — no pose verbs that would
// pull the camera back or change body language away from a portrait crop.
export const traitDescriptions: Record<string, string> = {
    'risk_taker': 'bold, fearless expression, confident gaze, slight smirk',
    'analytical': 'calm, focused expression, sharp intelligent eyes, composed',
    'wealth_builder': 'confident, ambitious expression, commanding gaze',
    'cautious_saver': 'steady, calm expression, kind and composed eyes',
};

/**
 * Global instructions appended last. The identity-lock clause is intentionally
 * placed at the very START of the assembled prompt (see avatarService.buildPrompt)
 * because diffusion models weight earlier tokens more heavily.
 */
export const getBaseInstructions = (isTextOnly: boolean): string[] => {
    const base = [
        'High quality digital art, 8k resolution, masterpiece painting.',
        'Cinematic composition with sharply detailed, photorealistic face.',
        'Style the character to organically belong in this fictional universe.',
    ];

    if (!isTextOnly) {
        base.push('Reminder: preserve the exact face, skin tone, ethnicity, age, eye color, eyebrow shape, nose, lips, and hair from the reference photo. Do NOT idealize, lighten skin, change ethnicity, or alter facial geometry.');
    }

    return base;
};

/**
 * Identity + framing preamble — placed at the very front of the prompt so
 * the model locks onto facial fidelity before any stylistic tokens land.
 */
export const getIdentityPreamble = (isTextOnly: boolean): string[] => {
    if (isTextOnly) return [];
    return [
        'PRIMARY GOAL: photorealistic portrait that is unmistakably the same person as the uploaded reference photo.',
        'Preserve EXACTLY: facial structure, skin tone (do not lighten or alter), ethnicity, age, hair color and style, eye color, eyebrows, nose shape, lip shape, and any distinguishing features.',
        'Framing: head-and-shoulders portrait, face centered and fully visible, eyes looking toward camera, neutral relaxed expression unless otherwise specified.',
        'Strict rules: no hands, weapons, wands, lightsabers, masks, visors, helmets, or other objects covering, crossing, or near the face. No extreme action pose. No tilted or profile angles — face the camera.',
    ];
};
