import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import sharp from 'sharp';

const brandDir = join(process.cwd(), 'src/assets/brand');
const publicAssetsDir = join(process.cwd(), 'public/assets');
const outputDirs = [brandDir, publicAssetsDir];

const colors = {
  cleanSurface: '#FAFAF7',
  white: '#FFFFFF',
  deepInk: '#171923',
  mutedInk: '#4B5563',
  ozmoBlue: '#2B3F8F',
  ozmoOrange: '#F45B00',
  actionOrangeDark: '#B23A00',
  afterBlueSoft: '#EEF2FF',
  beforeGray: '#D8DDE7',
  lineGray: '#B7C0D0',
};

function markSvg(size = 96) {
  const center = size / 2;
  const radius = size * 0.36;
  const inner = size * 0.16;
  const barX = size * 0.78;

  return `
    <g aria-hidden="true">
      <circle cx="${center}" cy="${center}" r="${radius}" fill="${colors.ozmoBlue}" />
      <path d="M ${center} ${center} L ${center + radius} ${center} A ${radius} ${radius} 0 0 1 ${center - radius * 0.1} ${center + radius * 0.98} Z" fill="${colors.ozmoOrange}" />
      <circle cx="${center}" cy="${center}" r="${inner}" fill="currentColor" />
      <rect x="${barX}" y="${size * 0.04}" width="${size * 0.18}" height="${size * 0.74}" fill="${colors.ozmoOrange}" />
    </g>
  `;
}

function logoSvg({
  variant,
  compact = false,
}: {
  variant: 'dark' | 'light';
  compact?: boolean;
}) {
  const textColor = variant === 'light' ? colors.white : colors.ozmoBlue;
  const fillColor = variant === 'light' ? colors.deepInk : colors.white;
  const width = compact ? 280 : 620;
  const height = compact ? 280 : 180;
  const markSize = compact ? 132 : 142;
  const textX = compact ? 42 : 170;
  const ozmoY = compact ? 195 : 78;
  const digitalY = compact ? 245 : 142;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title">
  <title id="title">OZMO Digital</title>
  <rect width="100%" height="100%" fill="none"/>
  <g style="color: ${fillColor}">
    <g transform="translate(${compact ? 74 : 12}, ${compact ? 18 : 20})">${markSvg(markSize)}</g>
  </g>
  <g font-family="Sora, Arial Rounded MT Bold, Trebuchet MS, Arial, sans-serif" font-weight="700">
    <text x="${textX}" y="${ozmoY}" fill="${textColor}" font-size="${compact ? 68 : 96}" letter-spacing="0">ozmo</text>
    <text x="${textX}" y="${digitalY}" fill="${colors.ozmoOrange}" font-size="${compact ? 52 : 74}" letter-spacing="0">digital</text>
  </g>
</svg>`;
}

function ogSvg(title: string, kicker: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title">
  <title id="title">${title} | OZMO Digital</title>
  <rect width="1200" height="630" fill="${colors.cleanSurface}"/>
  <rect x="72" y="72" width="1056" height="486" rx="18" fill="${colors.white}" stroke="${colors.lineGray}" stroke-width="2"/>
  <g transform="translate(104, 105)">${markSvg(78)}</g>
  <text x="210" y="154" font-family="Sora, Arial, sans-serif" font-size="54" font-weight="700" fill="${colors.ozmoBlue}">ozmo</text>
  <text x="210" y="207" font-family="Sora, Arial, sans-serif" font-size="40" font-weight="700" fill="${colors.ozmoOrange}">digital</text>
  <text x="104" y="312" font-family="Sora, Arial, sans-serif" font-size="70" font-weight="700" fill="${colors.deepInk}">${title}</text>
  <text x="108" y="380" font-family="Source Sans 3, Arial, sans-serif" font-size="34" fill="${colors.mutedInk}">${kicker}</text>
  <g transform="translate(784 160)">
    <rect width="276" height="180" rx="12" fill="${colors.beforeGray}" stroke="${colors.lineGray}" />
    <text x="24" y="42" font-family="Source Sans 3, Arial, sans-serif" font-size="20" font-weight="600" fill="${colors.deepInk}">Before</text>
    <rect x="24" y="64" width="132" height="16" fill="${colors.lineGray}" />
    <rect x="24" y="94" width="214" height="12" fill="${colors.lineGray}" opacity="0.72" />
    <rect x="24" y="120" width="76" height="20" fill="${colors.lineGray}" opacity="0.72" />
  </g>
  <g transform="translate(828 296)">
    <rect width="276" height="180" rx="12" fill="${colors.afterBlueSoft}" stroke="${colors.ozmoBlue}" stroke-width="3" />
    <text x="24" y="42" font-family="Source Sans 3, Arial, sans-serif" font-size="20" font-weight="600" fill="${colors.ozmoBlue}">After</text>
    <rect x="24" y="64" width="184" height="18" fill="${colors.ozmoBlue}" />
    <rect x="24" y="96" width="218" height="12" fill="${colors.ozmoBlue}" opacity="0.42" />
    <rect x="24" y="126" width="132" height="30" rx="15" fill="${colors.actionOrangeDark}" />
  </g>
</svg>`;
}

