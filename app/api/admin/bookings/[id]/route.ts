import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";

/**
 * DELETE /api/admin/bookings/[id]
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

        // Delete associated payments first (if any)
        await supabase
            .from("payments")
            .delete()
            .eq("booking_id", id);

        // Delete the booking
        const { error } = await supabase
            .from("bookings")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
