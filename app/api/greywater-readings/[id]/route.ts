import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'

export const dynamic = 'force-dynamic'

// Dashboard-only (edit/delete a logged greywater reading). Protected by proxy.ts.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid reading id' }, { status: 400 })
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const numberField = (value: unknown): number | null =>
    typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null
  const litresCollected = numberField(body.litresCollected)
  const litresFiltered = numberField(body.litresFiltered)
  const litresReused = numberField(body.litresReused)

  if ([litresCollected, litresFiltered, litresReused].some((v) => v === null)) {
    return NextResponse.json({ error: 'Litres must be zero or greater' }, { status: 400 })
  }

  try {
    const reading = await getDataStore().updateGreywaterReading(id, {
      litresCollected: litresCollected as number,
      litresFiltered: litresFiltered as number,
      litresReused: litresReused as number,
    })
    if (!reading) {
      return NextResponse.json({ error: 'Reading not found' }, { status: 404 })
    }
    return NextResponse.json({ reading })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not save that right now. Please try again.' }, { status: 502 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid reading id' }, { status: 400 })
  }

  try {
    await getDataStore().deleteGreywaterReading(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not delete that right now. Please try again.' }, { status: 502 })
  }
}
