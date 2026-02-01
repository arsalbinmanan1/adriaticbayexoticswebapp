import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { v4 as uuidv4 } from "uuid";

const PRIZES = [
    { text: "5% Off", weight: 40, discount: 5, type: "percentage" },
    { text: "10% Off", weight: 30, discount: 10, type: "percentage" },
    { text: "15% Off", weight: 20, discount: 15, type: "percentage" },
    { text: "20% Off", weight: 5, discount: 20, type: "percentage" },
    { text: "Try Again", weight: 5, discount: 0, type: "none" },
];

export async function POST(req: NextRequest) {
    try {
        const { fullName, phoneNumber, campaignSlug } = await req.json();

        if (!fullName || !phoneNumber || !campaignSlug) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // 1. Fetch campaign config
        const { data: campaign, error: campaignError } = await supabase
            .from("campaigns")
            .select("*")
            .eq("slug", campaignSlug)
            .eq("status", "active")
            .single();

        if (campaignError || !campaign) {
            return NextResponse.json({ error: "Campaign not found or inactive" }, { status: 404 });
        }

        // 2. Weighted Random Selection
        const totalWeight = PRIZES.reduce((acc, prize) => acc + prize.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedPrize = PRIZES[PRIZES.length - 1];

        for (const prize of PRIZES) {
            if (random < prize.weight) {
                selectedPrize = prize;
                break;
            }
            random -= prize.weight;
        }

        // 3. Generate Promo Code if it's a win
        let promoCode = null;
        if (selectedPrize.type !== "none") {
            const code = `SPIN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

            const { data: promo, error: promoError } = await supabase
                .from("promo_codes")
                .insert({
                    code,
                    discount_type: selectedPrize.type,
                    discount_value: selectedPrize.discount,
                    starts_at: new Date().toISOString(),
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days validity
                    max_uses: 1,
                    used_count: 0,
                    campaign_source: "spin_wheel",
                    status: "active",
                })
                .select()
                .single();

            if (promoError) throw promoError;
            promoCode = code;
        }

        // 4. Create Interaction & Lead
        const interactionId = uuidv4();
        await supabase.from("marketing_interactions").insert({
            id: interactionId,
            campaign_id: campaign.id,
            interaction_type: "spin",
            meta: {
                prize: selectedPrize.text,
                discount: selectedPrize.discount,
                promoCode: promoCode,
            },
        });

        await supabase.from("marketing_leads").insert({
            full_name: fullName,
            phone_number: phoneNumber,
            source: "spin_wheel",
            interaction_id: interactionId,
        });

        return NextResponse.json({
            success: true,
            prize: selectedPrize.text,
            discount: selectedPrize.discount,
            promoCode: promoCode,
        });
    } catch (error: any) {
        console.error("Spin API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
