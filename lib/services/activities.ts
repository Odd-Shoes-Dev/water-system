import { ACTIVITY_KIND_LABELS, type ActivityKind } from '@/lib/data/types'

// The "Log activity" form doesn't ask for a title; this derives one from
// what it does ask for, the same way for every provider.
export function deriveActivityTitle(kind: ActivityKind, location: string): string {
  const label = ACTIVITY_KIND_LABELS[kind]
  return location ? `${label} · ${location}` : label
}
