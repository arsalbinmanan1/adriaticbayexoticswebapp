import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";

/**
 * PATCH /api/admin/cars/[id]
 * Update an existing car
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from("cars")
            .update({
                make: body.make,
                model: body.model,
                year: body.year,
                vin: body.vin,
                license_plate: body.license_plate,
                category: body.category,
                slug: body.slug,
                description: body.description,
                exterior_color: body.exterior_color,
                interior_color: body.interior_color,
                daily_rate: body.daily_rate,
                four_hour_rate: body.four_hour_rate,
                weekly_rate: body.weekly_rate,
                monthly_rate: body.monthly_rate,
                security_deposit: body.security_deposit,
                status: body.status,
                current_location: body.current_location,
                images: body.images,
                features: body.features,
                specifications: body.specifications,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[Update Car Error]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/cars/[id]
 * Soft delete a car
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const supabase = createAdminClient();

        const { error } = await supabase
            .from("cars")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[Delete Car Error]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
