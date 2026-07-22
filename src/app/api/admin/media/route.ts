import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { readdir, unlink, stat } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("dsdc_session")?.value;
  if (!sessionCookie) return null;
  const session = await verifyToken(sessionCookie);
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

/* ── GET list all uploaded images ────────────────────────── */

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50")));

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    let files: string[] = [];
    try {
      files = await readdir(uploadsDir);
    } catch {
      // Directory doesn't exist yet
      return NextResponse.json({ images: [], pagination: { page: 1, limit, total: 0, totalPages: 0 } });
    }

    // Filter to image files only and get stats
    const imageExts = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]);
    const imageFiles = files.filter((f) => imageExts.has(path.extname(f).toLowerCase()));

    // Sort by most recent first (using mtime)
    const withStats = await Promise.all(
      imageFiles.map(async (filename) => {
        try {
          const s = await stat(path.join(uploadsDir, filename));
          return { filename, mtime: s.mtime, size: s.size };
        } catch {
          return { filename, mtime: new Date(0), size: 0 };
        }
      })
    );

    withStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    const total = withStats.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginated = withStats.slice(skip, skip + limit);

    const images = paginated.map((f) => ({
      url: `/uploads/${f.filename}`,
      filename: f.filename,
      size: f.size,
      uploadedAt: f.mtime.toISOString(),
    }));

    return NextResponse.json({
      images,
      pagination: { page, limit, total, totalPages },
    });
  } catch {
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
  }
}

/* ── DELETE image by filename ────────────────────────────── */

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { filename } = body;

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // Prevent path traversal
    if (filename.includes("..") || filename.includes("/")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    try {
      await unlink(filePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
