import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * API Route: /api/webhooks/square
 * Handles asynchronous event notifications from Square.
 */
export async function POST(request: Request) {
    // Square webhooks are disabled while payments are turned off.
    // Return a 410 Gone so upstream services know this endpoint isn't in use.
    return NextResponse.json({ success: false, message: 'Square webhooks disabled' }, { status: 410 })
}

/**
 * Verifies the integrity and authenticity of the webhook request.
 */
function verifySquareSignature(
    signatureKey: string,
    notificationUrl: string,
    signature: string,
    body: string
): boolean {
    if (!signature || !signatureKey) return false

    const combined = notificationUrl + body
    const hmac = crypto.createHmac('sha256', signatureKey)
    hmac.update(combined)
    const expectedSignature = hmac.digest('base64').trim()

    // Use timing-safe comparison and ensure buffers are same length
    try {
        const expectedBuf = Buffer.from(expectedSignature)
        const incomingBuf = Buffer.from(signature)
        if (expectedBuf.length !== incomingBuf.length) return false
        return crypto.timingSafeEqual(expectedBuf, incomingBuf)
    } catch (err) {
        console.error('[Webhook Signature Verify Error]:', err)
        return false
    }
}
