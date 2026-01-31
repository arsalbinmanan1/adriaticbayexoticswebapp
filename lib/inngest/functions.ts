import { inngest } from "./client";
import { resend } from "../resend";
import { createAdminClient } from "../supabase/admin";
import BookingConfirmationEmail from "@/emails/BookingConfirmation";
import OwnerNotificationEmail from "@/emails/OwnerNotification";
import PaymentReceiptEmail from "@/emails/PaymentReceipt";
import CancellationEmail from "@/emails/Cancellation";
import ReminderEmail from "@/emails/Reminder";
import { format } from "date-fns";

// Import scheduled functions
export { cleanupExpiredBookings } from './scheduled'


/**
 * Function: Handle Booking Confirmed
 * Triggered when a deposit is successfully paid.
 */
export const handleBookingConfirmed = inngest.createFunction(
    { id: "handle-booking-confirmed" },
    { event: "notification/booking.confirmed" },
    async ({ event, step }) => {
        const { bookingId } = event.data;
        const supabase = createAdminClient();

        // 1. Fetch Booking and Car Details
        const { data: booking } = await step.run("fetch-booking", async () => {
            const { data, error } = await supabase
                .from("bookings")
                .select("*, cars(*)")
                .eq("id", bookingId)
                .single();
            if (error) throw error;
            return data;
        });

        if (!booking) return { message: "Booking not found" };

        const carName = `${booking.cars.make} ${booking.cars.model}`;
        const pickupDate = format(new Date(booking.pickup_datetime), "PPP p");
        const dropoffDate = format(new Date(booking.dropoff_datetime), "PPP p");

        // 2. Send Customer Confirmation Email
        const customerEmailResult = await step.run("send-customer-email", async () => {
            return await resend.emails.send({
                from: "Adriatic Bay Exotics <bookings@adriaticbayexotics.com>",
                to: [booking.customer_email],
                subject: `Booking Confirmed - ${booking.id.slice(0, 8).toUpperCase()}`,
                react: BookingConfirmationEmail({
                    customerName: booking.customer_name,
                    bookingReference: booking.id.slice(0, 8).toUpperCase(),
                    carName: carName,
                    pickupDate: pickupDate,
                    dropoffDate: dropoffDate,
                    pickupLocation: booking.pickup_location,
                    dropoffLocation: booking.dropoff_location,
                    totalAmount: `$${booking.total_amount}`,
                    depositPaid: `$${booking.deposit_amount}`,
                }),
            });
        });

        // 3. Send Owner Notification Email
        const ownerEmailResult = await step.run("send-owner-email", async () => {
            return await resend.emails.send({
                from: "System <notifications@adriaticbayexotics.com>",
                to: [process.env.OWNER_EMAIL || "info@adriaticbayexotics.com"],
                subject: `New Booking: ${carName} - ${booking.customer_name}`,
                react: OwnerNotificationEmail({
                    customerName: booking.customer_name,
                    customerEmail: booking.customer_email,
                    customerPhone: booking.customer_phone,
                    carName: carName,
                    pickupDate: pickupDate,
                    dropoffDate: dropoffDate,
                    totalAmount: `$${booking.total_amount}`,
                    bookingId: booking.id,
                }),
            });
        });

        // 4. Log Notifications in DB
        await step.run("log-notifications", async () => {
            await supabase.from("notifications").insert([
                {
                    booking_id: bookingId,
                    type: "new_booking",
                    recipient_email: booking.customer_email,
                    delivery_status: customerEmailResult.error ? "failed" : "sent",
                    subject: `Booking Confirmed - ${booking.id.slice(0, 8).toUpperCase()}`,
                    error_message: customerEmailResult.error?.message,
                    sent_at: new Date().toISOString(),
                },
                {
                    booking_id: bookingId,
                    type: "new_booking",
                    recipient_email: process.env.OWNER_EMAIL || "info@adriaticbayexotics.com",
                    delivery_status: ownerEmailResult.error ? "failed" : "sent",
                    subject: `New Booking: ${carName} - ${booking.customer_name}`,
                    error_message: ownerEmailResult.error?.message,
                    sent_at: new Date().toISOString(),
                }
            ]);
        });

        return { customerEmailId: customerEmailResult.data?.id, ownerEmailId: ownerEmailResult.data?.id };
    }
);

/**
 * Function: Handle Payment Succeeded
 * Triggered on successful transaction (Square webhook).
 */
export const handlePaymentSucceeded = inngest.createFunction(
    { id: "handle-payment-succeeded" },
    { event: "notification/payment.succeeded" },
    async ({ event, step }) => {
        const { bookingId, transactionId, amount, last4, brand } = event.data;
        const supabase = createAdminClient();

        const { data: booking } = await step.run("fetch-booking", async () => {
            const { data } = await supabase.from("bookings").select("*").eq("id", bookingId).single();
            return data;
        });

        if (!booking) return { message: "Booking not found" };

        const emailResult = await step.run("send-receipt-email", async () => {
            return await resend.emails.send({
                from: "Adriatic Bay Exotics <billing@adriaticbayexotics.com>",
                to: [booking.customer_email],
                subject: `Payment Receipt - ${booking.id.slice(0, 8).toUpperCase()}`,
                react: PaymentReceiptEmail({
                    customerName: booking.customer_name,
                    transactionId: transactionId,
                    amount: `$${amount}`,
                    paymentMethod: `${brand} ending in ${last4}`,
                    date: format(new Date(), "PPP"),
                    description: `Payment for booking ${booking.id.slice(0, 8).toUpperCase()}`,
                }),
            });
        });

        await step.run("log-notification", async () => {
            await supabase.from("notifications").insert({
                booking_id: bookingId,
                type: "payment_received",
                recipient_email: booking.customer_email,
                delivery_status: emailResult.error ? "failed" : "sent",
                subject: `Payment Receipt - ${booking.id.slice(0, 8).toUpperCase()}`,
                error_message: emailResult.error?.message,
                sent_at: new Date().toISOString(),
            });
        });

        return { emailId: emailResult.data?.id };
    }
);

