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
  const email = typeof body.email === 'string' && body.email.trim() ? body.email.trim() : null
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
  // Simple shape check, not a full RFC 5322 validator: good enough to catch typos.
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
  }

  try {
    await getDataStore().createWaitlistEntry({ name, place, phone, email, photoUrl, audioUrl })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not save that right now. Please try again.' }, { status: 502 })
  }
}
