import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionCookieValue } from '@/lib/services/session'

// Gates the dashboard: no valid session cookie, no access. Runs on the
// Node.js runtime by default (Next.js 16), so it can verify the cookie's
// HMAC signature with node:crypto directly, no Edge-runtime workaround and
// no database round trip per request.
export function proxy(request: NextRequest) {
  const session = verifySessionCookieValue(request.cookies.get(SESSION_COOKIE.name)?.value)
  if (session) return NextResponse.next()

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
