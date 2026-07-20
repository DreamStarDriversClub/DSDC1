"use server";

import { revalidatePath } from "next/cache";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

const INSTAGRAM_DIR = join(process.cwd(), "public", "instagram");

async function ensureDir() {
  try {
    await mkdir(INSTAGRAM_DIR, { recursive: true });
  } catch {
    // directory already exists
  }
}

function extFromFilename(filename: string): string {
  const idx = filename.lastIndexOf(".");
  if (idx === -1) return ".jpg";
  return filename.slice(idx).toLowerCase();
}

export async function createPost(formData: FormData) {
  await ensureDir();

  const image = formData.get("image") as File | null;
  const caption = (formData.get("caption") as string) || null;
  const link = (formData.get("link") as string) || null;

  if (!image || image.size === 0) {
    return { error: "Image is required." };
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(image.type)) {
    return { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF." };
  }

  const ext = extFromFilename(image.name);
  const filename = `ig-${randomUUID()}${ext}`;
  const filePath = join(INSTAGRAM_DIR, filename);

  const buffer = Buffer.from(await image.arrayBuffer());
  await writeFile(filePath, buffer);

  const imageUrl = `/instagram/${filename}`;

  await prisma.instagramPost.create({
    data: {
      imageUrl,
      caption: caption || null,
      link: link || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/instagram");

  return { success: true };
}

export async function deletePost(id: string) {
  const post = await prisma.instagramPost.findUnique({ where: { id } });
  if (!post) {
    return { error: "Post not found." };
  }

  // Delete the file from disk
  const filename = post.imageUrl.replace("/instagram/", "");
  const filePath = join(INSTAGRAM_DIR, filename);
  try {
    await unlink(filePath);
  } catch {
    // File might already be gone — that's ok
  }

  await prisma.instagramPost.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/instagram");

  return { success: true };
}
