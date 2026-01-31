import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
    try {
        const supabase = createAdminClient();
        const now = new Date().toISOString();

        // Fetch active campaign that fits current date
        const { data: campaign, error } = await supabase
            .from("campaigns")
            .select("*")
            .eq("status", "active")
            .lte("start_date", now)
            .gte("end_date", now)
            .limit(1)
            .single();

        if (error || !campaign) {
            return NextResponse.json(null);
        }

        // Extract relevant data for the banner
        const promoCode = campaign.config?.promo || "VALENTINE2026";
        const bannerText = campaign.config?.theme?.banner || campaign.description;

        return NextResponse.json({
            name: campaign.name,
            endDate: campaign.end_date,
            promoCode: promoCode,
            bannerText: bannerText,
            theme: campaign.config?.theme || {
                primary: "#DC2626",
                accent: "#FFFFFF"
            }
        });
    } catch (error) {
        console.error("Active campaign API error:", error);
        return NextResponse.json(null);
    }
}
