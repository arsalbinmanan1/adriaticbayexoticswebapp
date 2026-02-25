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

// Build a full public URL for a file stored in the configured bucket.
// `path` may be a leading-slash path or just a filename.  Defaults to
// bucket name "car-images" but you can override with
// NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET.  Used by car lookup helpers.
export function storagePublicUrl(path: string) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET || 'car-images'
    if (!base) return path
    const trimmed = path.replace(/^\/+/, '')
    return `${base}/storage/v1/object/public/${bucket}/${trimmed}`
}
