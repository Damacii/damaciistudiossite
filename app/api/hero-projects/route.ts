import { NextResponse } from "next/server";
import { readHeroProjects } from "@/lib/hero-project-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json({ projects: await readHeroProjects() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Hero projects are temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
