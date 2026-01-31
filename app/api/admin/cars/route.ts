import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";

/**
 * POST /api/admin/cars
 * Create a new car
 */
export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from("cars")
            .insert({
                make: body.make,
                model: body.model,
                year: body.year,
                vin: body.vin,
                license_plate: body.license_plate,
                category: body.category || "exotic",
                slug: body.slug,
                description: body.description || "",
                exterior_color: body.exterior_color || "",
                interior_color: body.interior_color || "",
                daily_rate: body.daily_rate,
                four_hour_rate: body.four_hour_rate || null,
                weekly_rate: body.weekly_rate || null,
                monthly_rate: body.monthly_rate || null,
                security_deposit: body.security_deposit,
                status: body.status || "available",
                current_location: body.current_location || "",
                images: body.images || [],
                features: body.features || [],
                specifications: body.specifications || {},
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[Create Car Error]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
