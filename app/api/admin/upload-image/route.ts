/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import path from 'path'
import fs from 'fs/promises'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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

    // sanitize filename
    const originalName = (file.name as string) || `upload-${Date.now()}`
    const ext = path.extname(originalName) || (mime === 'image/png' ? '.png' : '.jpg')
    const base = path.basename(originalName, ext).replace(/[^a-z0-9\-_.]/gi, '-').toLowerCase()
    const filename = `${base}-${Date.now()}${ext}`

    const dir = path.join(process.cwd(), 'public', 'car-images')
    await fs.mkdir(dir, { recursive: true })
    const filepath = path.join(dir, filename)

    await fs.writeFile(filepath, buffer)

    const publicPath = `/car-images/${filename}`
    return NextResponse.json({ path: publicPath })
  } catch (err) {
    console.error('[upload-image] error', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
