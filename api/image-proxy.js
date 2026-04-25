export default async function handler(req, res) {
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

    res.status(200).send(buffer);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, error: message });
  }
}
