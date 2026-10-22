import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'
import { parseTankInput } from '@/lib/services/tank-input'

export const dynamic = 'force-dynamic'

// Dashboard-only (registers a newly installed tank). Protected by proxy.ts.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = parseTankInput(body)
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  try {
    const tank = await getDataStore().createTank(parsed.tank)
    return NextResponse.json({ tank }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not save that right now. Please try again.' }, { status: 502 })
  }
}
