import Replicate from 'replicate';

export function getReplicateClient() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error('Missing REPLICATE_API_TOKEN. Set it in local .env or in Vercel Environment Variables.');
  }
  return new Replicate({ auth: token });
}

export function normalizeOutputToUrl(output) {
  if (!output) return null;

  if (typeof output === 'string') {
    return output;
  }

  if (Array.isArray(output)) {
    for (const item of output) {
      const candidate = normalizeOutputToUrl(item);
      if (candidate) return candidate;
    }
    return null;
  }

  if (typeof output.url === 'function') {
    const value = output.url();
    if (typeof value === 'string' && value.length > 0) return value;
    if (value instanceof URL) return value.toString();
  }

  if (typeof output.url === 'string' && output.url.length > 0) return output.url;
  if (typeof output.href === 'string' && output.href.length > 0) return output.href;

  if (Array.isArray(output.urls)) {
    for (const item of output.urls) {
      if (typeof item === 'string' && item.length > 0) return item;
    }
  }

  if (typeof output.toString === 'function') {
    const value = output.toString();
    if (typeof value === 'string' && /^https?:\/\//.test(value)) return value;
  }

  return null;
}
