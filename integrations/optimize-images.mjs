import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// The site's photos are large originals (some over 2 MB). After the build this turns every photo in
// /images into a smaller WebP and updates the links.
const MAX_WIDTH = 1000;
const QUALITY = 64;
const MIN_BYTES = 30 * 1024;
// Widths that differ from the default: the desktop banner fills the screen, the others are small
const WIDTHS = {
  'hero-banner-desktop': 1800,
  'hero-banner-mobile': 800,
  'logo-full': 400,
  'logo-full-cream': 400,
  'assistant-1': 560,
  'assistant-2': 560,
  'assistant-3': 560,
  'assistant-4': 560,
  'assistant-5': 560,
};

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return files.flat();
};

export async function optimizeImages(root) {
  const files = await walk(root);
  // Social networks need a full address and a plain JPG, so the banner keeps one copy for link previews
  await sharp(path.join(root, 'images', 'hero-banner-desktop.jpg'))
    .resize({ width: 1200 })
    .jpeg({ quality: 78 })
    .toFile(path.join(root, 'og-image.jpg'));

  const photos = files.filter((f) => f.split(path.sep).includes('images') && !/favicon/.test(f) && /\.(png|jpe?g)$/i.test(f));
  const renamed = new Map();
  let before = 0;
  let after = 0;

  for (const file of photos) {
    const { size } = await stat(file);
    if (size < MIN_BYTES) continue;
    const webp = file.replace(/\.(png|jpe?g)$/i, '.webp');
    const output = await sharp(file)
      .rotate()
      .resize({ width: WIDTHS[path.basename(file).split('.')[0]] ?? MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toBuffer();
    if (output.length >= size) continue;
    await writeFile(webp, output);
    await rm(file);
    renamed.set(path.basename(file), path.basename(webp));
    before += size;
    after += output.length;
  }

  if (renamed.size > 0) {
    const pattern = new RegExp([...renamed.keys()].map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
    const texts = files.filter((f) => /\.(html|js|css)$/i.test(f));
    await Promise.all(
      texts.map(async (file) => {
        const text = await readFile(file, 'utf8');
        const next = text.replace(pattern, (name) => renamed.get(name));
        if (next !== text) await writeFile(file, next);
      }),
    );
  }

  return { count: renamed.size, before, after };
}

export default function optimizeImagesIntegration() {
  return {
    name: 'optimize-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const { count, before, after } = await optimizeImages(fileURLToPath(dir));
        const mb = (bytes) => (bytes / 1048576).toFixed(1);
        logger.info(`${count} images: ${mb(before)} MB -> ${mb(after)} MB`);
      },
    },
  };
}
