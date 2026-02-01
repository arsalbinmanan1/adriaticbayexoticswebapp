import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";

/**
 * PATCH /api/admin/promo-codes/[id]
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        const body = await request.json();
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from("promo_codes")
            .update({
                code: body.code.toUpperCase(),
                description: body.description,
                discount_type: body.discount_type,
                discount_value: body.discount_value,
                starts_at: body.starts_at,
                expires_at: body.expires_at || null,
                max_uses: body.max_uses || null,
                min_booking_amount: body.min_booking_amount || 0,
                campaign_source: body.campaign_source,
                applicable_car_categories: body.applicable_car_categories || [],
                status: body.status,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/promo-codes/[id]
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        const supabase = createAdminClient();

        const { error } = await supabase
            .from("promo_codes")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
