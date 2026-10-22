import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'

export const dynamic = 'force-dynamic'

// Dashboard-only (manually logs a tank reading, alongside sensor-reported
// ones — both land in the same table, nothing distinguishes them). Protected
// by proxy.ts.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const tankId = typeof body.tankId === 'string' ? body.tankId.trim() : ''

  const numberField = (value: unknown): number | null =>
    typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null
  const levelPercent = numberField(body.levelPercent)
  const litresHarvested = numberField(body.litresHarvested)
  const litresUsed = numberField(body.litresUsed)

  if (!tankId) {
    return NextResponse.json({ error: 'Choose a tank' }, { status: 400 })
  }
  if (levelPercent === null || levelPercent > 100) {
    return NextResponse.json({ error: 'Level must be between 0 and 100' }, { status: 400 })
  }
  if ([litresHarvested, litresUsed].some((v) => v === null)) {
    return NextResponse.json({ error: 'Litres must be zero or greater' }, { status: 400 })
  }

  try {
    const tanks = await getDataStore().listTanks()
    if (!tanks.some((t) => t.id === tankId)) {
      return NextResponse.json({ error: 'That tank was not found' }, { status: 404 })
    }

    await getDataStore().insertTankReadings([
      {
        tankId,
        recordedAt: new Date(),
        levelPercent,
        litresHarvested: litresHarvested as number,
        litresUsed: litresUsed as number,
      },
    ])
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not save that right now. Please try again.' }, { status: 502 })
  }
}
