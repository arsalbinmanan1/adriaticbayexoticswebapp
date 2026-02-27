/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import path from 'path'
import { createAdminClient } from '@/lib/supabase/admin'

// Note: body parsing is disabled by using `await request.formData()` directly.

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET || 'car-images'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[upload-image] missing Supabase env vars')
    return NextResponse.json({ error: 'Upload failed: missing Supabase configuration' }, { status: 500 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as any
    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    const mime = file.type || ''
    if (!allowed.includes(mime)) {
      return NextResponse.json({ error: 'Only PNG, JPG/JPEG and WEBP are allowed' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const maxBytes = 5 * 1024 * 1024 // 5MB
    if (buffer.length > maxBytes) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 413 })
    }

    const originalName = (file.name as string) || `upload-${Date.now()}`
    const ext = path.extname(originalName) || (mime === 'image/png' ? '.png' : '.jpg')
    const base = path.basename(originalName, ext).replace(/[^a-z0-9\-_.]/gi, '-').toLowerCase()
    const filename = `${base}-${Date.now()}${ext}`

    const supabase = createAdminClient()
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, { contentType: mime, upsert: false })

    if (error) {
      console.error('[upload-image] Supabase storage error', error)
      return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${data.path}`
    return NextResponse.json({ path: publicUrl })
  } catch (err) {
    console.error('[upload-image] error', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
