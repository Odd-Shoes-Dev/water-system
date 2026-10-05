// Home-screen impact figures. Every number is calculated from stored data.
import type { DataStore } from '@/lib/data/store'

export type ImpactSummary = {
  rainwaterHarvestedL: number
  greywaterRecycledL: number
  waterReusedL: number
  treesGardensSupported: number
  pollutionReports: number
  cleanUpsConducted: number
  youthEngaged: number
  householdsReached: number
}

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

export async function getImpactSummary(store: DataStore): Promise<ImpactSummary> {
  const [tankReadings, greywaterReadings, reports, activities] = await Promise.all([
    store.listTankReadings(),
    store.listGreywaterReadings(),
    store.listRiverReports(),
    store.listActivities(),
  ])

  return {
    rainwaterHarvestedL: Math.round(sum(tankReadings.map((r) => r.litresHarvested))),
    greywaterRecycledL: Math.round(sum(greywaterReadings.map((r) => r.litresReused))),
    waterReusedL: Math.round(sum(tankReadings.map((r) => r.litresUsed))),
    treesGardensSupported: sum(activities.map((a) => a.treesPlanted)),
    pollutionReports: reports.length,
    cleanUpsConducted: activities.filter((a) => a.kind === 'clean_up').length,
    youthEngaged: sum(activities.map((a) => a.youthCount)),
    householdsReached: sum(activities.map((a) => a.householdsReached)),
  }
}
