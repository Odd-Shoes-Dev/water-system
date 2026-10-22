import type { NewTank } from '@/lib/data/types'

// Shared by app/api/tanks/route.ts (create) and app/api/tanks/[id]/route.ts
// (edit) so the two don't drift apart. capacityLitres/roofAreaM2 are
// optional (>= 0): roofAreaM2 is only ever read by the simulator, never the
// real ingest path, and a person registering a tank in the field may not
// have the capacity figure to hand yet.
export function parseTankInput(body: Record<string, unknown>): { tank: NewTank } | { error: string } {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const site = typeof body.site === 'string' ? body.site.trim() : ''

  const numberField = (value: unknown): number | null =>
    typeof value === 'number' && Number.isFinite(value) ? value : null
  const latitude = numberField(body.latitude)
  const longitude = numberField(body.longitude)
  const capacityLitres = numberField(body.capacityLitres) ?? 0
  const roofAreaM2 = numberField(body.roofAreaM2) ?? 0

  if (name.length < 2 || name.length > 100) return { error: 'Enter a name between 2 and 100 characters' }
  if (site.length < 2 || site.length > 100) return { error: 'Enter a site between 2 and 100 characters' }
  if (latitude === null || latitude < -90 || latitude > 90) return { error: 'Enter a valid latitude' }
  if (longitude === null || longitude < -180 || longitude > 180) return { error: 'Enter a valid longitude' }
  if (capacityLitres < 0) return { error: 'Capacity cannot be negative' }
  if (roofAreaM2 < 0) return { error: 'Roof area cannot be negative' }

  return { tank: { name, site, latitude, longitude, capacityLitres, roofAreaM2 } }
}
