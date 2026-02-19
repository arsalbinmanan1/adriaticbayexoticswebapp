/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import path from 'path'
import { Readable } from 'stream'
import { v2 as cloudinary } from 'cloudinary'

// Note: `export const config` is not supported for app route segments in Next.js
// body parsing is disabled by using `await request.formData()` directly.

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Ensure Cloudinary credentials are available on the server at runtime
  if (!process.env.CLOUDINARY_URL) {
    console.error('[upload-image] missing CLOUDINARY_URL')
    return NextResponse.json({ error: 'Upload failed: missing CLOUDINARY_URL' }, { status: 500 })
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

    // sanitize filename (Cloudinary will also generate its own public id when omitted)
    const originalName = (file.name as string) || `upload-${Date.now()}`
    const ext = path.extname(originalName) || (mime === 'image/png' ? '.png' : '.jpg')
    const base = path.basename(originalName, ext).replace(/[^a-z0-9\-_.]/gi, '-').toLowerCase()
    const filename = `${base}-${Date.now()}${ext}`

    // Configure Cloudinary using CLOUDINARY_URL from env
    cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL })

    // Upload buffer to Cloudinary via upload_stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'car-images', public_id: filename.replace(ext, ''), resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )

      const readable = new Readable()
      readable.push(buffer)
      readable.push(null)
      readable.pipe(uploadStream)
    })

    const publicUrl = uploadResult?.secure_url || uploadResult?.url
    if (!publicUrl) {
      console.error('[upload-image] cloudinary upload no url', uploadResult)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    return NextResponse.json({ path: publicUrl })
  } catch (err) {
    console.error('[upload-image] error', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
