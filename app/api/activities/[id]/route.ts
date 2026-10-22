import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'
import { parseActivityInput } from '@/lib/services/activity-input'

export const dynamic = 'force-dynamic'

// Dashboard-only (edit/delete a logged activity). Protected by proxy.ts.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid activity id' }, { status: 400 })
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = parseActivityInput(body)
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  try {
    const activity = await getDataStore().updateActivity(id, parsed.activity)
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }
    return NextResponse.json({ activity })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not save that right now. Please try again.' }, { status: 502 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid activity id' }, { status: 400 })
  }

  try {
    await getDataStore().deleteActivity(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not delete that right now. Please try again.' }, { status: 502 })
  }
}
