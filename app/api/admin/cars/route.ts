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
            .insert({
                make: body.make,
                model: body.model,
                year: parseIntValue(body.year),
                vin: body.vin,
                license_plate: body.license_plate,
                category: body.category || "exotic",
                slug: body.slug || null,
                description: body.description || null,
                exterior_color: body.exterior_color || null,
                interior_color: body.interior_color || null,
                daily_rate: parseNumeric(body.daily_rate),
                four_hour_rate: parseNumeric(body.four_hour_rate),
                weekly_rate: parseNumeric(body.weekly_rate),
                monthly_rate: parseNumeric(body.monthly_rate),
                security_deposit: parseNumeric(body.security_deposit),
                status: body.status || "available",
                current_location: body.current_location || null,
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
