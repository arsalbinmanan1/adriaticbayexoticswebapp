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
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from("promo_codes")
            .insert({
                code: body.code.toUpperCase(),
                description: body.description || "",
                discount_type: body.discount_type,
                discount_value: body.discount_value,
                starts_at: body.starts_at || new Date().toISOString(),
                expires_at: body.expires_at || null,
                max_uses: body.max_uses || null,
                used_count: 0,
                min_booking_amount: body.min_booking_amount || 0,
                campaign_source: body.campaign_source || null,
                applicable_car_categories: body.applicable_car_categories || [],
                status: body.status || 'active',
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
