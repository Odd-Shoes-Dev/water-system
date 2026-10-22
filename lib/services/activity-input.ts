import { ACTIVITY_KIND_LABELS, MAX_ACTIVITY_PHOTOS, type ActivityKind, type NewActivity } from '@/lib/data/types'

// Shared by app/api/activities/route.ts (create) and
// app/api/activities/[id]/route.ts (edit) so the two don't drift apart.
export function parseActivityInput(body: Record<string, unknown>): { activity: NewActivity } | { error: string } {
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
  const peopleReached = numberField(body.peopleReached)
  const peopleEmployed = numberField(body.peopleEmployed)
  const volunteers = numberField(body.volunteers)
  const treesPlanted = numberField(body.treesPlanted)
  const participants = numberField(body.participants)
  const wasteCollectedKg = numberField(body.wasteCollectedKg)
  const areaRestoredM2 = numberField(body.areaRestoredM2)

  if (typeof kind !== 'string' || !(kind in ACTIVITY_KIND_LABELS)) {
    return { error: 'Choose a valid activity type' }
  }
  if (location.length < 2 || location.length > 100) {
    return { error: 'Enter a location between 2 and 100 characters' }
  }
  if (!occurredOn || Number.isNaN(Date.parse(occurredOn))) {
    return { error: 'Enter a valid date' }
  }
  if (description.length > 1000) {
    return { error: 'Remarks must be 1000 characters or fewer' }
  }
  if (
    [youthCount, householdsReached, peopleReached, peopleEmployed, volunteers, treesPlanted, participants, wasteCollectedKg, areaRestoredM2].some(
      (v) => v === null,
    )
  ) {
    return { error: 'Numbers must be zero or greater' }
  }
  if (photoUrls.length > MAX_ACTIVITY_PHOTOS) {
    return { error: `You can attach up to ${MAX_ACTIVITY_PHOTOS} photos` }
  }

  return {
    activity: {
      kind: kind as ActivityKind,
      location,
      description,
      occurredOn,
      youthCount: youthCount as number,
      householdsReached: householdsReached as number,
      peopleReached: peopleReached as number,
      peopleEmployed: peopleEmployed as number,
      volunteers: volunteers as number,
      treesPlanted: treesPlanted as number,
      participants: participants as number,
      wasteCollectedKg: wasteCollectedKg as number,
      areaRestoredM2: areaRestoredM2 as number,
      photoUrls,
    },
  }
}
