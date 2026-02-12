import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";
import { inngest } from "@/lib/inngest/client";

/**
 * PATCH /api/admin/bookings/[id]/status
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        const { status, reason } = await request.json();
        const supabase = createAdminClient();

        const { data: existingBooking, error: existingError } = await supabase
            .from("bookings")
            .select("payment_status")
            .eq("id", id)
            .single();

        if (existingError || !existingBooking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        const paidStatuses = new Set(["paid", "deposit_paid"]);
        const needsPayment = ["confirmed", "active", "completed"].includes(status);
        const hasPaid = paidStatuses.has(String(existingBooking.payment_status || "").toLowerCase());

        if (needsPayment && !hasPaid) {
            return NextResponse.json({ error: "Payment is not completed for this booking." }, { status: 400 });
        }

        // 1. Update status in DB
        const { data: booking, error: updateError } = await supabase
            .from("bookings")
            .update({
                status,
                internal_notes: reason ? `Status updated to ${status}: ${reason}` : undefined,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select("*, cars(*)")
            .single();

        if (updateError) throw updateError;

        // 2. Trigger appropriate notification events if necessary
        // Example: If confirmed manually, send confirmation email if not already sent
        // Try to send notification (optional - don't fail if Inngest is not configured)
        try {
            if (status === "confirmed") {
                await inngest.send({
                    name: "notification/booking.confirmed",
                    data: { bookingId: id }
                });
            } else if (status === "cancelled") {
                await inngest.send({
                    name: "notification/booking.cancelled",
                    data: { bookingId: id, reason: reason || "Cancelled by admin" }
                });
            }
        } catch (notificationError) {
            console.warn('[Status Update] Notification failed (non-critical):', notificationError);
            // Continue - status update succeeded even if notification failed
        }

        return NextResponse.json(booking);
    } catch (error: any) {
        console.error("[Status Update Error]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
