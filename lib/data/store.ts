import type {
  Activity,
  Device,
  EditRiverReport,
  GreywaterReading,
  GreywaterReadingWithId,
  GreywaterUnit,
  NewActivity,
  NewGreywaterUnit,
  NewRiverReport,
  NewTank,
  NewTeamMember,
  NewWaitlistEntry,
  RainfallReading,
  RiverReport,
  Stakeholder,
  Tank,
  TankReading,
  TeamMember,
} from './types'

// The only data interface the app uses. Each provider in lib/providers
// implements it, so changing database means writing one new provider.
export interface DataStore {
  listTanks(): Promise<Tank[]>
  createTank(tank: NewTank): Promise<Tank>
  updateTank(id: string, tank: NewTank): Promise<Tank | null>
  // Soft delete: keeps tank_readings history intact, just hides the tank
  // from listTanks(). See neon-database/migrations/0008_soft_delete_tanks_and_greywater.sql.
  deleteTank(id: string): Promise<void>
  listTankReadings(): Promise<TankReading[]>
  insertTankReadings(readings: TankReading[]): Promise<void>

  listRainfall(): Promise<RainfallReading[]>
  insertRainfall(readings: RainfallReading[]): Promise<void>

  listGreywaterUnits(): Promise<GreywaterUnit[]>
  createGreywaterUnit(unit: NewGreywaterUnit): Promise<GreywaterUnit>
  updateGreywaterUnit(id: string, unit: NewGreywaterUnit): Promise<GreywaterUnit | null>
  deleteGreywaterUnit(id: string): Promise<void>
  listGreywaterReadings(): Promise<GreywaterReadingWithId[]>
  insertGreywaterReadings(readings: GreywaterReading[]): Promise<void>
  updateGreywaterReading(
    id: number,
    patch: Pick<GreywaterReading, 'litresCollected' | 'litresFiltered' | 'litresReused'>,
  ): Promise<GreywaterReadingWithId | null>
  deleteGreywaterReading(id: number): Promise<void>

  listRiverReports(): Promise<RiverReport[]>
  createRiverReport(report: NewRiverReport): Promise<RiverReport>
  // Dashboard-only action, protected by proxy.ts.
  updateRiverReportStatus(id: number, status: RiverReport['status']): Promise<RiverReport | null>
  updateRiverReport(id: number, patch: EditRiverReport): Promise<RiverReport | null>
  deleteRiverReport(id: number): Promise<void>

  listActivities(): Promise<Activity[]>
  createActivity(activity: NewActivity): Promise<Activity>
  listStakeholders(): Promise<Stakeholder[]>

  findDeviceByKeyHash(keyHash: string): Promise<Device | null>
  touchDevice(deviceId: string): Promise<void>

  // Only a count is exposed to the app; names and phone numbers are never
  // listed back out, since this is personal data.
  createWaitlistEntry(entry: NewWaitlistEntry): Promise<void>
  countWaitlistEntries(): Promise<number>

  findTeamMemberByEmail(email: string): Promise<TeamMember | null>
  createTeamMember(member: NewTeamMember): Promise<TeamMember>
}
