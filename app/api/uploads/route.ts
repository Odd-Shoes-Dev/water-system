import { NextResponse } from 'next/server'
import { getStorageProvider, isStorageConfigured } from '@/lib/providers/storage'

export const dynamic = 'force-dynamic'

const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Receives one photo from a form (for example a river report) and stores it
// with the configured storage provider, returning its public URL.
export async function POST(request: Request) {
  if (!isStorageConfigured()) {
    return NextResponse.json({ error: 'Photo uploads are not set up yet' }, { status: 503 })
  }

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No photo was received' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Photos must be JPEG, PNG, WebP or GIF' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Photo must be 8 MB or smaller' }, { status: 400 })
  }

  const extension = file.type.split('/')[1] ?? 'jpg'
  const fileName = `report-${Date.now()}.${extension}`

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const uploaded = await getStorageProvider().uploadImage({
      data: buffer,
      fileName,
      folder: 'river-reports',
    })
    return NextResponse.json({ url: uploaded.url }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not upload the photo. Please try again.' }, { status: 502 })
  }
}
