export default function handler(req, res) {
  const { card, avatar, name, house } = req.query;

  if (!card) {
    return res.status(400).send('Missing card parameter.');
  }

  const displayName = decodeURIComponent(name || 'SUBJECT').toUpperCase();
  const displayHouse = decodeURIComponent(house || '');
  const safeName = displayName.replace(/[^A-Z0-9]/g, '_');

  const cardDriveUrl = `https://drive.google.com/uc?export=view&id=${card}`;
  const avatarDriveUrl = avatar ? `https://drive.google.com/uc?export=view&id=${avatar}` : null;

  const origin = `https://${req.headers.host}`;

  const cardProxyUrl = `${origin}/api/image-proxy?url=${encodeURIComponent(cardDriveUrl)}`;
  const cardDownloadUrl = `${origin}/api/image-proxy?url=${encodeURIComponent(cardDriveUrl)}&download=1&filename=${safeName}_Card.jpg`;

  const avatarProxyUrl = avatarDriveUrl
    ? `${origin}/api/image-proxy?url=${encodeURIComponent(avatarDriveUrl)}`
    : null;
  const avatarDownloadUrl = avatarDriveUrl
    ? `${origin}/api/image-proxy?url=${encodeURIComponent(avatarDriveUrl)}&download=1&filename=${safeName}_Portrait.jpg`
    : null;

  const avatarSection = avatarProxyUrl ? `
    <div class="section">
      <p class="section-label">AI PORTRAIT</p>
      <div class="image-wrap">
        <img id="avatarImg" src="${avatarProxyUrl}" alt="AI Portrait" />
      </div>
      <a href="${avatarDownloadUrl}" class="btn btn-secondary" download="${safeName}_Portrait.jpg">
        ↓ &nbsp;Save AI Portrait
      </a>
      <p class="tip">On iPhone: tap &amp; hold the image → Save to Photos</p>
    </div>` : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <meta name="theme-color" content="#03060d" />
  <title>SalarySe Triumph — ${displayName}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #03060d;
      color: #e6edf3;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-height: 100vh;
      padding: 0 0 60px;
    }

    .header {
      text-align: center;
      padding: 36px 24px 28px;
      border-bottom: 1px solid rgba(255, 215, 0, 0.12);
      margin-bottom: 32px;
    }

    .logo {
      font-size: 0.65rem;
      letter-spacing: 5px;
      color: rgba(255, 215, 0, 0.5);
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .name {
      font-size: clamp(1.6rem, 6vw, 2.2rem);
      font-weight: 800;
      letter-spacing: 3px;
      color: #ffffff;
      margin-bottom: 8px;
    }

    .house {
      font-size: 0.8rem;
      color: #ffd700;
      letter-spacing: 4px;
      text-transform: uppercase;
    }

    .content {
      padding: 0 20px;
      max-width: 480px;
      margin: 0 auto;
    }

    .section {
      margin-bottom: 40px;
    }

    .section-label {
      font-size: 0.6rem;
      letter-spacing: 4px;
      color: rgba(255, 255, 255, 0.3);
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .image-wrap {
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(255, 215, 0, 0.2);
      margin-bottom: 14px;
      background: #0d1117;
      line-height: 0;
    }

    img {
      width: 100%;
      display: block;
    }

    .btn {
      display: block;
      width: 100%;
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 800;
      letter-spacing: 1px;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: opacity 0.15s;
    }

    .btn:active { opacity: 0.8; }

    .btn-primary {
      background: #ffd700;
      color: #000000;
    }

    .btn-secondary {
      background: transparent;
      color: #ffd700;
      border: 1px solid rgba(255, 215, 0, 0.5);
      margin-top: 10px;
    }

    .tip {
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.25);
      text-align: center;
      margin-top: 10px;
      line-height: 1.5;
    }

    .divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.05);
      margin: 8px 0 40px;
    }

    .footer {
      text-align: center;
      padding: 0 24px;
      margin-top: 40px;
      font-size: 0.6rem;
      color: rgba(255, 255, 255, 0.15);
      letter-spacing: 3px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>

  <div class="header">
    <p class="logo">✧ &nbsp;SalarySe Triumph</p>
    <h1 class="name">${displayName}</h1>
    ${displayHouse ? `<p class="house">${displayHouse}</p>` : ''}
  </div>

  <div class="content">

    <div class="section">
      <p class="section-label">Character Card</p>
      <div class="image-wrap">
        <img id="cardImg" src="${cardProxyUrl}" alt="Character Card" />
      </div>
      <a href="${cardDownloadUrl}" class="btn btn-primary" download="${safeName}_Card.jpg">
        ↓ &nbsp;Save Character Card
      </a>
      <p class="tip">On iPhone: tap &amp; hold the image → Save to Photos</p>
    </div>

    <div class="divider"></div>

    ${avatarSection}

  </div>

  <p class="footer">SalarySe Triumph &nbsp;·&nbsp; Financial Persona Sorting</p>

</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(html);
}
