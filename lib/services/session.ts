// A signed, stateless session cookie: no server-side session table. proxy.ts
// runs on the Node.js runtime by default in this Next.js version, so it can
// verify the signature directly with node:crypto, with no database round
// trip on every request.
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export type Session = { id: number; email: string; name: string }

export const SESSION_COOKIE = {
  name: 'rr_session',
  maxAgeSeconds: 60 * 60 * 24 * 14, // 14 days
}

function secret(): string {
  const value = process.env.SESSION_SECRET
  if (!value) throw new Error('SESSION_SECRET is not set. Add it to .env.local (see .env.example).')
  return value
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex')
}

export function createSessionCookieValue(session: Session): string {
  const data = { ...session, exp: Date.now() + SESSION_COOKIE.maxAgeSeconds * 1000 }
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifySessionCookieValue(value: string | undefined | null): Session | null {
  if (!value) return null
  const [payload, signature] = value.split('.')
  if (!payload || !signature) return null

  const expected = sign(payload)
  const given = Buffer.from(signature)
  const want = Buffer.from(expected)
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null
    return { id: data.id, email: data.email, name: data.name }
  } catch {
    return null
  }
}

// Server Components / Server Functions only (uses next/headers). API routes
// and proxy.ts read the cookie off the request directly instead.
export async function getSession(): Promise<Session | null> {
  const store = await cookies()
  return verifySessionCookieValue(store.get(SESSION_COOKIE.name)?.value)
}
