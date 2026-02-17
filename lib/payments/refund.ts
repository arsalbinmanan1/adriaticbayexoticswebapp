import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Refunds are disabled while payments are turned off.
 * This helper now returns a descriptive error so callers can handle
 * the disabled state without attempting Square API calls.
 */
export const processRefund = async (_params: { bookingId: string; paymentId: string; amount?: number; reason?: string }) => {
    const supabase = createAdminClient()

    // Optionally, record a note in the DB or perform bookkeeping here.
    // For now, just return a disabled response.
    console.warn('Refund requested but payments are disabled')

    return { success: false, error: 'Refunds are disabled because payments are currently turned off.' }
}
