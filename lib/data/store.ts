import type {
  Activity,
  Device,
  GreywaterReading,
  GreywaterUnit,
  NewActivity,
  NewRiverReport,
  NewWaitlistEntry,
  RainfallReading,
  RiverReport,
  Stakeholder,
  Tank,
  TankReading,
} from './types'

// The only data interface the app uses. Each provider in lib/providers
// implements it, so changing database means writing one new provider.
export interface DataStore {
  listTanks(): Promise<Tank[]>
  listTankReadings(): Promise<TankReading[]>
  insertTankReadings(readings: TankReading[]): Promise<void>

  listRainfall(): Promise<RainfallReading[]>
  insertRainfall(readings: RainfallReading[]): Promise<void>

  listGreywaterUnits(): Promise<GreywaterUnit[]>
  listGreywaterReadings(): Promise<GreywaterReading[]>
  insertGreywaterReadings(readings: GreywaterReading[]): Promise<void>

  listRiverReports(): Promise<RiverReport[]>
  createRiverReport(report: NewRiverReport): Promise<RiverReport>
  // Dashboard-only action: there's no login yet to restrict this to the
  // team, see docs/known-issues.md.
  updateRiverReportStatus(id: number, status: RiverReport['status']): Promise<RiverReport | null>

  listActivities(): Promise<Activity[]>
  createActivity(activity: NewActivity): Promise<Activity>
  listStakeholders(): Promise<Stakeholder[]>

  findDeviceByKeyHash(keyHash: string): Promise<Device | null>
  touchDevice(deviceId: string): Promise<void>

  // Only a count is exposed to the app; names and phone numbers are never
  // listed back out, since this is personal data.
  createWaitlistEntry(entry: NewWaitlistEntry): Promise<void>
  countWaitlistEntries(): Promise<number>
}
