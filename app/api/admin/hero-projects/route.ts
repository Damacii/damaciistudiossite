import { type NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { parseHeroProjects } from "@/lib/hero-projects";
import { writeHeroProjects } from "@/lib/hero-project-store";

export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Sign in to save changes." }, { status: 401 });
  const body = await request.json().catch(() => null);
  let projects;
  try {
    projects = parseHeroProjects(body?.projects);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
  try {
    return NextResponse.json({ projects: await writeHeroProjects(projects) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Could not save hero projects." }, { status: 500 });
  }
}
