import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
    try {
        const { code, carId, rentalDays } = await req.json();

        if (!code) {
            return NextResponse.json({ error: "Promo code is required" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // 1. Fetch promo code
        const { data: promo, error: promoError } = await supabase
            .from("promo_codes")
            .select("*")
            .eq("code", code.toUpperCase())
            .single();

        if (promoError || !promo) {
            return NextResponse.json({ valid: false, message: "Invalid promo code" });
        }

        // 2. Check status and dates
        const now = new Date();
        if (promo.status !== "active") {
            return NextResponse.json({ valid: false, message: "This promo code is no longer active" });
        }

        if (new Date(promo.start_date) > now) {
            return NextResponse.json({ valid: false, message: "This promo code is not active yet" });
        }

        if (new Date(promo.end_date) < now) {
            return NextResponse.json({ valid: false, message: "This promo code has expired" });
        }

        // 3. Check usage limits
        if (promo.max_uses && promo.times_used >= promo.max_uses) {
            return NextResponse.json({ valid: false, message: "This promo code has reached its usage limit" });
        }

        // 4. Check rental days requirement
        if (rentalDays && promo.min_rental_days && rentalDays < promo.min_rental_days) {
            return NextResponse.json({
                valid: false,
                message: `This promo code requires a minimum of ${promo.min_rental_days} rental days`
            });
        }

        // 5. Check car category restriction
        if (carId && promo.applicable_car_categories && promo.applicable_car_categories.length > 0) {
            const { data: car } = await supabase
                .from("cars")
                .select("category")
                .eq("id", carId)
                .single();

            if (car && !promo.applicable_car_categories.includes(car.category)) {
                return NextResponse.json({
                    valid: false,
                    message: "This promo code is not applicable to the selected car"
                });
            }
        }

        return NextResponse.json({
            valid: true,
            discount_type: promo.discount_type,
            discount_value: promo.discount_value,
            code: promo.code,
        });
    } catch (error: any) {
        console.error("Promo Validation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
