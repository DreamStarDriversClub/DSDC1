#!/usr/bin/env node
/**
 * Optimize product images and brand assets to WebP format.
 * Run: bun run scripts/convert-images.mjs
 */

import sharp from "sharp";
import { readdir, stat, mkdir } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const WEBP_QUALITY = 80; // Good balance of quality vs size
const MIN_SIZE_BYTES = 100 * 1024; // Only convert files > 100KB

async function convertToWebp(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);
    const inputStat = await stat(inputPath);
    const outputStat = await stat(outputPath);
    const savings = ((1 - outputStat.size / inputStat.size) * 100).toFixed(1);
    console.log(`  ✅ ${basename(inputPath)} → ${basename(outputPath)} (${(inputStat.size / 1024).toFixed(0)}KB → ${(outputStat.size / 1024).toFixed(0)}KB, -${savings}%)`);
    return true;
  } catch (err) {
    console.error(`  ❌ Failed to convert ${inputPath}: ${err.message}`);
    return false;
  }
}

async function processDirectory(dirPath, outputDir) {
  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) continue;

    const ext = extname(entry.name).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const inputPath = join(dirPath, entry.name);
    const fileStat = await stat(inputPath);

    if (fileStat.size < MIN_SIZE_BYTES) {
      console.log(`  ⏭️  ${entry.name} (${(fileStat.size / 1024).toFixed(0)}KB) — too small, skipping`);
      continue;
    }

    const baseName = basename(entry.name, ext);
    await mkdir(outputDir, { recursive: true });
    const outputPath = join(outputDir, `${baseName}.webp`);
    await convertToWebp(inputPath, outputPath);
  }
}

async function main() {
  console.log("🔧 Dream Star Drivers Club — Image Optimizer\n");

  // 1. Product images (public/images/products/)
  console.log("📦 Product images:");
  await processDirectory(
    join(ROOT, "public", "images", "products"),
    join(ROOT, "public", "images", "products")
  );

  // 2. Large public images (root of public/)
  console.log("\n🖼️  Public images:");
  await processDirectory(join(ROOT, "public"), join(ROOT, "public"));

  // 3. Instagram images
  console.log("\n📸 Instagram images:");
  await processDirectory(
    join(ROOT, "public", "instagram"),
    join(ROOT, "public", "instagram")
  );

  // 4. Brand assets
  console.log("\n🎨 Brand assets:");
  await processDirectory(
    join(ROOT, "..", "brand-assets"),
    join(ROOT, "public", "brand-assets")
  );

  console.log("\n✅ Image optimization complete!");
  console.log(`   WebP quality: ${WEBP_QUALITY} | Min size threshold: ${(MIN_SIZE_BYTES / 1024).toFixed(0)}KB`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
