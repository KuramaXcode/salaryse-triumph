const FALLBACK_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbzhl0hN5wQbw0e9Lm3vm12n2M3onomtL-iAIIG-TXcBnWH7bL13cNbbQwguYcTNSq_E/exec';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

function resolveWebhookUrl() {
  return process.env.SHEET_WEBHOOK_URL || process.env.GAS_WEBHOOK_URL || FALLBACK_WEBHOOK_URL;
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const webhookUrl = resolveWebhookUrl();
  const payload = parseBody(req.body);

  if (!webhookUrl) {
    return res.status(500).json({ status: 'error', message: 'Sheet webhook URL is not configured' });
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });

    const raw = await upstream.text();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }

    if (parsed && typeof parsed === 'object') {
      return res.status(upstream.ok ? 200 : 502).json(parsed);
    }

    return res.status(upstream.ok ? 200 : 502).json({
      status: upstream.ok ? 'success' : 'error',
      message: raw || (upstream.ok ? 'Request completed' : 'Upstream webhook error'),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ status: 'error', message });
  }
}
