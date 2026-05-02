// ═══════════════════════════════════════════════════════════
// AI Avatar Generation Service
// ═══════════════════════════════════════════════════════════
// Builds themed prompts and calls AI image generation APIs.
// Provider-agnostic: swap via config.ts without changing logic.
// ═══════════════════════════════════════════════════════════

import { AI_CONFIG } from '../config';
import type { HouseVariant } from '../types';
import {
    universeStyles,
    houseAccents,
    traitDescriptions,
    getBaseInstructions
} from './promptConfig';

// ── Prompt Building ──

interface PromptContext {
    house: string;
    universe: HouseVariant;
    trait: string;
    userName: string;
}

export function buildPrompt(ctx: PromptContext, isTextOnly: boolean): string {
    const style = universeStyles[ctx.universe];
    const houseAccent = houseAccents[ctx.house] || '';
    const traitDesc = traitDescriptions[ctx.trait] || '';

    const promptParts = [
        `Subject: A person styled as a ${ctx.house} member from ${ctx.universe.toUpperCase()}.`,
        'The person looks like: realistic human portrait matching the uploaded selfie, preserving facial identity and hair details.',
        `Art Style: ${style.artStyle}.`,
        `Setting: ${style.setting}.`,
        `Lighting & Mood: ${style.mood}.`,
        `Vibe: ${traitDesc}.`,
        `Specific Details: ${houseAccent}.`,
        ...getBaseInstructions(isTextOnly)
    ];

    const prompt = promptParts.join(' ');

    console.log('--- GENERATED AI PROMPT ---');
    console.log(prompt);
    console.log('---------------------------');

    return prompt;
}

// ── Avatar Generation ──

export interface AvatarResult {
    success: boolean;
    imageBase64: string | null;
    imageUrl: string | null;
    error: string | null;
    prompt: string;
    modelName: string;
}

export async function generateAvatar(
    ctx: PromptContext,
    referencePhotoBase64: string | null,
): Promise<AvatarResult> {
    const isTextOnly = ['imagen', 'flux', 'z-image-turbo'].some((m) => AI_CONFIG.model.includes(m));
    const prompt = buildPrompt(ctx, isTextOnly);

    if (!AI_CONFIG.enabled) {
        return { success: false, imageBase64: null, imageUrl: null, error: 'AI generation disabled', prompt, modelName: 'none' };
    }

    if (AI_CONFIG.provider !== 'replicate' && !AI_CONFIG.apiKey) {
        return { success: false, imageBase64: null, imageUrl: null, error: 'No API key configured', prompt, modelName: 'none' };
    }

    try {
        switch (AI_CONFIG.provider) {
            case 'openai':
                return await generateWithOpenAI(prompt, referencePhotoBase64);
            case 'stability':
                return await generateWithStability(prompt, referencePhotoBase64);
            case 'replicate':
                return await generateWithReplicate(prompt, referencePhotoBase64);
            case 'nvidia':
                return await generateWithNvidia(prompt, referencePhotoBase64);
            default:
                return { success: false, imageBase64: null, imageUrl: null, error: `Unknown provider: ${AI_CONFIG.provider}`, prompt, modelName: 'none' };
        }
    } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error('Avatar generation failed:', errMsg);
        return { success: false, imageBase64: null, imageUrl: null, error: errMsg, prompt, modelName: 'none' };
    }
}

// ── Provider Implementations ──

async function generateWithOpenAI(
    prompt: string,
    referencePhotoBase64: string | null,
): Promise<AvatarResult> {
    // OpenAI gpt-image-1 supports image input for reference
    const body: Record<string, unknown> = {
        model: AI_CONFIG.model,
        prompt: prompt,
        n: 1,
        size: AI_CONFIG.imageSize,
    };

    // If we have a reference photo and using gpt-image-1, include it
    if (referencePhotoBase64 && AI_CONFIG.model === 'gpt-image-1') {
        // gpt-image-1 accepts image input in the prompt
        const response = await fetch('https://api.openai.com/v1/images/edits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-image-1',
                image: referencePhotoBase64, // base64 data URL
                prompt: prompt,
                n: 1,
                size: AI_CONFIG.imageSize,
            }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errData)}`);
        }

        const data = await response.json();
        const imageData = data.data?.[0];

        return {
            success: true,
            imageBase64: imageData?.b64_json ? `data:image/png;base64,${imageData.b64_json}` : null,
            imageUrl: imageData?.url || null,
            error: null,
            prompt,
            modelName: 'OpenAI (Edits)',
        };
    }

    // Standard generation without reference (DALL-E 3 or no photo)
    body.response_format = 'b64_json';

    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errData)}`);
    }

    const data = await response.json();
    const imageData = data.data?.[0];

    return {
        success: true,
        imageBase64: imageData?.b64_json ? `data:image/png;base64,${imageData.b64_json}` : null,
        imageUrl: imageData?.url || null,
        error: null,
        prompt,
        modelName: AI_CONFIG.model,
    };
}

