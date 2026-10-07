import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'

export const dynamic = 'force-dynamic'

// Only a count is ever returned. Names and phone numbers are personal data and
// are never listed back out to the app.
export async function GET() {
  const count = await getDataStore().countWaitlistEntries()
  return NextResponse.json({ count })
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const place = typeof body.place === 'string' ? body.place.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const photoUrl = typeof body.photoUrl === 'string' && body.photoUrl.trim() ? body.photoUrl.trim() : null
  const audioUrl = typeof body.audioUrl === 'string' && body.audioUrl.trim() ? body.audioUrl.trim() : null

  if (name.length < 2 || name.length > 100) {
    return NextResponse.json({ error: 'Enter a name between 2 and 100 characters' }, { status: 400 })
  }
  if (place.length < 2 || place.length > 100) {
    return NextResponse.json({ error: 'Enter a place between 2 and 100 characters' }, { status: 400 })
  }
  // Loose on purpose: accepts digits, spaces and a leading +, without assuming a country.
  if (!/^\+?[\d\s-]{7,20}$/.test(phone)) {
    return NextResponse.json({ error: 'Enter a valid phone number' }, { status: 400 })
  }

  await getDataStore().createWaitlistEntry({ name, place, phone, photoUrl, audioUrl })
  return NextResponse.json({ ok: true }, { status: 201 })
}
