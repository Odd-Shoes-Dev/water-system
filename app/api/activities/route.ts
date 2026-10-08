import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'
import { ACTIVITY_KIND_LABELS, MAX_ACTIVITY_PHOTOS, type ActivityKind } from '@/lib/data/types'

export const dynamic = 'force-dynamic'

// Dashboard-only ("Log activity" on River watch). Not access-controlled yet:
// see docs/known-issues.md.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const kind = body.kind
  const location = typeof body.location === 'string' ? body.location.trim() : ''
  const description = typeof body.description === 'string' ? body.description.trim() : ''
  const occurredOn = typeof body.occurredOn === 'string' ? body.occurredOn.trim() : ''
  const photoUrls = Array.isArray(body.photoUrls)
    ? body.photoUrls.filter((url): url is string => typeof url === 'string' && url.trim().length > 0).map((url) => url.trim())
    : []

  const numberField = (value: unknown): number | null => {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return null
    return value
  }
  const youthCount = numberField(body.youthCount)
  const householdsReached = numberField(body.householdsReached)
  const treesPlanted = numberField(body.treesPlanted)
  const participants = numberField(body.participants)
  const wasteCollectedKg = numberField(body.wasteCollectedKg)
  const areaRestoredM2 = numberField(body.areaRestoredM2)

  if (typeof kind !== 'string' || !(kind in ACTIVITY_KIND_LABELS)) {
    return NextResponse.json({ error: 'Choose a valid activity type' }, { status: 400 })
  }
  if (location.length < 2 || location.length > 100) {
    return NextResponse.json({ error: 'Enter a location between 2 and 100 characters' }, { status: 400 })
  }
  if (!occurredOn || Number.isNaN(Date.parse(occurredOn))) {
    return NextResponse.json({ error: 'Enter a valid date' }, { status: 400 })
  }
  if (description.length > 1000) {
    return NextResponse.json({ error: 'Remarks must be 1000 characters or fewer' }, { status: 400 })
  }
  if ([youthCount, householdsReached, treesPlanted, participants, wasteCollectedKg, areaRestoredM2].some((v) => v === null)) {
    return NextResponse.json({ error: 'Numbers must be zero or greater' }, { status: 400 })
  }
  if (photoUrls.length > MAX_ACTIVITY_PHOTOS) {
    return NextResponse.json({ error: `You can attach up to ${MAX_ACTIVITY_PHOTOS} photos` }, { status: 400 })
  }

  try {
    const activity = await getDataStore().createActivity({
      kind: kind as ActivityKind,
      location,
      description,
      occurredOn,
      youthCount: youthCount as number,
      householdsReached: householdsReached as number,
      treesPlanted: treesPlanted as number,
      participants: participants as number,
      wasteCollectedKg: wasteCollectedKg as number,
      areaRestoredM2: areaRestoredM2 as number,
      photoUrls,
    })
    return NextResponse.json({ activity }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not save that right now. Please try again.' }, { status: 502 })
  }
}
