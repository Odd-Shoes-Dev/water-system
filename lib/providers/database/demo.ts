// In-memory provider used when DATABASE_URL is not set. Data resets when the
// server restarts, which is fine for a demo.
import type { DataStore } from '@/lib/data/store'
import type {
  Activity,
  EditRiverReport,
  GreywaterReadingWithId,
  GreywaterUnit,
  NewActivity,
  NewGreywaterUnit,
  NewRiverReport,
  NewTank,
  NewTeamMember,
  NewWaitlistEntry,
  RiverReport,
  Tank,
  TankReadingWithId,
  TeamMember,
  WaitlistEntry,
} from '@/lib/data/types'
import { deriveActivityTitle } from '@/lib/services/activities'
import { slugId } from '@/lib/services/slug'
import { buildSeed } from './seed'

export function createDemoStore(): DataStore {
  const seed = buildSeed()
  const tanks = [...seed.tanks]
  const deletedTankIds = new Set<string>()
  let nextTankReadingId = 1
  const tankReadings: TankReadingWithId[] = seed.tankReadings.map((r) => ({ ...r, id: nextTankReadingId++ }))
  const rainfall = [...seed.rainfall]
  const greywaterUnits = [...seed.greywaterUnits]
  const deletedGreywaterUnitIds = new Set<string>()
  let nextReadingId = 1
  const greywaterReadings: GreywaterReadingWithId[] = seed.greywaterReadings.map((r) => ({
    ...r,
    id: nextReadingId++,
  }))
  const reports = [...seed.reports]
  const activities = [...seed.activities]
  const devices = [...seed.devices]
  const waitlist = [...seed.waitlist]
  const teamMembers = [...seed.teamMembers]

  return {
    async listTanks() {
      return tanks.filter((t) => !deletedTankIds.has(t.id))
    },
    async createTank(tank: NewTank) {
      const created: Tank = { ...tank, id: slugId('tank', tank.name) }
      tanks.push(created)
      return created
    },
    async updateTank(id, tank: NewTank) {
      const index = tanks.findIndex((t) => t.id === id)
      if (index === -1) return null
      tanks[index] = { ...tank, id }
      return tanks[index]
    },
    async deleteTank(id) {
      deletedTankIds.add(id)
    },
    async listTankReadings() {
      return tankReadings
    },
    async insertTankReadings(readings) {
      tankReadings.push(...readings.map((r) => ({ ...r, id: nextTankReadingId++ })))
    },
    async updateTankReading(id, patch) {
      const reading = tankReadings.find((r) => r.id === id)
      if (!reading) return null
      Object.assign(reading, patch)
      return reading
    },
    async deleteTankReading(id) {
      const index = tankReadings.findIndex((r) => r.id === id)
      if (index !== -1) tankReadings.splice(index, 1)
    },

    async listRainfall() {
      return rainfall
    },
    async insertRainfall(readings) {
      rainfall.push(...readings)
    },

    async listGreywaterUnits() {
      return greywaterUnits.filter((u) => !deletedGreywaterUnitIds.has(u.id))
    },
    async createGreywaterUnit(unit: NewGreywaterUnit) {
      const created: GreywaterUnit = { ...unit, id: slugId('greywater', unit.name), status: 'ok' }
      greywaterUnits.push(created)
      return created
    },
    async updateGreywaterUnit(id, unit: NewGreywaterUnit) {
      const index = greywaterUnits.findIndex((u) => u.id === id)
      if (index === -1) return null
      greywaterUnits[index] = { ...unit, id, status: greywaterUnits[index].status }
      return greywaterUnits[index]
    },
    async deleteGreywaterUnit(id) {
      deletedGreywaterUnitIds.add(id)
    },
    async listGreywaterReadings() {
      return greywaterReadings
    },
    async insertGreywaterReadings(readings) {
      greywaterReadings.push(...readings.map((r) => ({ ...r, id: nextReadingId++ })))
    },
    async updateGreywaterReading(id, patch) {
      const reading = greywaterReadings.find((r) => r.id === id)
      if (!reading) return null
      Object.assign(reading, patch)
      return reading
    },
    async deleteGreywaterReading(id) {
      const index = greywaterReadings.findIndex((r) => r.id === id)
      if (index !== -1) greywaterReadings.splice(index, 1)
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
    async updateRiverReport(id, patch: EditRiverReport) {
      const report = reports.find((r) => r.id === id)
      if (!report) return null
      Object.assign(report, patch)
      return report
    },
    async deleteRiverReport(id) {
      const index = reports.findIndex((r) => r.id === id)
      if (index !== -1) reports.splice(index, 1)
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
    async updateActivity(id, patch: NewActivity) {
      const activity = activities.find((a) => a.id === id)
      if (!activity) return null
      Object.assign(activity, patch, { title: deriveActivityTitle(patch.kind, patch.location) })
      return activity
    },
    async deleteActivity(id) {
      const index = activities.findIndex((a) => a.id === id)
      if (index !== -1) activities.splice(index, 1)
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

    async findTeamMemberByEmail(email) {
      return teamMembers.find((m) => m.email.toLowerCase() === email.toLowerCase()) ?? null
    },
    async createTeamMember(member: NewTeamMember) {
      const created: TeamMember = { ...member, id: teamMembers.length + 1, createdAt: new Date() }
      teamMembers.push(created)
      return created
    },
  }
}
