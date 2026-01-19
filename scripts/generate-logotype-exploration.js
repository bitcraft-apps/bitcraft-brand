const TextToSVG = require('text-to-svg');
const fs = require('fs');
const path = require('path');

const fonts = [
  { name: 'Inter', file: 'Inter.ttf', style: 'Clean, neutral, highly legible' },
  { name: 'Outfit', file: 'Outfit.ttf', style: 'Modern geometric, friendly' },
  { name: 'Plus Jakarta Sans', file: 'PlusJakartaSans.ttf', style: 'Contemporary, professional' },
  { name: 'Manrope', file: 'Manrope.ttf', style: 'Geometric with character' },
  { name: 'Work Sans', file: 'WorkSans.ttf', style: 'Neutral, workhorse' },
  { name: 'Space Grotesk', file: 'SpaceGrotesk.ttf', style: 'Techy, distinctive' },
  { name: 'Sora', file: 'Sora.ttf', style: 'Modern, slightly rounded' },
  { name: 'DM Sans', file: 'DMSans.ttf', style: 'Clean geometric' },
  { name: 'Poppins', file: 'Poppins.ttf', style: 'Popular, geometric' },
  { name: 'Rubik', file: 'Rubik.ttf', style: 'Rounded, approachable' },
];

const fontsDir = path.join(__dirname, 'fonts');
const outputDir = path.join(__dirname, '..', 'logo', 'exploration');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Logomark SVG (the "B" - stacked bars)
const logomarkSVG = `
  <g fill="currentColor">
    <rect x="0" y="0" width="31.5" height="8.2" rx="4.1"/>
    <rect x="8.2" y="10.3" width="30.2" height="8.2" rx="4.1"/>
    <rect x="0" y="20.6" width="24.7" height="6.9" rx="3.4"/>
    <rect x="8.2" y="29.5" width="37" height="8.2" rx="4.1"/>
    <rect x="0" y="39.8" width="34.3" height="8.2" rx="4.1"/>
  </g>
`;

const results = [];

fonts.forEach((font, index) => {
  const fontPath = path.join(fontsDir, font.file);

  if (!fs.existsSync(fontPath)) {
    console.error(`Font not found: ${fontPath}`);
    return;
  }

  try {
    const textToSVG = TextToSVG.loadSync(fontPath);

    // Generate "itcraft" path - height 48 to match logomark
    const options = {
      x: 0,
      y: 0,
      fontSize: 48,
      anchor: 'left top',
      attributes: { fill: 'currentColor' }
    };

    const metrics = textToSVG.getMetrics('itcraft', options);
    const pathData = textToSVG.getD('itcraft', options);

    // Also generate full "Bitcraft" for comparison
    const fullMetrics = textToSVG.getMetrics('Bitcraft', options);
    const fullPathData = textToSVG.getD('Bitcraft', options);

    results.push({
      ...font,
      index: index + 1,
      itcraftPath: pathData,
      itcraftWidth: metrics.width,
      itcraftHeight: metrics.height,
      fullPath: fullPathData,
      fullWidth: fullMetrics.width,
      fullHeight: fullMetrics.height,
    });

    console.log(`Generated: ${font.name} (itcraft: ${Math.round(metrics.width)}x${Math.round(metrics.height)})`);

  } catch (err) {
    console.error(`Error processing ${font.name}:`, err.message);
  }
});

