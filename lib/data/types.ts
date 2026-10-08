// Shapes the app works with. These are independent of the database, so pages
// and services never see raw database rows.

export type Tank = {
  id: string
  name: string
  site: string
  latitude: number
  longitude: number
  capacityLitres: number
  roofAreaM2: number
}

export type TankReading = {
  tankId: string
  recordedAt: Date
  levelPercent: number
  litresHarvested: number
  litresUsed: number
}

export type RainfallReading = {
  site: string
  recordedAt: Date
  rainfallMm: number
}

export type GreywaterStatus = 'ok' | 'filter_due' | 'fault'

export type GreywaterUnit = {
  id: string
  name: string
  site: string
  status: GreywaterStatus
  latitude: number
  longitude: number
}

export type GreywaterReading = {
  unitId: string
  recordedAt: Date
  litresCollected: number
  litresFiltered: number
  litresReused: number
  filterPressureKpa: number | null
}

export const REPORT_CATEGORIES = {
  illegal_dumping: 'Illegal dumping',
  pollution_hotspot: 'Pollution hotspot',
  blocked_drainage: 'Blocked drainage',
  riverbank_degradation: 'Riverbank degradation',
  clean_up: 'Clean-up activity',
  restoration: 'Restoration activity',
} as const

export type ReportCategory = keyof typeof REPORT_CATEGORIES

export type RiverReport = {
  id: number
  category: ReportCategory
  description: string
  locationDescription: string
  latitude: number
  longitude: number
  // Up to MAX_REPORT_PHOTOS photos (see lib/data/types.ts).
  photoUrls: string[]
  reporterName: string | null
  status: 'open' | 'verified' | 'resolved'
  createdAt: Date
}

export const MAX_REPORT_PHOTOS = 10

export type NewRiverReport = {
  category: ReportCategory
  description: string
  locationDescription: string
  latitude: number
  longitude: number
  photoUrls: string[]
  reporterName: string | null
}

export type ActivityKind = 'training' | 'clean_up' | 'restoration' | 'household_adoption'

export const ACTIVITY_KIND_LABELS: Record<ActivityKind, string> = {
  clean_up: 'River clean-up',
  restoration: 'Restoration / tree planting',
  training: 'Training / sensitisation',
  household_adoption: 'Household adoption',
}

export const MAX_ACTIVITY_PHOTOS = 10

export type Activity = {
  id: number
  kind: ActivityKind
  title: string
  location: string
  description: string
  occurredOn: string
  youthCount: number
  householdsReached: number
  facilitiesCount: number
  treesPlanted: number
  participants: number
  wasteCollectedKg: number
  areaRestoredM2: number
  photoUrls: string[]
}

// What the "Log activity" form submits. The title is derived server-side
// from the kind and location, so the form doesn't need to ask for one.
export type NewActivity = {
  kind: ActivityKind
  location: string
  description: string
  occurredOn: string
  youthCount: number
  householdsReached: number
  treesPlanted: number
  participants: number
  wasteCollectedKg: number
  areaRestoredM2: number
  photoUrls: string[]
}

export type Stakeholder = {
  id: number
  name: string
  organisationType: 'government' | 'community' | 'school' | 'ngo' | 'business' | 'funder'
  role: string
  influence: number
  interest: number
  latitude: number | null
  longitude: number | null
}

export type Device = {
  id: string
  tankId: string
  keyHash: string
  lastSeenAt: Date | null
}

// General interest list: anyone who wants to be part of the programme, not
// tied to one specific offer (a tank, training, and so on).
export type WaitlistEntry = {
  id: number
  name: string
  place: string
  phone: string
  email: string | null
  photoUrl: string | null
  audioUrl: string | null
  createdAt: Date
}

export type NewWaitlistEntry = {
  name: string
  place: string
  phone: string
  email: string | null
  photoUrl: string | null
  audioUrl: string | null
}
