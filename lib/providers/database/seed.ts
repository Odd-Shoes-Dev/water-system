// Builds the simulated history used by the demo and by the Neon seed file.
// The fixed start date and seeded random numbers make the output identical
// every time, so the demo and the database always show the same figures.
import type {
  Activity,
  Device,
  GreywaterReading,
  GreywaterUnit,
  RainfallReading,
  RiverReport,
  Stakeholder,
  Tank,
  TankReading,
  WaitlistEntry,
} from '@/lib/data/types'
import {
  createRng,
  simulateGreywaterReadings,
  simulateRainfall,
  simulateTankReadings,
} from '@/lib/providers/iot/simulator'
import { hashDeviceKey, DEMO_DEVICE_ID, DEMO_DEVICE_KEY, DEMO_DEVICE_TANK_ID } from '@/lib/services/devices'
import {
  SITES,
  sampleActivities,
  sampleGreywaterUnits,
  sampleReports,
  sampleStakeholders,
  sampleTanks,
  sampleWaitlist,
} from './sample-data'

export const SEED_START = new Date('2026-09-05T00:00:00Z')
export const SEED_HOURS = 30 * 24

export type SeedData = {
  tanks: Tank[]
  tankReadings: TankReading[]
  rainfall: RainfallReading[]
  greywaterUnits: GreywaterUnit[]
  greywaterReadings: GreywaterReading[]
  reports: RiverReport[]
  activities: Activity[]
  stakeholders: Stakeholder[]
  devices: Device[]
  waitlist: WaitlistEntry[]
}

export function buildSeed(): SeedData {
  const rainfall = SITES.flatMap((site, index) =>
    simulateRainfall(site, SEED_START, SEED_HOURS, createRng(100 + index)),
  )

  const tankReadings = sampleTanks.flatMap((tank, index) => {
    const siteRain = rainfall.filter((r) => r.site === tank.site)
    return simulateTankReadings(tank, siteRain, SEED_START, createRng(200 + index))
  })

  const greywaterReadings = sampleGreywaterUnits.flatMap((unit, index) =>
    simulateGreywaterReadings(unit, SEED_START, SEED_HOURS, createRng(300 + index)),
  )

  const reportDate = new Date('2026-09-01T09:00:00Z')
  const reports: RiverReport[] = sampleReports.map((report, index) => ({
    ...report,
    locationDescription: 'Sample location, alongside the river',
    id: index + 1,
    createdAt: new Date(reportDate.getTime() + index * 86_400_000),
  }))

  const activities: Activity[] = sampleActivities.map((activity, index) => ({
    ...activity,
    id: index + 1,
  }))

  const stakeholders: Stakeholder[] = sampleStakeholders.map((stakeholder, index) => ({
    ...stakeholder,
    id: index + 1,
  }))

  const waitlistDate = new Date('2026-08-25T09:00:00Z')
  const waitlist: WaitlistEntry[] = sampleWaitlist.map((entry, index) => ({
    ...entry,
    id: index + 1,
    createdAt: new Date(waitlistDate.getTime() + index * 86_400_000),
  }))

  const devices: Device[] = [
    {
      id: DEMO_DEVICE_ID,
      tankId: DEMO_DEVICE_TANK_ID,
      keyHash: hashDeviceKey(DEMO_DEVICE_KEY),
      lastSeenAt: null,
    },
  ]

  return {
    tanks: sampleTanks,
    tankReadings,
    rainfall,
    greywaterUnits: sampleGreywaterUnits,
    greywaterReadings,
    reports,
    activities,
    stakeholders,
    devices,
    waitlist,
  }
}
