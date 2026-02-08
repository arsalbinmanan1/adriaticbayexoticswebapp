import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";

/**
 * GET /api/admin/promo-codes
 */
export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createAdminClient();
    const { data, error } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

/**
 * POST /api/admin/promo-codes
 */
export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.code || !body.discount_type || !body.discount_value) {
            return NextResponse.json({ error: "Missing required fields: code, discount_type, discount_value" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Convert date strings to ISO timestamps
        let startsAt = body.starts_at;
        if (startsAt && typeof startsAt === 'string') {
            // If it's a date string (YYYY-MM-DD), convert to ISO timestamp
            if (startsAt.match(/^\d{4}-\d{2}-\d{2}$/)) {
                startsAt = new Date(startsAt + 'T00:00:00.000Z').toISOString();
            }
        } else {
            startsAt = new Date().toISOString();
        }

        let expiresAt = body.expires_at || null;
        if (expiresAt && typeof expiresAt === 'string' && expiresAt.trim() !== '') {
            // If it's a date string (YYYY-MM-DD), convert to ISO timestamp
            if (expiresAt.match(/^\d{4}-\d{2}-\d{2}$/)) {
                expiresAt = new Date(expiresAt + 'T23:59:59.999Z').toISOString();
            }
        } else {
            expiresAt = null;
        }

        const { data, error } = await supabase
            .from("promo_codes")
            .insert({
                code: body.code.toUpperCase().trim(),
                description: body.description || null,
                discount_type: body.discount_type,
                discount_value: parseFloat(body.discount_value),
                starts_at: startsAt,
                expires_at: expiresAt,
                max_uses: body.max_uses && body.max_uses !== '' ? parseInt(body.max_uses, 10) : null,
                used_count: 0,
                min_booking_amount: body.min_booking_amount && body.min_booking_amount !== '' ? parseFloat(body.min_booking_amount) : 0,
                campaign_source: body.campaign_source && body.campaign_source.trim() !== '' ? body.campaign_source.trim() : null,
                applicable_car_categories: body.applicable_car_categories || [],
                status: body.status || 'active',
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error creating promo code:", error);
        return NextResponse.json({ error: error.message || "Failed to create promo code" }, { status: 500 });
    }
}
