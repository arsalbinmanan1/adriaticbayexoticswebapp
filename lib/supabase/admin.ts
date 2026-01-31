import { createClient } from '@supabase/supabase-js'

/**
 * Server-side admin client for use in API routes, Server Actions, or Background Tasks.
 * Uses the service role key to bypass RLS.
 *
 * CAUTION: Use this ONLY on the server. Never expose the service role key to the client.
 */
export const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Missing Supabase admin environment variables')
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
