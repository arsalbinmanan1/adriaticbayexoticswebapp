/**
 * Rate Limiting with Persistent Storage
 * Uses Vercel KV (Redis) for production-grade rate limiting
 * Falls back to in-memory for development
 */

import { kv } from '@vercel/kv'

interface RateLimitStore {
    [key: string]: {
        count: number
        resetAt: number
    }
}

// Fallback in-memory store for development
const memoryStore: RateLimitStore = {}

// Cleanup old entries every 5 minutes (only for memory store)
if (typeof window === 'undefined') {
    setInterval(() => {
        const now = Date.now()
        Object.keys(memoryStore).forEach(key => {
            if (memoryStore[key].resetAt < now) {
                delete memoryStore[key]
            }
        })
    }, 5 * 60 * 1000)
}

export interface RateLimitConfig {
    maxRequests: number
    windowMs: number
}

export interface RateLimitResult {
    success: boolean
    limit: number
    remaining: number
    reset: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export async function rateLimit(
    identifier: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    const now = Date.now()
    const key = `ratelimit:${identifier}`

    try {
        // Try to use Vercel KV (Redis) if available
        if (process.env.KV_REST_API_URL) {
            const current = await kv.get<number>(key) || 0
            const newCount = current + 1

            if (current === 0) {
                // First request in window
                await kv.set(key, newCount, { px: config.windowMs })
            } else {
                await kv.incr(key)
            }

            const ttl = await kv.pttl(key)
            const resetAt = now + (ttl > 0 ? ttl : config.windowMs)

            const success = newCount <= config.maxRequests
            const remaining = Math.max(0, config.maxRequests - newCount)

            return {
                success,
                limit: config.maxRequests,
                remaining,
                reset: resetAt
            }
        }
    } catch (error) {
        console.warn('[Rate Limit] KV error, falling back to memory:', error)
    }

    // Fallback to in-memory store
    if (!memoryStore[key] || memoryStore[key].resetAt < now) {
        memoryStore[key] = {
            count: 0,
            resetAt: now + config.windowMs
        }
    }

    const entry = memoryStore[key]
    entry.count++

    const success = entry.count <= config.maxRequests
    const remaining = Math.max(0, config.maxRequests - entry.count)

    return {
        success,
        limit: config.maxRequests,
        remaining,
        reset: entry.resetAt
    }
}

/**
 * Preset configurations for common use cases
 */
export const RateLimitPresets = {
    // 5 payment attempts per minute
    payment: {
        maxRequests: 5,
        windowMs: 60 * 1000
    },
    // 5 login attempts per 15 minutes
    login: {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000
    },
    // 10 API calls per minute
    api: {
        maxRequests: 10,
        windowMs: 60 * 1000
    },
    // 3 booking attempts per minute
    booking: {
        maxRequests: 3,
        windowMs: 60 * 1000
    }
}

/**
 * Get client identifier from request
 * Uses IP address or fallback to 'unknown'
 */
export function getClientIdentifier(request: Request): string {
    // Try to get real IP from headers (Vercel, Cloudflare, etc.)
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')

    return cfConnectingIp || realIp || forwardedFor?.split(',')[0] || 'unknown'
}
