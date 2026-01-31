import { createBrowserClient } from '@supabase/ssr'

/**
 * Client-side Supabase client for use in browser components.
 * Uses the public anon key and handles session persistence automatically.
 */
export const createClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
