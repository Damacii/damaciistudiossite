import "server-only";

import { get, put } from "@vercel/blob";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { defaultHeroProjects, parseHeroProjects, type HeroProject } from "@/lib/hero-projects";

const blobPath = "damacii/hero-projects.json";
const localPath = path.join(process.cwd(), "data", "hero-projects.json");

export function heroStorageMode(): "blob" | "local" | "unconfigured" {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.VERCEL) return "unconfigured";
  return "local";
}

export async function readHeroProjects(): Promise<HeroProject[]> {
  const mode = heroStorageMode();
  if (mode === "blob") {
    const result = await get(blobPath, { access: "public", useCache: false });
    if (!result || result.statusCode !== 200) return defaultHeroProjects;
    return parseHeroProjects(await new Response(result.stream).json());
  }
  if (mode === "unconfigured") return defaultHeroProjects;
  try {
    return parseHeroProjects(JSON.parse(await readFile(localPath, "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return defaultHeroProjects;
    throw error;
  }
}

export async function writeHeroProjects(value: unknown): Promise<HeroProject[]> {
  const projects = parseHeroProjects(value);
  const mode = heroStorageMode();
  if (mode === "unconfigured") throw new Error("Connect a Vercel Blob store before saving on Vercel.");
  if (mode === "blob") {
    await put(blobPath, JSON.stringify(projects), {
      access: "public",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
  } else {
    await mkdir(path.dirname(localPath), { recursive: true });
    const tempPath = `${localPath}.${randomUUID()}.tmp`;
    await writeFile(tempPath, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
    await rename(tempPath, localPath);
  }
  return projects;
}