// Generate HTML preview page
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bitcraft Logotype Exploration</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #1a1a1a;
      color: #fff;
      padding: 40px;
      line-height: 1.6;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .subtitle {
      color: #6B8E23;
      margin-bottom: 40px;
      font-size: 1rem;
    }
    .section-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #6B8E23;
      margin: 48px 0 24px;
      font-weight: 600;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    .card {
      background: #2a2a2a;
      border-radius: 12px;
      padding: 32px;
      position: relative;
    }
    .card-dark { background: #1a1a1a; border: 1px solid #333; }
    .card-light { background: #ffffff; color: #1a1a1a; }
    .card-number {
      position: absolute;
      top: 16px;
      right: 16px;
      background: #6B8E23;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .font-name {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .font-style {
      font-size: 0.75rem;
      color: #888;
      margin-bottom: 24px;
    }
    .card-light .font-style { color: #666; }
    .lockup {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-bottom: 16px;
    }
    .lockup svg {
      height: 48px;
      width: auto;
    }
    .lockup-label {
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #666;
      margin-top: 8px;
    }
    .card-light .lockup-label { color: #999; }
    .comparison {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #333;
    }
    .card-light .comparison { border-top-color: #e0e0e0; }
    .comparison-label {
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #666;
      margin-bottom: 12px;
    }
    .full-wordmark svg {
      height: 36px;
      width: auto;
    }
    .divider {
      height: 1px;
      background: #333;
      margin: 48px 0;
    }
    .notes {
      background: #2a2a2a;
      border-radius: 12px;
      padding: 24px;
      margin-top: 48px;
    }
    .notes h3 {
      font-size: 1rem;
      margin-bottom: 12px;
    }
    .notes ul {
      padding-left: 20px;
      color: #aaa;
      font-size: 0.875rem;
    }
    .notes li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <h1>Bitcraft Logotype Exploration</h1>
  <p class="subtitle">Logomark as "B" + "itcraft" in various fonts</p>

  <p class="section-title">Option A: Logomark + itcraft (Recommended Approach)</p>
  <div class="grid">
${results.map(r => `
    <div class="card card-dark">
      <span class="card-number">${r.index}</span>
      <p class="font-name">${r.name}</p>
      <p class="font-style">${r.style}</p>
      <div class="lockup">
        <svg viewBox="0 0 45.2 48" style="color: #6B8E23;">
          ${logomarkSVG}
        </svg>
        <svg viewBox="0 0 ${Math.ceil(r.itcraftWidth)} ${Math.ceil(r.itcraftHeight)}" style="color: #ffffff;">
          <path d="${r.itcraftPath}" fill="currentColor"/>
        </svg>
      </div>
      <p class="lockup-label">Dark background</p>
    </div>
    <div class="card card-light">
      <span class="card-number">${r.index}</span>
      <p class="font-name">${r.name}</p>
      <p class="font-style">${r.style}</p>
      <div class="lockup">
        <svg viewBox="0 0 45.2 48" style="color: #556B2F;">
          ${logomarkSVG}
        </svg>
        <svg viewBox="0 0 ${Math.ceil(r.itcraftWidth)} ${Math.ceil(r.itcraftHeight)}" style="color: #556B2F;">
          <path d="${r.itcraftPath}" fill="currentColor"/>
        </svg>
      </div>
      <p class="lockup-label">Light background</p>
    </div>
`).join('')}
  </div>

  <div class="divider"></div>

  <p class="section-title">Option B: Full "Bitcraft" Wordmark (For Comparison)</p>
  <div class="grid">
${results.map(r => `
    <div class="card card-dark">
      <span class="card-number">${r.index}</span>
      <p class="font-name">${r.name}</p>
      <p class="font-style">${r.style}</p>
      <div class="full-wordmark">
        <svg viewBox="0 0 ${Math.ceil(r.fullWidth)} ${Math.ceil(r.fullHeight)}" style="color: #ffffff;">
          <path d="${r.fullPath}" fill="currentColor"/>
        </svg>
      </div>
      <p class="lockup-label">Full wordmark</p>
    </div>
    <div class="card card-light">
      <span class="card-number">${r.index}</span>
      <p class="font-name">${r.name}</p>
      <p class="font-style">${r.style}</p>
      <div class="full-wordmark">
        <svg viewBox="0 0 ${Math.ceil(r.fullWidth)} ${Math.ceil(r.fullHeight)}" style="color: #556B2F;">
          <path d="${r.fullPath}" fill="currentColor"/>
        </svg>
      </div>
      <p class="lockup-label">Full wordmark</p>
    </div>
`).join('')}
  </div>

  <div class="notes">
    <h3>Notes</h3>
    <ul>
      <li><strong>Option A (Recommended):</strong> Uses the logomark as the "B", creating visual unity between mark and wordmark</li>
      <li><strong>Option B:</strong> Traditional full wordmark approach for comparison</li>
      <li>All text is converted to SVG paths - no font dependency</li>
      <li>Font weight: SemiBold (600) where available, Regular for variable fonts</li>
      <li>Consider: letter-spacing adjustments, vertical alignment fine-tuning</li>
    </ul>
  </div>

</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'logotype-exploration.html'), html);
console.log(`\nGenerated: logo/exploration/logotype-exploration.html`);
console.log(`Open in browser to compare ${results.length} font options`);
