import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'
import { parseActivityInput } from '@/lib/services/activity-input'

export const dynamic = 'force-dynamic'

// Dashboard-only ("Log activity" on River watch). Protected by proxy.ts.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = parseActivityInput(body)
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  try {
    const activity = await getDataStore().createActivity(parsed.activity)
    return NextResponse.json({ activity }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not save that right now. Please try again.' }, { status: 502 })
  }
}
