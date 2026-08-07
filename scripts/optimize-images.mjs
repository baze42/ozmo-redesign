import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDirectory = "assets/images/optimized";
const images = [
  { name: "hero-growth-audit", widths: [560, 1122] },
  { name: "pain-points-workspace", widths: [640, 1200] },
  { name: "connected-systems", widths: [500, 1003] },
  { name: "audit-detail", widths: [640, 1200] }
];

await mkdir(outputDirectory, { recursive: true });

await Promise.all(images.flatMap(({ name, widths }) => {
  const input = `assets/images/${name}.png`;

  return widths.flatMap((width) => [
    sharp(input)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 55, effort: 6 })
      .toFile(path.join(outputDirectory, `${name}-${width}w.avif`)),
    sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 76, effort: 6 })
      .toFile(path.join(outputDirectory, `${name}-${width}w.webp`))
  ]);
}));

console.log(`Optimized ${images.length} source images into ${outputDirectory}.`);
