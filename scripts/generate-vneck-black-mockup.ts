/**
 * Generates a black-shirt version of the "DS V0 V-Neck T-Shirt" thumbnail.
 *
 * WHY THIS EXISTS
 * --------------
 * Printful auto-generates the store product thumbnail on a light grey shirt:
 *   https://files.cdn.printful.com/files/5d8/5d80fb4c596a556a050f36a4365d4cca_preview.png
 * The Dream Star site wants a BLACK shirt on the product card and detail page
 * for this product (PrintfulProduct id 448664054).
 *
 * IMPORTANT: Printful's sync scripts (scripts/sync-printful.ts and
 * src/lib/printful.ts) overwrite PrintfulProduct.thumbnailUrl with Printful's
 * own value on every sync. After any re-sync, re-run this script and point the
 * DB row back at the generated file:
 *
 *   bun scripts/generate-vneck-black-mockup.ts
 *   # then update the DB row:
 *   #   UPDATE "PrintfulProduct" SET "thumbnailUrl" =
 *   #     '/images/products/ds-v0-vneck-black-mockup.png'
 *   #   WHERE id = 448664054;
 *
 * HOW IT WORKS
 * ------------
 * The Printful preview is a light-grey shirt (RGB ~240-245) with a small gold
 * embroidered emblem, on a white background. This script keeps the white
 * background and the gold design exactly as-is, and remaps the shirt's
 * luminance into a near-black charcoal range so the shirt reads as black
 * while keeping its shading.
 */
import sharp from "sharp";

const SOURCE_URL =
  process.argv[2] ??
  "https://files.cdn.printful.com/files/5d8/5d80fb4c596a556a050f36a4365d4cca_preview.png";
const OUT_PATH = "public/images/products/ds-v0-vneck-black-mockup.png";

const res = await fetch(SOURCE_URL);
if (!res.ok) throw new Error(`Failed to download source image: ${res.status}`);
const src = Buffer.from(await res.arrayBuffer());

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const out = Buffer.alloc(data.length);
let shirtPx = 0;
let designPx = 0;
let bgPx = 0;

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const sat = mx - mn;
  const lum = (r + g + b) / 3;

  if (a < 250) {
    // Fully transparent — leave as-is (source thumbnails are opaque, but be safe)
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = a;
    continue;
  }

  let or: number, og: number, ob: number;
  if (sat >= 22) {
    // Saturated pixels = the gold embroidered design — keep original color
    or = r;
    og = g;
    ob = b;
    designPx++;
  } else if (lum >= 250) {
    // Near-white background — keep white
    or = 255;
    og = 255;
    ob = 255;
    bgPx++;
  } else {
    // Shirt pixels — remap luminance to near-black charcoal (18..28)
    const dark = Math.round(18 + Math.min(1, Math.max(0, (lum - 220) / 32)) * 10);
    or = dark;
    og = dark;
    ob = dark;
    shirtPx++;
  }
  out[i] = or;
  out[i + 1] = og;
  out[i + 2] = ob;
  out[i + 3] = 255;
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(OUT_PATH);
console.log(`Wrote ${OUT_PATH} (${width}x${height})`);
console.log(
  `Pixels -> shirt: ${shirtPx}, design: ${designPx}, background: ${bgPx}`
);