/**
 * Function: Handle Booking Cancelled
 */
export const handleBookingCancelled = inngest.createFunction(
    { id: "handle-booking-cancelled" },
    { event: "notification/booking.cancelled" },
    async ({ event, step }) => {
        const { bookingId, refundAmount, reason } = event.data;
        const supabase = createAdminClient();

        const { data: booking } = await step.run("fetch-booking", async () => {
            const { data } = await supabase.from("bookings").select("*, cars(*)").eq("id", bookingId).single();
            return data;
        });

        if (!booking) return { message: "Booking not found" };

        const emailResult = await step.run("send-cancellation-email", async () => {
            return await resend.emails.send({
                from: "Adriatic Bay Exotics <support@adriaticbayexotics.com>",
                to: [booking.customer_email],
                subject: `Cancellation Confirmed - ${booking.id.slice(0, 8).toUpperCase()}`,
                react: CancellationEmail({
                    customerName: booking.customer_name,
                    bookingReference: booking.id.slice(0, 8).toUpperCase(),
                    carName: `${booking.cars.make} ${booking.cars.model}`,
                    refundAmount: `$${refundAmount || 0}`,
                    reason: reason || "Cancelled as per policy",
                }),
            });
        });

        await step.run("log-notification", async () => {
            await supabase.from("notifications").insert({
                booking_id: bookingId,
                type: "cancellation",
                recipient_email: booking.customer_email,
                delivery_status: emailResult.error ? "failed" : "sent",
                subject: `Cancellation Confirmed - ${booking.id.slice(0, 8).toUpperCase()}`,
                error_message: emailResult.error?.message,
                sent_at: new Date().toISOString(),
            });
        });

        return { emailId: emailResult.data?.id };
    }
);

/**
 * Function: Send Reminder Email
 * Helper function triggered by the scheduler.
 */
export const sendReminderEmail = inngest.createFunction(
    { id: "send-reminder-email" },
    { event: "notification/reminder.send" },
    async ({ event, step }) => {
        const { bookingId, type } = event.data;
        const supabase = createAdminClient();

        const { data: booking } = await step.run("fetch-booking", async () => {
            const { data } = await supabase.from("bookings").select("*, cars(*)").eq("id", bookingId).single();
            return data;
        });

        if (!booking) return { message: "Booking not found" };

        const emailResult = await step.run("send-email", async () => {
            return await resend.emails.send({
                from: "Adriatic Bay Exotics <reminders@adriaticbayexotics.com>",
                to: [booking.customer_email],
                subject: `${type === "48h" ? "48-Hour" : "24-Hour"} Pickup Reminder - Adriatic Bay Exotics`,
                react: ReminderEmail({
                    customerName: booking.customer_name,
                    carName: `${booking.cars.make} ${booking.cars.model}`,
                    pickupTime: format(new Date(booking.pickup_datetime), "PPP p"),
                    pickupLocation: booking.pickup_location,
                    type: type as "48h" | "24h",
                }),
            });
        });

        await step.run("log-notification", async () => {
            await supabase.from("notifications").insert({
                booking_id: bookingId,
                type: "reminder",
                recipient_email: booking.customer_email,
                delivery_status: emailResult.error ? "failed" : "sent",
                subject: `${type === "48h" ? "48-Hour" : "24-Hour"} Pickup Reminder`,
                error_message: emailResult.error?.message,
                sent_at: new Date().toISOString(),
            });
        });

        return { emailId: emailResult.data?.id };
    }
);

/**
 * Function: Daily Reminder Scheduler
 * Runs every day to find bookings that need reminders.
 */
export const scheduleDailyReminders = inngest.createFunction(
    { id: "schedule-daily-reminders" },
    { cron: "0 9 * * *" }, // Run every day at 9:00 AM
    async ({ step }) => {
        const supabase = createAdminClient();

        const reminders = await step.run("find-bookings-needing-reminders", async () => {
            const now = new Date();

            // Find bookings starting in ~48 hours
            const in48hStart = new Date(now.getTime() + (48 * 60 * 60 * 1000));
            const in48hEnd = new Date(in48hStart.getTime() + (24 * 60 * 60 * 1000));

            const { data: bookings48h } = await supabase
                .from("bookings")
                .select("id")
                .eq("status", "confirmed")
                .gte("pickup_datetime", in48hStart.toISOString())
                .lt("pickup_datetime", in48hEnd.toISOString());

            // Find bookings starting in ~24 hours
            const in24hStart = new Date(now.getTime() + (24 * 60 * 60 * 1000));
            const in24hEnd = new Date(in24hStart.getTime() + (24 * 60 * 60 * 1000));

            const { data: bookings24h } = await supabase
                .from("bookings")
                .select("id")
                .eq("status", "confirmed")
                .gte("pickup_datetime", in24hStart.toISOString())
                .lt("pickup_datetime", in24hEnd.toISOString());

            return {
                reminders48h: bookings48h?.map(b => b.id) || [],
                reminders24h: bookings24h?.map(b => b.id) || []
            };
        });

        const events = [
            ...reminders.reminders48h.map(id => ({ name: "notification/reminder.send", data: { bookingId: id, type: "48h" } })),
            ...reminders.reminders24h.map(id => ({ name: "notification/reminder.send", data: { bookingId: id, type: "24h" } }))
        ];

        if (events.length > 0) {
            await step.sendEvent("trigger-reminders", events);
        }

        return { scheduled: events.length };
    }
);
