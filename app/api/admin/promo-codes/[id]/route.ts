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

        // Convert date strings to ISO timestamps
        let startsAt = body.starts_at;
        if (startsAt && typeof startsAt === 'string') {
            // If it's a date string (YYYY-MM-DD), convert to ISO timestamp
            if (startsAt.match(/^\d{4}-\d{2}-\d{2}$/)) {
                startsAt = new Date(startsAt + 'T00:00:00.000Z').toISOString();
            }
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
            .update({
                code: body.code ? body.code.toUpperCase().trim() : undefined,
                description: body.description !== undefined ? (body.description || null) : undefined,
                discount_type: body.discount_type,
                discount_value: body.discount_value !== undefined ? parseFloat(body.discount_value) : undefined,
                starts_at: startsAt,
                expires_at: expiresAt,
                max_uses: body.max_uses !== undefined ? (body.max_uses && body.max_uses !== '' ? parseInt(body.max_uses, 10) : null) : undefined,
                min_booking_amount: body.min_booking_amount !== undefined ? (body.min_booking_amount && body.min_booking_amount !== '' ? parseFloat(body.min_booking_amount) : 0) : undefined,
                campaign_source: body.campaign_source !== undefined ? (body.campaign_source && body.campaign_source.trim() !== '' ? body.campaign_source.trim() : null) : undefined,
                applicable_car_categories: body.applicable_car_categories !== undefined ? (body.applicable_car_categories || []) : undefined,
                status: body.status,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error updating promo code:", error);
        return NextResponse.json({ error: error.message || "Failed to update promo code" }, { status: 500 });
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
