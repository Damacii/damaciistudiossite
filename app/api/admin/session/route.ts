import { type NextRequest, NextResponse } from "next/server";
import { adminCredentialsConfigured, isAdmin } from "@/lib/admin-auth";
import { heroStorageMode } from "@/lib/hero-project-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAdmin(request),
    configured: adminCredentialsConfigured(),
    storageMode: heroStorageMode(),
  }, { headers: { "Cache-Control": "no-store" } });
}