async function writeSvg(name: string, svg: string) {
  await Promise.all(outputDirs.map((dir) => writeFile(join(dir, name), svg)));
}

async function writePng(name: string, svg: string, width: number, height = width) {
  await Promise.all(
    outputDirs.map((dir) =>
      sharp(Buffer.from(svg)).resize(width, height, { fit: 'contain' }).png().toFile(join(dir, name)),
    ),
  );
}

async function main() {
  await Promise.all(outputDirs.map((dir) => mkdir(dir, { recursive: true })));

  const darkLogo = logoSvg({ variant: 'dark' });
  const lightLogo = logoSvg({ variant: 'light' });
  const compactLogo = logoSvg({ variant: 'dark', compact: true });
  const compactLightLogo = logoSvg({ variant: 'light', compact: true });

  await writeSvg('ozmo-logo.svg', darkLogo);
  await writeSvg('ozmo-logo-dark.svg', darkLogo);
  await writeSvg('ozmo-logo-light.svg', lightLogo);
  await writeSvg('ozmo-logo-horizontal.svg', darkLogo);
  await writeSvg('ozmo-logo-compact.svg', compactLogo);
  await writeSvg('ozmo-logo-compact-light.svg', compactLightLogo);
  await writePng('ozmo-logo.png', darkLogo, 620, 180);

  await writePng('favicon-16.png', compactLogo, 16);
  await writePng('favicon-32.png', compactLogo, 32);
  await writePng('favicon-48.png', compactLogo, 48);
  await writePng('apple-touch-icon.png', compactLogo, 180);
  await writePng('android-chrome-192.png', compactLogo, 192);
  await writePng('android-chrome-512.png', compactLogo, 512);
  await writePng('maskable-icon-512.png', compactLogo, 512);

  const ogImages = [
    ['og-default.png', 'Fast, polished websites', 'Clearer paths from visitor attention to lead action.'],
    ['og-home.png', 'Transformation Engine', 'From slow or unclear to fast, structured, and lead-ready.'],
    ['og-site-review.png', 'Free Site Review', 'Practical next steps for a stronger website.'],
    ['og-services.png', 'Website services', 'Builds, redesigns, messaging, SEO, forms, and care.'],
    ['og-portfolio.png', 'Transformation examples', 'Honest before-and-after website improvement paths.'],
    ['og-blog.png', 'Website growth notes', 'Plainspoken guidance for speed, clarity, trust, and leads.'],
  ] as const;

  for (const [file, title, kicker] of ogImages) {
    await writePng(file, ogSvg(title, kicker), 1200, 630);
  }
}

await main();
