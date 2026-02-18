import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";

function sanitizeImageInput(img: any): string {
    if (!img) return ''
    let v = String(img).trim()
    v = v.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
    if (/^https?:\/\//i.test(v)) return v
    v = v.replace(/^\.\//, '').replace(/^public\//, '')
    if (!v.startsWith('/')) v = `/${v}`
    return v
}

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

        // Helper function to convert empty strings to null for numeric fields
        const parseNumeric = (value: any): number | null => {
            if (value === "" || value === null || value === undefined) return null;
            const num = typeof value === "string" ? parseFloat(value) : value;
            return isNaN(num) ? null : num;
        };

        // Helper function to convert empty strings to null for integer fields
        const parseIntValue = (value: any): number | null => {
            if (value === "" || value === null || value === undefined) return null;
            const num = typeof value === "string" ? parseInt(value, 10) : value;
            return isNaN(num) ? null : num;
        };

        const { data, error } = await supabase
            .from("cars")
            .update({
                make: body.make,
                model: body.model,
                year: parseIntValue(body.year),
                vin: body.vin,
                license_plate: body.license_plate,
                category: body.category || null,
                slug: body.slug || null,
                description: body.description || null,
                exterior_color: body.exterior_color || null,
                interior_color: body.interior_color || null,
                daily_rate: parseNumeric(body.daily_rate),
                four_hour_rate: parseNumeric(body.four_hour_rate),
                weekly_rate: parseNumeric(body.weekly_rate),
                monthly_rate: parseNumeric(body.monthly_rate),
                security_deposit: parseNumeric(body.security_deposit),
                status: body.status,
                current_location: body.current_location || null,
                images: (Array.isArray(body.images) ? body.images.map((i: any) => sanitizeImageInput(i)).filter(Boolean) : []),
                features: body.features || [],
                specifications: body.specifications || {},
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
