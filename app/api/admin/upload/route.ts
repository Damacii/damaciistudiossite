import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { heroStorageMode } from "@/lib/hero-project-store";

export const runtime = "nodejs";

const imageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Sign in to upload images." }, { status: 401 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  const extension = imageTypes[file.type];
  if (!extension) return NextResponse.json({ error: "Use a JPG, PNG, WebP, or AVIF image." }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Images must be 4 MB or smaller." }, { status: 400 });
  const name = `${randomUUID()}.${extension}`;
  const mode = heroStorageMode();
  if (mode === "unconfigured") return NextResponse.json({ error: "Connect a Vercel Blob store before uploading." }, { status: 503 });
  try {
    if (mode === "blob") {
      const blob = await put(`damacii/hero/${name}`, file, { access: "public", contentType: file.type, addRandomSuffix: false });
      return NextResponse.json({ imageUrl: blob.url });
    }
    const directory = path.join(process.cwd(), "public", "assets", "images", "hero");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ imageUrl: `/assets/images/hero/${name}` });
  } catch {
    return NextResponse.json({ error: "The image could not be uploaded." }, { status: 500 });
  }
}
