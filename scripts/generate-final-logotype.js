const TextToSVG = require('text-to-svg');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, 'fonts', 'Poppins.ttf');
const outputDir = path.join(__dirname, '..', 'logo');

const textToSVG = TextToSVG.loadSync(fontPath);

// Generate "itcraft" path
const fontSize = 48;
const options = {
  x: 0,
  y: 0,
  fontSize: fontSize,
  anchor: 'left top',
};

const itcraftPath = textToSVG.getD('itcraft', options);
const itcraftMetrics = textToSVG.getMetrics('itcraft', options);

// Logomark dimensions (scaled to match text height)
const logomarkHeight = 48;
const logomarkWidth = 45.2;
const gap = 2; // tight spacing

// Logomark SVG content (the "B")
const logomarkPaths = `
    <rect x="0" y="0" width="31.5" height="8.2" rx="4.1"/>
    <rect x="8.2" y="10.3" width="30.2" height="8.2" rx="4.1"/>
    <rect x="0" y="20.6" width="24.7" height="6.9" rx="3.4"/>
    <rect x="8.2" y="29.5" width="37" height="8.2" rx="4.1"/>
    <rect x="0" y="39.8" width="34.3" height="8.2" rx="4.1"/>`;

// Calculate dimensions
const textOffsetX = logomarkWidth + gap;
const totalWidth = Math.ceil(textOffsetX + itcraftMetrics.width);
const totalHeight = Math.ceil(Math.max(logomarkHeight, itcraftMetrics.height));

// Vertical alignment - center the text with logomark
const textOffsetY = (logomarkHeight - itcraftMetrics.height) / 2;

const colors = [
  { name: '', fill: '#556B2F', desc: 'Dark Olive' },
  { name: '-white', fill: '#FFFFFF', desc: 'White (for dark backgrounds)' },
  { name: '-black', fill: '#000000', desc: 'Black (for light backgrounds)' },
];

// Generate horizontal lockup SVGs (logomark B + itcraft)
colors.forEach(color => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
  <!--
    Bitcraft Lockup Horizontal - ${color.desc}
    https://github.com/bitcraft-apps/brand
    Logomark + "itcraft" in Poppins SemiBold
  -->
  <g fill="${color.fill}">
    <!-- Logomark (B) -->
    <g>${logomarkPaths}
    </g>
    <!-- itcraft text -->
    <g transform="translate(${textOffsetX}, ${textOffsetY})">
      <path d="${itcraftPath}"/>
    </g>
  </g>
</svg>`;

  const filename = `bitcraft-lockup-horizontal${color.name}.svg`;
  fs.writeFileSync(path.join(outputDir, filename), svg);
  console.log(`Created: ${filename}`);
});

// Generate vertical lockup SVGs (logomark stacked above text)
const verticalGap = 16;
const verticalTotalHeight = logomarkHeight + verticalGap + Math.ceil(itcraftMetrics.height);
const verticalTotalWidth = Math.max(logomarkWidth + 8.2, Math.ceil(itcraftMetrics.width)); // account for logomark offset
const logomarkCenterX = (verticalTotalWidth - (logomarkWidth)) / 2;
const textCenterX = (verticalTotalWidth - itcraftMetrics.width) / 2;

colors.forEach(color => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(verticalTotalWidth)} ${verticalTotalHeight}" width="${Math.ceil(verticalTotalWidth)}" height="${verticalTotalHeight}">
  <!--
    Bitcraft Lockup Vertical - ${color.desc}
    https://github.com/bitcraft-apps/brand
    Logomark stacked above "itcraft" in Poppins SemiBold
  -->
  <g fill="${color.fill}">
    <!-- Logomark (B) -->
    <g transform="translate(${logomarkCenterX}, 0)">${logomarkPaths}
    </g>
    <!-- itcraft text -->
    <g transform="translate(${textCenterX}, ${logomarkHeight + verticalGap})">
      <path d="${itcraftPath}"/>
    </g>
  </g>
</svg>`;

  const filename = `bitcraft-lockup-vertical${color.name}.svg`;
  fs.writeFileSync(path.join(outputDir, filename), svg);
  console.log(`Created: ${filename}`);
});

// Generate logotype-only SVGs (just "itcraft" - for use cases where B logomark is separate)
// Actually, let's generate "Bitcraft" full wordmark too for comparison
const fullPath = textToSVG.getD('Bitcraft', options);
const fullMetrics = textToSVG.getMetrics('Bitcraft', options);

colors.forEach(color => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(fullMetrics.width)} ${Math.ceil(fullMetrics.height)}" width="${Math.ceil(fullMetrics.width)}" height="${Math.ceil(fullMetrics.height)}">
  <!--
    Bitcraft Logotype - ${color.desc}
    https://github.com/bitcraft-apps/brand
    "Bitcraft" in Poppins SemiBold (text converted to paths)
  -->
  <path fill="${color.fill}" d="${fullPath}"/>
</svg>`;

  const filename = `bitcraft-logotype${color.name}.svg`;
  fs.writeFileSync(path.join(outputDir, filename), svg);
  console.log(`Created: ${filename}`);
});

console.log('\n✓ All SVG files generated successfully!');
console.log(`\nFiles created in: ${outputDir}`);
console.log('\nHorizontal lockup: logomark "B" + "itcraft"');
console.log('Vertical lockup: logomark stacked above "itcraft"');
console.log('Logotype: full "Bitcraft" wordmark');