async function generateWithStability(
    prompt: string,
    referencePhotoBase64: string | null,
): Promise<AvatarResult> {
    void referencePhotoBase64;
    // Stability AI text-to-image
    const response = await fetch(
        `https://api.stability.ai/v1/generation/${AI_CONFIG.model}/text-to-image`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                text_prompts: [{ text: prompt, weight: 1 }],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                steps: 30,
                samples: 1,
            }),
        },
    );

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`Stability API error: ${response.status} - ${JSON.stringify(errData)}`);
    }

    const data = await response.json();
    const imageBase64 = data.artifacts?.[0]?.base64;

    return {
        success: !!imageBase64,
        imageBase64: imageBase64 ? `data:image/png;base64,${imageBase64}` : null,
        imageUrl: null,
        error: imageBase64 ? null : 'No image returned',
        prompt,
        modelName: `Stability ${AI_CONFIG.model}`,
    };
}

function buildAvatarResult(data: Record<string, unknown>, prompt: string): AvatarResult {
    const inlineImageValue = typeof data.imageDataUrl === 'string' ? data.imageDataUrl : null;
    const imageValue = typeof data.imageUrl === 'string' ? data.imageUrl : null;
    const isDataUrl = !!inlineImageValue && inlineImageValue.startsWith('data:image/');
    return {
        success: !!(inlineImageValue || imageValue),
        imageBase64: isDataUrl ? inlineImageValue : null,
        imageUrl: isDataUrl ? null : imageValue,
        error: (inlineImageValue || imageValue) ? null : 'No image returned',
        prompt,
        modelName: (data.model as string) || AI_CONFIG.model,
    };
}

async function generateWithReplicate(
    prompt: string,
    referencePhotoBase64: string | null,
): Promise<AvatarResult> {
    const response = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt,
            model: AI_CONFIG.model,
            referenceImage: referencePhotoBase64,
        }),
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`Avatar API error: ${response.status} - ${JSON.stringify(errData)}`);
    }

    const startData = await response.json();

    // Local dev (server.mjs) returns the image directly — use it immediately.
    if (startData.imageUrl || startData.imageDataUrl) {
        return buildAvatarResult(startData, prompt);
    }

    // Vercel: predictions.create() returned a prediction ID — poll until ready.
    const predictionId = startData.predictionId as string | undefined;
    if (!predictionId) throw new Error('No prediction ID returned from avatar API');

    const MAX_MS = 180_000;
    const deadline = Date.now() + MAX_MS;
    let attempt = 0;

    while (Date.now() < deadline) {
        // Poll faster in the first 30s (warm models finish quickly), then slow down
        const interval = attempt < 12 ? 2_500 : 5_000;
        await new Promise((resolve) => setTimeout(resolve, interval));
        attempt++;
        const poll = await fetch(`/api/poll-avatar?id=${predictionId}`).catch(() => null);
        if (!poll?.ok) continue;
        const pollData = await poll.json();
        if (pollData.status === 'succeeded') return buildAvatarResult(pollData, prompt);
        if (pollData.status === 'failed' || pollData.status === 'canceled') {
            throw new Error(pollData.error || 'Prediction failed');
        }
    }

    throw new Error('Avatar generation timed out after 180 seconds');
}

async function generateWithNvidia(
    prompt: string,
    referencePhotoBase64: string | null,
): Promise<AvatarResult> {
    void referencePhotoBase64;
    const modelPath = AI_CONFIG.model; // e.g., 'black-forest-labs/flux-1-dev'
    const url = `https://ai.api.nvidia.com/v1/genai/${modelPath}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            prompt: prompt,
            mode: 'base', // Added based on your screenshot
            seed: Math.floor(Math.random() * 1000000),
            steps: 30, // Updated to match screenshot
            cfg_scale: 7,
        }),
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`NVIDIA NIM API error: ${response.status} - ${JSON.stringify(errData)}`);
    }

    const data = await response.json();

    // NVIDIA NIM often returns base64 in data[0].b64_json or artifacts[0].base64
    const b64 = data.data?.[0]?.b64_json || data.artifacts?.[0]?.base64 || data.image;

    return {
        success: !!b64,
        imageBase64: b64 ? (b64.startsWith('data:') ? b64 : `data:image/png;base64,${b64}`) : null,
        imageUrl: null,
        error: b64 ? null : 'No image returned from NVIDIA NIM',
        prompt,
        modelName: `NVIDIA ${AI_CONFIG.model}`,
    };
}
