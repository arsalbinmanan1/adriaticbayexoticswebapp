import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate limiting to prevent brute force
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const rateLimitResult = await rateLimit(`login:${ip}`, RateLimitPresets.login)

    if (!rateLimitResult.success) {
      return NextResponse.json({
        error: 'Too many login attempts. Please try again in 15 minutes.',
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
      }, { status: 429 })
    }

    const { username, password } = await request.json();
    const success = await login(username, password);

    if (success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
