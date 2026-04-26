import https from 'https';

const FALLBACK_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxT0hIDHKvfMiVVNPqfB4ZwBl6E2v80uoEt4Ft7HymWIwxX9G1IT-tc6V3TwVKYgt_4/exec';

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

// GAS web apps work like this:
//   1. POST to exec → GAS runs doPost internally, generates a signed output URL
//   2. GAS returns 302 → script.googleusercontent.com/macros/echo?user_content_key=...
//   3. GET that URL to retrieve doPost's return value
// Re-POSTing to the redirect URL returns 405 (it's a read-only output endpoint).
// Node's native fetch converts POST→GET on 302 (loses the body), hitting doGet.
// Solution: use https.request — POST first, then GET the Location.
function httpsPostFollow(url, body) {
  return new Promise((resolve, reject) => {
    const bodyBuf = Buffer.from(body, 'utf8');
    const parsed = new URL(url);

    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': bodyBuf.length,
        },
      },
      (postRes) => {
        postRes.resume();
        if (postRes.statusCode >= 300 && postRes.statusCode < 400 && postRes.headers.location) {
          const outputUrl = postRes.headers.location;
          const outParsed = new URL(outputUrl);
          const getReq = https.request(
            { hostname: outParsed.hostname, path: outParsed.pathname + outParsed.search, method: 'GET' },
            (getRes) => {
              let data = '';
              getRes.on('data', (chunk) => { data += chunk; });
              getRes.on('end', () => resolve({ statusCode: getRes.statusCode, body: data }));
            },
          );
          getReq.on('error', reject);
          getReq.end();
        } else {
          let data = '';
          postRes.on('data', (chunk) => { data += chunk; });
          postRes.on('end', () => resolve({ statusCode: postRes.statusCode, body: data }));
        }
      },
    );
    req.on('error', reject);
    req.write(bodyBuf);
    req.end();
  });
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
    const upstream = await httpsPostFollow(webhookUrl, JSON.stringify(payload));

    const raw = upstream.body;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }

    const ok = upstream.statusCode >= 200 && upstream.statusCode < 300;

    if (parsed && typeof parsed === 'object') {
      return res.status(ok ? 200 : 502).json(parsed);
    }

    return res.status(ok ? 200 : 502).json({
      status: ok ? 'success' : 'error',
      message: raw || (ok ? 'Request completed' : 'Upstream webhook error'),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ status: 'error', message });
  }
}
