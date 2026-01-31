import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error('FATAL: JWT_SECRET environment variable is required. Please set it in your .env.local file.');
}
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, any>) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("4h")
        .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, any>> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function login(email: string, password: string) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();

    // Fetch admin user from database
    const { data: adminUser, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !adminUser) {
        console.error('[Login] Admin user not found:', error);
        return false;
    }

    // Compare password with bcrypt hash
    const bcrypt = await import("bcryptjs");
    const isMatch = await bcrypt.compare(password, adminUser.password_hash);

    if (isMatch) {
        // Update last login timestamp
        await supabase
            .from('admins')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', adminUser.id);

        // Create the session
        const expires = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours
        const session = await encrypt({
            user: adminUser.email,
            userId: adminUser.id,
            expires
        });

        // Save the session in a cookie
        const cookieStore = await cookies();
        cookieStore.set("admin_session", session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return true;
    }

    return false;
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "", { expires: new Date(0), path: "/" });
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("admin_session")?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 4 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: "admin_session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}
