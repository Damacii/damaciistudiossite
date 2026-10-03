import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "damacii_admin";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 24 * 7;

function equalHex(a: string, b: string) {
  try {
    const left = Buffer.from(a, "hex");
    const right = Buffer.from(b, "hex");
    return left.length === right.length && timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

export function adminCredentialsConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function validAdminPassword(password: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest("hex");
  return equalHex(digest(password), digest(configured));
}

export function makeAdminToken() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Admin session secret is missing.");
  const expires = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS);
  const signature = createHmac("sha256", secret).update(expires).digest("hex");
  return `${expires}.${signature}`;
}

export function isAdmin(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!secret || !token) return false;
  const [expires, signature, extra] = token.split(".");
  if (extra || !expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return false;
  const expected = createHmac("sha256", secret).update(expires).digest("hex");
  return equalHex(signature, expected);
}
