// In-memory provider used when DATABASE_URL is not set. Data resets when the
// server restarts, which is fine for a demo.
import type { DataStore } from '@/lib/data/store'
import type { Activity, NewActivity, NewRiverReport, NewWaitlistEntry, RiverReport, WaitlistEntry } from '@/lib/data/types'
import { deriveActivityTitle } from '@/lib/services/activities'
import { buildSeed } from './seed'

export function createDemoStore(): DataStore {
  const seed = buildSeed()
  const tankReadings = [...seed.tankReadings]
  const rainfall = [...seed.rainfall]
  const greywaterReadings = [...seed.greywaterReadings]
  const reports = [...seed.reports]
  const activities = [...seed.activities]
  const devices = [...seed.devices]
  const waitlist = [...seed.waitlist]

  return {
    async listTanks() {
      return seed.tanks
    },
    async listTankReadings() {
      return tankReadings
    },
    async insertTankReadings(readings) {
      tankReadings.push(...readings)
    },

    async listRainfall() {
      return rainfall
    },
    async insertRainfall(readings) {
      rainfall.push(...readings)
    },

    async listGreywaterUnits() {
      return seed.greywaterUnits
    },
    async listGreywaterReadings() {
      return greywaterReadings
    },
    async insertGreywaterReadings(readings) {
      greywaterReadings.push(...readings)
    },

    async listRiverReports() {
      return reports
    },
    async createRiverReport(report: NewRiverReport) {
      const created: RiverReport = {
        ...report,
        id: reports.length + 1,
        status: 'open',
        createdAt: new Date(),
      }
      reports.push(created)
      return created
    },
    async updateRiverReportStatus(id, status) {
      const report = reports.find((r) => r.id === id)
      if (!report) return null
      report.status = status
      return report
    },

    async listActivities() {
      return activities
    },
    async createActivity(activity: NewActivity) {
      const created: Activity = {
        ...activity,
        id: activities.length + 1,
        title: deriveActivityTitle(activity.kind, activity.location),
        facilitiesCount: 0,
      }
      activities.push(created)
      return created
    },
    async listStakeholders() {
      return seed.stakeholders
    },

    async findDeviceByKeyHash(keyHash) {
      return devices.find((device) => device.keyHash === keyHash) ?? null
    },
    async touchDevice(deviceId) {
      const device = devices.find((d) => d.id === deviceId)
      if (device) device.lastSeenAt = new Date()
    },

    async createWaitlistEntry(entry: NewWaitlistEntry) {
      const created: WaitlistEntry = { ...entry, id: waitlist.length + 1, createdAt: new Date() }
      waitlist.push(created)
    },
    async countWaitlistEntries() {
      return waitlist.length
    },
  }
}
