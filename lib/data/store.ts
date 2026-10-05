import type {
  Activity,
  Device,
  GreywaterReading,
  GreywaterUnit,
  NewRiverReport,
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

  listActivities(): Promise<Activity[]>
  listStakeholders(): Promise<Stakeholder[]>

  findDeviceByKeyHash(keyHash: string): Promise<Device | null>
  touchDevice(deviceId: string): Promise<void>
}
