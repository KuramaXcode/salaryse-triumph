import { getReplicateClient } from './_lib/replicate.js';

const VISION_MODEL = 'lucataco/ollama-llama3.2-vision-11b:d4e81fc1472556464f1ee5cea4de177b2fe95a6eaadb5f63335df1ba654597af';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runWithRetry(replicate, model, input) {
  try {
    return await replicate.run(model, { input });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('status 429')) {
      await wait(2000);
      return await replicate.run(model, { input });
    }
    throw err;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body ?? {};
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ ok: false, error: 'imageBase64 is required' });
    }

    const replicate = getReplicateClient();
    const output = await runWithRetry(replicate, VISION_MODEL, {
      image: imageBase64,
      prompt:
        'You are an expert character concept artist. Describe only visible face/head details: age range, face shape, skin tone, hair color/style, facial hair, eyewear, expression. Max 30 words.',
    });

    let description = '';
    if (Array.isArray(output)) description = output.join('').trim();
    else if (typeof output === 'string') description = output.trim();
    else if (output) description = String(output).trim();

    if (!description) {
      return res.status(502).json({ ok: false, error: 'No description returned from vision model' });
    }

    return res.status(200).json({ ok: true, description });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('describe-photo error:', message);
    return res.status(500).json({ ok: false, error: message });
  }
}
