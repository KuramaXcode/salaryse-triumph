import { getReplicateClient, normalizeOutputToUrl } from './_lib/replicate.js';

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

async function fetchImageAsDataUrl(imageUrl) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch generated image: ${response.status}`);
  }
  const contentType = response.headers.get('content-type') || 'image/png';
  const buffer = Buffer.from(await response.arrayBuffer());
  return `data:${contentType};base64,${buffer.toString('base64')}`;
}

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
    const output = await runWithRetry(replicate, model, input);
    const imageUrl = normalizeOutputToUrl(output);

    if (imageUrl) {
      let imageDataUrl = null;
      try {
        imageDataUrl = await fetchImageAsDataUrl(imageUrl);
      } catch (imgErr) {
        console.warn('Could not inline generated image as data URL:', imgErr instanceof Error ? imgErr.message : String(imgErr));
      }
      return res.status(200).json({ ok: true, imageUrl, imageDataUrl, model });
    }

    return res.status(502).json({
      ok: false,
      error: 'No image content found in response',
      hint: 'Model response contained no image URL/file. Check Vercel function logs for raw provider errors.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('generate-avatar error:', message);
    return res.status(500).json({ ok: false, error: message });
  }
}
