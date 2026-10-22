import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'

export const dynamic = 'force-dynamic'

// Dashboard-only (manually logs a greywater reading, since there's no
// sensor pipeline for greywater yet). Protected by proxy.ts.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const unitId = typeof body.unitId === 'string' ? body.unitId.trim() : ''

  const numberField = (value: unknown): number | null =>
    typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null
  const litresCollected = numberField(body.litresCollected)
  const litresFiltered = numberField(body.litresFiltered)
  const litresReused = numberField(body.litresReused)

  if (!unitId) {
    return NextResponse.json({ error: 'Choose a greywater system' }, { status: 400 })
  }
  if ([litresCollected, litresFiltered, litresReused].some((v) => v === null)) {
    return NextResponse.json({ error: 'Litres must be zero or greater' }, { status: 400 })
  }

  try {
    const units = await getDataStore().listGreywaterUnits()
    if (!units.some((u) => u.id === unitId)) {
      return NextResponse.json({ error: 'That greywater system was not found' }, { status: 404 })
    }

    await getDataStore().insertGreywaterReadings([
      {
        unitId,
        recordedAt: new Date(),
        litresCollected: litresCollected as number,
        litresFiltered: litresFiltered as number,
        litresReused: litresReused as number,
        filterPressureKpa: null,
      },
    ])
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not save that right now. Please try again.' }, { status: 502 })
  }
}
