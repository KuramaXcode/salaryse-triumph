import { getReplicateClient, normalizeOutputToUrl } from './_lib/replicate.js';

async function fetchImageAsDataUrl(imageUrl) {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
  const contentType = response.headers.get('content-type') || 'image/png';
  const buffer = Buffer.from(await response.arrayBuffer());
  return `data:${contentType};base64,${buffer.toString('base64')}`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  res.setHeader('Cache-Control', 'no-store');

  const { id } = req.query;
  if (!id) return res.status(400).json({ ok: false, error: 'id is required' });

  try {
    const replicate = getReplicateClient();
    const prediction = await replicate.predictions.get(id);

    if (prediction.status === 'succeeded') {
      const imageUrl = normalizeOutputToUrl(prediction.output);
      let imageDataUrl = null;
      if (imageUrl) {
        try { imageDataUrl = await fetchImageAsDataUrl(imageUrl); } catch {}
      }
      return res.status(200).json({
        ok: true,
        status: 'succeeded',
        imageUrl,
        imageDataUrl,
        model: prediction.model,
      });
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      return res.status(200).json({
        ok: false,
        status: prediction.status,
        error: prediction.error || 'Prediction failed',
      });
    }

    // Still running (starting / processing)
    return res.status(200).json({ ok: true, status: prediction.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ ok: false, error: message });
  }
}
