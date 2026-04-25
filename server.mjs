import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Replicate from 'replicate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');

dotenv.config({ path: path.join(__dirname, '.env') });

const PORT = Number(process.env.PORT || 8787);
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const VISION_MODEL = 'lucataco/ollama-llama3.2-vision-11b:d4e81fc1472556464f1ee5cea4de177b2fe95a6eaadb5f63335df1ba654597af';
const SHEET_WEBHOOK_URL = process.env.SHEET_WEBHOOK_URL || process.env.GAS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbzhl0hN5wQbw0e9Lm3vm12n2M3onomtL-iAIIG-TXcBnWH7bL13cNbbQwguYcTNSq_E/exec';

if (!REPLICATE_API_TOKEN) {
  console.error('Missing REPLICATE_API_TOKEN. Set it in local .env or in Vercel Environment Variables.');
  process.exit(1);
}

const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });
const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));

function normalizeOutputToUrl(output) {
  if (!output) {
    return null;
  }

  if (typeof output === 'string') {
    return output;
  }

  if (Array.isArray(output)) {
    for (const item of output) {
      const candidate = normalizeOutputToUrl(item);
      if (candidate) {
        return candidate;
      }
    }
    return null;
  }

  if (typeof output.url === 'function') {
    const value = output.url();
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
    if (value instanceof URL) {
      return value.toString();
    }
  }

  if (typeof output.url === 'string' && output.url.length > 0) {
    return output.url;
  }

  if (typeof output.href === 'string' && output.href.length > 0) {
    return output.href;
  }

  if (Array.isArray(output.urls)) {
    for (const item of output.urls) {
      if (typeof item === 'string' && item.length > 0) {
        return item;
      }
    }
  }

  if (typeof output.toString === 'function') {
    const value = output.toString();
    if (typeof value === 'string' && /^https?:\/\//.test(value)) {
      return value;
    }
  }

  return null;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runWithRetry(model, input) {
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

app.post('/api/describe-photo', async (req, res) => {
  try {
    const { imageBase64 } = req.body ?? {};

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ ok: false, error: 'imageBase64 is required' });
    }

    const output = await runWithRetry(VISION_MODEL, {
      image: imageBase64,
      prompt: 'You are an expert character concept artist. Describe only visible face/head details: age range, face shape, skin tone, hair color/style, facial hair, eyewear, expression. Max 30 words.'
    });

    let description = '';
    if (Array.isArray(output)) {
      description = output.join('').trim();
    } else if (typeof output === 'string') {
      description = output.trim();
    } else if (output) {
      description = String(output).trim();
    }

    if (!description) {
      return res.status(502).json({ ok: false, error: 'No description returned from vision model' });
    }

    return res.json({ ok: true, description });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('describe-photo error:', message);
    return res.status(500).json({ ok: false, error: message });
  }
});

app.post('/api/generate-avatar', async (req, res) => {
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
        width: 1024,
        height: 1360,
        prompt,
        max_images: 1,
        image_input: imageInput,
        aspect_ratio: '3:4',
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

    const output = await runWithRetry(model, input);
    const imageUrl = normalizeOutputToUrl(output);

    if (imageUrl) {
      let imageDataUrl = null;
      try {
        imageDataUrl = await fetchImageAsDataUrl(imageUrl);
      } catch (imgErr) {
        console.warn('Could not inline generated image as data URL:', imgErr instanceof Error ? imgErr.message : String(imgErr));
      }
      return res.json({ ok: true, imageUrl, imageDataUrl, model });
    }

    return res.status(502).json({
      ok: false,
      error: 'No image content found in response',
      hint: 'Model response contained no image URL/file. Check terminal logs for raw provider errors.'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('generate-avatar error:', message);
    return res.status(500).json({ ok: false, error: message });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, replicateConfigured: Boolean(REPLICATE_API_TOKEN) });
});

app.get('/api/image-proxy', async (req, res) => {
  const source = req.query?.url;
  if (!source || typeof source !== 'string') {
    return res.status(400).json({ ok: false, error: 'url is required' });
  }

  try {
    const upstream = await fetch(source);
    if (!upstream.ok) {
      return res.status(502).json({ ok: false, error: `Failed to fetch source image: ${upstream.status}` });
    }

    const contentType = upstream.headers.get('content-type') || 'image/png';
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    if (req.query.download === '1') {
      const filename = req.query.filename || 'download.jpg';
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }
    return res.status(200).send(buffer);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ ok: false, error: message });
  }
});

app.post('/api/sheet-proxy', async (req, res) => {
  try {
    const payload = req.body ?? {};
    const upstream = await fetch(SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });

    const raw = await upstream.text();
    try {
      const parsed = JSON.parse(raw);
      return res.status(upstream.ok ? 200 : 502).json(parsed);
    } catch {
      return res.status(upstream.ok ? 200 : 502).json({
        status: upstream.ok ? 'success' : 'error',
        message: raw || (upstream.ok ? 'Request completed' : 'Upstream webhook error'),
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ status: 'error', message });
  }
});

app.get('/api/download-page', async (req, res) => {
  const { default: handler } = await import('./api/download-page.js');
  handler({ query: req.query, headers: req.headers }, res);
});

if (process.env.SERVE_DIST === 'true') {
  app.use(express.static(DIST_DIR));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
