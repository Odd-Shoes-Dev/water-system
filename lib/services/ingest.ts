// Handles readings sent by sensors. Each device authenticates with its own key,
// so one device can be revoked without affecting the others.
import type { DataStore } from '@/lib/data/store'
import type { TankReading } from '@/lib/data/types'
import { hashDeviceKey } from './devices'

export type IngestResult =
  | { ok: true; accepted: number }
  | { ok: false; status: 400 | 401; error: string }

type IncomingReading = {
  recordedAt: string
  levelPercent: number
  litresHarvested: number
  litresUsed: number
}

function isValidReading(value: unknown): value is IncomingReading {
  if (!value || typeof value !== 'object') return false
  const r = value as Record<string, unknown>
  return (
    typeof r.recordedAt === 'string' &&
    !Number.isNaN(Date.parse(r.recordedAt)) &&
    typeof r.levelPercent === 'number' &&
    r.levelPercent >= 0 &&
    r.levelPercent <= 100 &&
    typeof r.litresHarvested === 'number' &&
    r.litresHarvested >= 0 &&
    typeof r.litresUsed === 'number' &&
    r.litresUsed >= 0
  )
}

export async function ingestTankReadings(
  store: DataStore,
  authorization: string | null,
  body: unknown,
): Promise<IngestResult> {
  const key = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
  if (!key) return { ok: false, status: 401, error: 'Missing device key' }

  const device = await store.findDeviceByKeyHash(hashDeviceKey(key))
  if (!device) return { ok: false, status: 401, error: 'Unknown device key' }

  const incoming = (body as { readings?: unknown })?.readings
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return { ok: false, status: 400, error: 'Expected a non-empty "readings" array' }
  }
  if (!incoming.every(isValidReading)) {
    return { ok: false, status: 400, error: 'Each reading needs recordedAt, levelPercent (0-100), litresHarvested and litresUsed' }
  }

  const readings: TankReading[] = incoming.map((r) => ({
    tankId: device.tankId,
    recordedAt: new Date(r.recordedAt),
    levelPercent: r.levelPercent,
    litresHarvested: r.litresHarvested,
    litresUsed: r.litresUsed,
  }))

  await store.insertTankReadings(readings)
  await store.touchDevice(device.id)
  return { ok: true, accepted: readings.length }
}
