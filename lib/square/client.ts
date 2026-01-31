import { SquareClient, SquareEnvironment, SquareError } from 'square'

/**
 * Server-side Square client.
 * Uses environment variables for configuration.
 */
const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.SQUARE_ENVIRONMENT === 'production'
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
})

export const squareClient = client

/**
 * Centralized Square Error Parser
 * Maps complex Square ApiError responses to user-safe error messages.
 * Logs raw errors server-side for internal debugging.
 */
export const parseSquareError = (error: unknown): string => {
    if (error instanceof SquareError) {
        console.error('[Square ApiError Raw]:', JSON.stringify(error.errors, null, 2))

        // Map common error codes to user-friendly messages
        const firstError = error.errors?.[0]
        if (!firstError) return 'An unknown payment error occurred.'

        switch (firstError.code) {
            case 'GENERIC_DECLINE':
                return 'The card was declined. Please try a different card.'
            case 'INSUFFICIENT_FUNDS':
                return 'Insufficient funds available.'
            case 'CVV_FAILURE':
                return 'The CVV code is incorrect.'
            case 'EXPIRATION_FAILURE':
                return 'The card has expired.'
            case 'INVALID_EXPIRATION':
                return 'The expiration date is invalid.'
            case 'CARD_NOT_SUPPORTED':
                return 'This card type is not supported.'
            case 'AMOUNT_TOO_HIGH':
                return 'The transaction amount is too high.'
            case 'IDEMPOTENCY_KEY_REUSED':
                return 'Processing error: This request was already submitted.'
            default:
                return firstError.detail || 'Payment failed. Please check your details and try again.'
        }
    }

    console.error('[Unknown Error]:', error)
    return 'An unexpected error occurred during payment processing.'
}
