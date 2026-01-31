/**
 * Environment Variable Validation
 * Validates all required environment variables at app startup
 */

const requiredEnvVars = {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

    // Square
    SQUARE_ACCESS_TOKEN: process.env.SQUARE_ACCESS_TOKEN,
    SQUARE_ENVIRONMENT: process.env.SQUARE_ENVIRONMENT,
    SQUARE_LOCATION_ID: process.env.SQUARE_LOCATION_ID,
    SQUARE_WEBHOOK_SIGNATURE_KEY: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY,

    // Auth
    JWT_SECRET: process.env.JWT_SECRET,

    // Email
    RESEND_API_KEY: process.env.RESEND_API_KEY,
} as const

const publicEnvVars = {
    NEXT_PUBLIC_SQUARE_APPLICATION_ID: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
    NEXT_PUBLIC_SQUARE_LOCATION_ID: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
    NEXT_PUBLIC_SQUARE_ENVIRONMENT: process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT,
} as const

export function validateEnv() {
    const missing: string[] = []

    // Check server-side required vars
    for (const [key, value] of Object.entries(requiredEnvVars)) {
        if (!value) {
            missing.push(key)
        }
    }

    // Check public vars (only in browser/client components)
    if (typeof window !== 'undefined') {
        for (const [key, value] of Object.entries(publicEnvVars)) {
            if (!value) {
                missing.push(key)
            }
        }
    }

    if (missing.length > 0) {
        const errorMsg = `Missing required environment variables:\n${missing.join('\n')}\n\nPlease check your .env.local file.`
        console.error(errorMsg)
        throw new Error(errorMsg)
    }

    // Validate JWT_SECRET length
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters long')
    }

    console.log('✅ All required environment variables are set')
}

// Auto-validate on import (server-side only)
if (typeof window === 'undefined') {
    try {
        validateEnv()
    } catch (error) {
        // Only throw in production, warn in development
        if (process.env.NODE_ENV === 'production') {
            throw error
        } else {
            console.warn(error)
        }
    }
}
