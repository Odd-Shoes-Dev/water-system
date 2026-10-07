import { NextResponse } from 'next/server'
import { getStorageProvider, isStorageConfigured } from '@/lib/providers/storage'
import { matchesDeclaredType } from '@/lib/services/file-signatures'

export const dynamic = 'force-dynamic'

// Vercel's serverless functions reject request bodies above a platform limit
// (commonly around 4.5 MB) before this code even runs, so every limit here
// stays under that regardless of what might seem reasonable for the file type.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

// What's being uploaded decides the folder, the allowed file types and the size
// limit. The folder is never taken from the request, so a client can't write
// outside these known locations.
const PURPOSES = {
  'river-report-photo': {
    folder: 'river-reports',
    maxBytes: MAX_UPLOAD_BYTES,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    label: 'Photo',
  },
  'waitlist-photo': {
    folder: 'waitlist',
    maxBytes: MAX_UPLOAD_BYTES,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    label: 'Photo',
  },
  'waitlist-audio': {
    folder: 'waitlist',
    maxBytes: MAX_UPLOAD_BYTES,
    allowedTypes: ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/x-m4a', 'audio/aac'],
    label: 'Audio (keep voice notes short, under about a minute)',
  },
} as const

type Purpose = keyof typeof PURPOSES

function isPurpose(value: unknown): value is Purpose {
  return typeof value === 'string' && value in PURPOSES
}

// Receives one file from a form (a report photo, or waitlist evidence) and
// stores it with the configured storage provider, returning its public URL.
export async function POST(request: Request) {
  if (!isStorageConfigured()) {
    return NextResponse.json({ error: 'File uploads are not set up yet' }, { status: 503 })
  }

  const purposeParam = new URL(request.url).searchParams.get('purpose')
  if (!isPurpose(purposeParam)) {
    return NextResponse.json({ error: 'Unknown upload type' }, { status: 400 })
  }
  const purpose = PURPOSES[purposeParam]

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file was received' }, { status: 400 })
  }
  if (!(purpose.allowedTypes as readonly string[]).includes(file.type)) {
    return NextResponse.json({ error: `${purpose.label} type is not supported` }, { status: 400 })
  }
  if (file.size > purpose.maxBytes) {
    return NextResponse.json(
      { error: `${purpose.label} must be ${Math.round(purpose.maxBytes / (1024 * 1024))} MB or smaller` },
      { status: 400 },
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // The browser's reported type is easy to spoof (for example by renaming a
  // file), so also check the file's actual bytes against what it claims to be.
  if (!matchesDeclaredType(buffer, file.type)) {
    return NextResponse.json({ error: `This file doesn't look like a valid ${file.type}` }, { status: 400 })
  }

  const extension = file.type.split('/')[1]?.replace('x-', '') ?? 'bin'
  const fileName = `${purposeParam}-${Date.now()}.${extension}`

  try {
    const uploaded = await getStorageProvider().uploadFile({
      data: buffer,
      fileName,
      folder: purpose.folder,
    })
    return NextResponse.json({ url: uploaded.url }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not upload the file. Please try again.' }, { status: 502 })
  }
}
