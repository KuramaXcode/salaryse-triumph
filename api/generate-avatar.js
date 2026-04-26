import { getReplicateClient } from './_lib/replicate.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { prompt, model = 'bytedance/seedream-4', referenceImage } = req.body ?? {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ ok: false, error: 'prompt is required' });
    }

    let input;
    if (model === 'bytedance/seedream-4' || model === 'bytedance/seedream-4.5') {
      const imageInput = [];
      if (typeof referenceImage === 'string' && referenceImage.length > 0) {
        imageInput.push(referenceImage);
      }
      input = {
        size: '2K',
        width: 2048,
        height: 1152,
        prompt,
        max_images: 1,
        image_input: imageInput,
        aspect_ratio: '16:9',
        enhance_prompt: false,
        sequential_image_generation: 'disabled',
      };
    } else if (model === 'prunaai/z-image-turbo') {
      input = {
        width: 1024,
        height: 1024,
        prompt,
        go_fast: false,
        output_format: 'jpg',
        guidance_scale: 0,
        output_quality: 80,
        num_inference_steps: 8,
      };
    } else {
      input = {
        prompt,
        aspect_ratio: '1:1',
        safety_filter_level: 'block_medium_and_above',
      };
    }

    const replicate = getReplicateClient();
    // Use predictions.create() so the function returns immediately with a
    // prediction ID — the frontend polls /api/poll-avatar until it's ready.
    // This avoids Vercel's 10-second serverless timeout on the free plan.
    const prediction = await replicate.predictions.create({ model, input });
    return res.status(200).json({ ok: true, predictionId: prediction.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('generate-avatar error:', message);
    return res.status(500).json({ ok: false, error: message });
  }
}
