// Neon (Postgres) provider. This is the only file that imports the Neon SDK.
// To switch databases, replace this file with one that implements DataStore.
import { neon } from '@neondatabase/serverless'
import type { DataStore } from '@/lib/data/store'
import type {
  Activity,
  Device,
  GreywaterReading,
  GreywaterUnit,
  NewRiverReport,
  NewWaitlistEntry,
  RainfallReading,
  ReportCategory,
  RiverReport,
  Stakeholder,
  Tank,
  TankReading,
} from '@/lib/data/types'

const BATCH_SIZE = 500

function batches<T>(items: T[]): T[][] {
  const result: T[][] = []
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    result.push(items.slice(i, i + BATCH_SIZE))
  }
  return result
}

export function createNeonStore(databaseUrl: string): DataStore {
  const sql = neon(databaseUrl)

  return {
    async listTanks(): Promise<Tank[]> {
      const rows = await sql`
        select id, name, site, latitude, longitude, capacity_litres, roof_area_m2
        from tanks
        order by name`
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        site: r.site,
        latitude: Number(r.latitude),
        longitude: Number(r.longitude),
        capacityLitres: Number(r.capacity_litres),
        roofAreaM2: Number(r.roof_area_m2),
      }))
    },

    async listTankReadings(): Promise<TankReading[]> {
      const rows = await sql`
        select tank_id, recorded_at, level_percent, litres_harvested, litres_used
        from tank_readings
        order by recorded_at`
      return rows.map((r) => ({
        tankId: r.tank_id,
        recordedAt: new Date(r.recorded_at),
        levelPercent: Number(r.level_percent),
        litresHarvested: Number(r.litres_harvested),
        litresUsed: Number(r.litres_used),
      }))
    },

    async insertTankReadings(readings: TankReading[]): Promise<void> {
      for (const batch of batches(readings)) {
        const payload = batch.map((r) => ({
          tank_id: r.tankId,
          recorded_at: r.recordedAt.toISOString(),
          level_percent: r.levelPercent,
          litres_harvested: r.litresHarvested,
          litres_used: r.litresUsed,
        }))
        await sql`
          insert into tank_readings (tank_id, recorded_at, level_percent, litres_harvested, litres_used)
          select tank_id, recorded_at, level_percent, litres_harvested, litres_used
          from jsonb_to_recordset(${JSON.stringify(payload)}::jsonb) as r(
            tank_id text, recorded_at timestamptz, level_percent numeric,
            litres_harvested numeric, litres_used numeric)
          on conflict (tank_id, recorded_at) do nothing`
      }
    },

    async listRainfall(): Promise<RainfallReading[]> {
      const rows = await sql`select site, recorded_at, rainfall_mm from rainfall_readings order by recorded_at`
      return rows.map((r) => ({
        site: r.site,
        recordedAt: new Date(r.recorded_at),
        rainfallMm: Number(r.rainfall_mm),
      }))
    },

    async insertRainfall(readings: RainfallReading[]): Promise<void> {
      for (const batch of batches(readings)) {
        const payload = batch.map((r) => ({
          site: r.site,
          recorded_at: r.recordedAt.toISOString(),
          rainfall_mm: r.rainfallMm,
        }))
        await sql`
          insert into rainfall_readings (site, recorded_at, rainfall_mm)
          select site, recorded_at, rainfall_mm
          from jsonb_to_recordset(${JSON.stringify(payload)}::jsonb) as r(
            site text, recorded_at timestamptz, rainfall_mm numeric)
          on conflict (site, recorded_at) do nothing`
      }
    },

    async listGreywaterUnits(): Promise<GreywaterUnit[]> {
      const rows = await sql`select id, name, site, status, latitude, longitude from greywater_units order by name`
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        site: r.site,
        status: r.status,
        latitude: Number(r.latitude),
        longitude: Number(r.longitude),
      }))
    },

    async listGreywaterReadings(): Promise<GreywaterReading[]> {
      const rows = await sql`
        select unit_id, recorded_at, litres_collected, litres_filtered, litres_reused, filter_pressure_kpa
        from greywater_readings
        order by recorded_at`
      return rows.map((r) => ({
        unitId: r.unit_id,
        recordedAt: new Date(r.recorded_at),
        litresCollected: Number(r.litres_collected),
        litresFiltered: Number(r.litres_filtered),
        litresReused: Number(r.litres_reused),
        filterPressureKpa: r.filter_pressure_kpa === null ? null : Number(r.filter_pressure_kpa),
      }))
    },

    async insertGreywaterReadings(readings: GreywaterReading[]): Promise<void> {
      for (const batch of batches(readings)) {
        const payload = batch.map((r) => ({
          unit_id: r.unitId,
          recorded_at: r.recordedAt.toISOString(),
          litres_collected: r.litresCollected,
          litres_filtered: r.litresFiltered,
          litres_reused: r.litresReused,
          filter_pressure_kpa: r.filterPressureKpa,
        }))
        await sql`
          insert into greywater_readings (unit_id, recorded_at, litres_collected, litres_filtered, litres_reused, filter_pressure_kpa)
          select unit_id, recorded_at, litres_collected, litres_filtered, litres_reused, filter_pressure_kpa
          from jsonb_to_recordset(${JSON.stringify(payload)}::jsonb) as r(
            unit_id text, recorded_at timestamptz, litres_collected numeric,
            litres_filtered numeric, litres_reused numeric, filter_pressure_kpa numeric)
          on conflict (unit_id, recorded_at) do nothing`
      }
    },

    async listRiverReports(): Promise<RiverReport[]> {
      const rows = await sql`
        select id, category, description, location_description, latitude, longitude, photo_urls, reporter_name, status, created_at
        from river_reports
        order by created_at desc`
      return rows.map(mapReport)
    },

    async createRiverReport(report: NewRiverReport): Promise<RiverReport> {
      const rows = await sql`
        insert into river_reports (category, description, location_description, latitude, longitude, photo_urls, reporter_name)
        values (${report.category}, ${report.description}, ${report.locationDescription}, ${report.latitude},
                ${report.longitude}, ${report.photoUrls}::text[], ${report.reporterName})
        returning id, category, description, location_description, latitude, longitude, photo_urls, reporter_name, status, created_at`
      return mapReport(rows[0])
    },

    async listActivities(): Promise<Activity[]> {
      const rows = await sql`
        select id, kind, title, occurred_on::text as occurred_on, youth_count, households_reached,
               facilities_count, trees_planted, participants
        from community_activities
        order by occurred_on desc`
      return rows.map((r) => ({
        id: Number(r.id),
        kind: r.kind,
        title: r.title,
        occurredOn: r.occurred_on,
        youthCount: Number(r.youth_count),
        householdsReached: Number(r.households_reached),
        facilitiesCount: Number(r.facilities_count),
        treesPlanted: Number(r.trees_planted),
        participants: Number(r.participants),
      }))
    },

    async listStakeholders(): Promise<Stakeholder[]> {
      const rows = await sql`
        select id, name, organisation_type, role, influence, interest, latitude, longitude
        from stakeholders
        order by name`
      return rows.map((r) => ({
        id: Number(r.id),
        name: r.name,
        organisationType: r.organisation_type,
        role: r.role,
        influence: Number(r.influence),
        interest: Number(r.interest),
        latitude: r.latitude === null ? null : Number(r.latitude),
        longitude: r.longitude === null ? null : Number(r.longitude),
      }))
    },

    async findDeviceByKeyHash(keyHash: string): Promise<Device | null> {
      const rows = await sql`
        select id, tank_id, key_hash, last_seen_at from devices where key_hash = ${keyHash} limit 1`
      const row = rows[0]
      if (!row) return null
      return {
        id: row.id,
        tankId: row.tank_id,
        keyHash: row.key_hash,
        lastSeenAt: row.last_seen_at ? new Date(row.last_seen_at) : null,
      }
    },

    async touchDevice(deviceId: string): Promise<void> {
      await sql`update devices set last_seen_at = now() where id = ${deviceId}`
    },

    async createWaitlistEntry(entry: NewWaitlistEntry): Promise<void> {
      await sql`
        insert into waitlist_entries (name, place, phone, email, photo_url, audio_url)
        values (${entry.name}, ${entry.place}, ${entry.phone}, ${entry.email}, ${entry.photoUrl}, ${entry.audioUrl})`
    },

    async countWaitlistEntries(): Promise<number> {
      const rows = await sql`select count(*)::int as count from waitlist_entries`
      return Number(rows[0]?.count ?? 0)
    },
  }
}

function mapReport(r: Record<string, any>): RiverReport {
  return {
    id: Number(r.id),
    category: r.category as ReportCategory,
    description: r.description,
    locationDescription: r.location_description ?? '',
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    photoUrls: r.photo_urls ?? [],
    reporterName: r.reporter_name ?? null,
    status: r.status,
    createdAt: new Date(r.created_at),
  }
}
