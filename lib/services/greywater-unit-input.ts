import type { NewGreywaterUnit } from '@/lib/data/types'

// Shared by app/api/greywater-units/route.ts (create) and
// app/api/greywater-units/[id]/route.ts (edit).
export function parseGreywaterUnitInput(
  body: Record<string, unknown>,
): { unit: NewGreywaterUnit } | { error: string } {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const site = typeof body.site === 'string' ? body.site.trim() : ''

  const numberField = (value: unknown): number | null =>
    typeof value === 'number' && Number.isFinite(value) ? value : null
  const latitude = numberField(body.latitude)
  const longitude = numberField(body.longitude)

  if (name.length < 2 || name.length > 100) return { error: 'Enter a name between 2 and 100 characters' }
  if (site.length < 2 || site.length > 100) return { error: 'Enter a site between 2 and 100 characters' }
  if (latitude === null || latitude < -90 || latitude > 90) return { error: 'Enter a valid latitude' }
  if (longitude === null || longitude < -180 || longitude > 180) return { error: 'Enter a valid longitude' }

  return { unit: { name, site, latitude, longitude } }
}
