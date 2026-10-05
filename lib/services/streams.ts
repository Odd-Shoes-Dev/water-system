// Summaries for the Streams page: one section per data stream.
import type { DataStore } from '@/lib/data/store'
import { REPORT_CATEGORIES, type ReportCategory } from '@/lib/data/types'

const DAY_MS = 86_400_000

export type TankSummary = {
  id: string
  name: string
  site: string
  capacityLitres: number
  latestLevelPercent: number | null
  harvestedLast30Days: number
  usedLast30Days: number
}

export type GreywaterSummary = {
  id: string
  name: string
  site: string
  status: string
  latestPressureKpa: number | null
  reusedLast30Days: number
}

export type RainfallSummary = { site: string; last7DaysMm: number }

export type StreamsOverview = {
  tanks: TankSummary[]
  greywater: GreywaterSummary[]
  rainfall: RainfallSummary[]
  reportCounts: { category: ReportCategory; label: string; count: number }[]
  activityCounts: { youthTrained: number; clean_ups: number; trees: number }
}

export async function getStreamsOverview(store: DataStore): Promise<StreamsOverview> {
  const [tanks, tankReadings, greywaterUnits, greywaterReadings, rainfall, reports, activities] =
    await Promise.all([
      store.listTanks(),
      store.listTankReadings(),
      store.listGreywaterUnits(),
      store.listGreywaterReadings(),
      store.listRainfall(),
      store.listRiverReports(),
      store.listActivities(),
    ])

  const latest = <T extends { recordedAt: Date }>(rows: T[]) =>
    rows.reduce<T | null>((best, row) => (!best || row.recordedAt > best.recordedAt ? row : best), null)

  const now = Date.now()
  const last30 = (date: Date) => now - date.getTime() <= 30 * DAY_MS
  const last7 = (date: Date) => now - date.getTime() <= 7 * DAY_MS

  const tankSummaries: TankSummary[] = tanks.map((tank) => {
    const readings = tankReadings.filter((r) => r.tankId === tank.id)
    const recent = readings.filter((r) => last30(r.recordedAt))
    return {
      id: tank.id,
      name: tank.name,
      site: tank.site,
      capacityLitres: tank.capacityLitres,
      latestLevelPercent: latest(readings)?.levelPercent ?? null,
      harvestedLast30Days: Math.round(recent.reduce((t, r) => t + r.litresHarvested, 0)),
      usedLast30Days: Math.round(recent.reduce((t, r) => t + r.litresUsed, 0)),
    }
  })

  const greywaterSummaries: GreywaterSummary[] = greywaterUnits.map((unit) => {
    const readings = greywaterReadings.filter((r) => r.unitId === unit.id)
    const recent = readings.filter((r) => last30(r.recordedAt))
    return {
      id: unit.id,
      name: unit.name,
      site: unit.site,
      status: unit.status,
      latestPressureKpa: latest(readings)?.filterPressureKpa ?? null,
      reusedLast30Days: Math.round(recent.reduce((t, r) => t + r.litresReused, 0)),
    }
  })

  const sites = [...new Set(rainfall.map((r) => r.site))]
  const rainfallSummaries: RainfallSummary[] = sites.map((site) => ({
    site,
    last7DaysMm: Math.round(
      rainfall
        .filter((r) => r.site === site && last7(r.recordedAt))
        .reduce((t, r) => t + r.rainfallMm, 0) * 10,
    ) / 10,
  }))

  const reportCounts = (Object.keys(REPORT_CATEGORIES) as ReportCategory[]).map((category) => ({
    category,
    label: REPORT_CATEGORIES[category],
    count: reports.filter((r) => r.category === category).length,
  }))

  return {
    tanks: tankSummaries,
    greywater: greywaterSummaries,
    rainfall: rainfallSummaries,
    reportCounts,
    activityCounts: {
      youthTrained: activities.filter((a) => a.kind === 'training').reduce((t, a) => t + a.youthCount, 0),
      clean_ups: activities.filter((a) => a.kind === 'clean_up').length,
      trees: activities.reduce((t, a) => t + a.treesPlanted, 0),
    },
  }
}
