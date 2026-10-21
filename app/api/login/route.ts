import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'
import { verifyPassword } from '@/lib/services/auth'
import { createSessionCookieValue, SESSION_COOKIE } from '@/lib/services/session'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  // Generic message either way: never reveal whether the email exists.
  const invalid = () => NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

  if (!email || !password) return invalid()

  try {
    const member = await getDataStore().findTeamMemberByEmail(email)
    if (!member) return invalid()

    const ok = await verifyPassword(password, member.passwordHash)
    if (!ok) return invalid()

    const response = NextResponse.json({ ok: true })
    response.cookies.set(
      SESSION_COOKIE.name,
      createSessionCookieValue({ id: member.id, email: member.email, name: member.name }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_COOKIE.maxAgeSeconds,
      },
    )
    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not sign in right now. Please try again.' }, { status: 502 })
  }
}
