// ═══════════════════════════════════════════════════════════
// FPS vFinal_1 — Configuration
// ═══════════════════════════════════════════════════════════
// Set your API key and provider here. The avatar generation
// service will use these to call the AI model.
// ═══════════════════════════════════════════════════════════

export const AI_CONFIG = {
    // API keys must never live in frontend code. Backend reads env vars.
    apiKey: '',

    /**
     * Which provider to use for avatar generation.
     * Options: 'openai' | 'stability' | 'replicate' | 'nvidia'
     */
    provider: 'replicate' as 'openai' | 'stability' | 'replicate' | 'nvidia',

    /**
     * Model name to use.
     * Default: 'bytedance/seedream-4'
     */
    model: 'bytedance/seedream-4',

    /**
     * Image size for the output.
     * OpenAI DALL-E 3: '1024x1024', '1024x1792', '1792x1024'
     * Stability: 1024, 512, etc.
     */
    imageSize: '1024x1024',

    /**
     * Enable/disable avatar generation.
     * Set to false to skip AI generation and use raw photo.
     */
    enabled: true,
};

// Google Sheets webhook URL
export const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxT0hIDHKvfMiVVNPqfB4ZwBl6E2v80uoEt4Ft7HymWIwxX9G1IT-tc6V3TwVKYgt_4/exec';
