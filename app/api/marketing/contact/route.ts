import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phoneNumber, message } = await req.json();

    // Validation
    if (!fullName || !email || !phoneNumber || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Insert lead into marketing_leads table
    const { data, error } = await supabase
      .from("marketing_leads")
      .insert({
        full_name: fullName,
        email: email,
        phone_number: phoneNumber,
        source: "contact_form",
        meta: {
          message: message,
          submitted_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    console.log("[CONTACT FORM] New lead captured:", data.id);

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      leadId: data.id,
    });
  } catch (error: any) {
    console.error("[CONTACT FORM] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
