// Simulates the sensors that will eventually feed the system. It produces the
// same readings a real device would send, so the rest of the app behaves the
// same whether the data is simulated or real.
import type {
  GreywaterReading,
  GreywaterUnit,
  RainfallReading,
  Tank,
  TankReading,
} from '@/lib/data/types'

// Small seeded random generator (mulberry32). The same seed always gives the
// same readings, so the demo and the database seed match.
export function createRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const HOUR_MS = 3_600_000
const COLLECTION_EFFICIENCY = 0.8 // share of rain that reaches the tank from the roof

const round1 = (n: number) => Math.round(n * 10) / 10
const round2 = (n: number) => Math.round(n * 100) / 100

// Rain arrives in storms, mostly in the afternoon.
export function simulateRainfall(
  site: string,
  from: Date,
  hours: number,
  rng: () => number,
): RainfallReading[] {
  const readings: RainfallReading[] = []
  let stormHoursLeft = 0
  for (let h = 0; h < hours; h++) {
    const recordedAt = new Date(from.getTime() + h * HOUR_MS)
    const hour = recordedAt.getUTCHours()
    const stormChance = hour >= 14 && hour <= 20 ? 0.06 : 0.02
    if (stormHoursLeft === 0 && rng() < stormChance) {
      stormHoursLeft = 2 + Math.floor(rng() * 4)
    }
    let rainfallMm = 0
    if (stormHoursLeft > 0) {
      rainfallMm = round2(rng() * 4)
      stormHoursLeft--
    }
    readings.push({ site, recordedAt, rainfallMm })
  }
  return readings
}

// One hour of tank behaviour. Water flows in from the roof when it rains and
// out when the household uses it; the level is derived from those flows.
export function stepTank(
  tank: Tank,
  storedLitres: number,
  rainfallMm: number,
  rng: () => number,
): { storedLitres: number; reading: Omit<TankReading, 'tankId' | 'recordedAt'> } {
  const possibleInflow = rainfallMm * tank.roofAreaM2 * COLLECTION_EFFICIENCY
  const freeSpace = tank.capacityLitres - storedLitres
  const litresHarvested = Math.min(possibleInflow, freeSpace)
  const possibleUse = tank.capacityLitres * 0.0015 * (0.5 + rng())
  const litresUsed = Math.min(possibleUse, storedLitres + litresHarvested)
  const nextStored = storedLitres + litresHarvested - litresUsed
  return {
    storedLitres: nextStored,
    reading: {
      levelPercent: round1((nextStored / tank.capacityLitres) * 100),
      litresHarvested: round1(litresHarvested),
      litresUsed: round1(litresUsed),
    },
  }
}

export const STARTING_LEVEL_PERCENT = 50

export function simulateTankReadings(
  tank: Tank,
  rainfall: RainfallReading[],
  from: Date,
  rng: () => number,
): TankReading[] {
  let storedLitres = (tank.capacityLitres * STARTING_LEVEL_PERCENT) / 100
  return rainfall.map((rain, h) => {
    const step = stepTank(tank, storedLitres, rain.rainfallMm, rng)
    storedLitres = step.storedLitres
    return {
      tankId: tank.id,
      recordedAt: new Date(from.getTime() + h * HOUR_MS),
      ...step.reading,
    }
  })
}

export function simulateGreywaterReadings(
  unit: GreywaterUnit,
  from: Date,
  hours: number,
  rng: () => number,
): GreywaterReading[] {
  const readings: GreywaterReading[] = []
  for (let h = 0; h < hours; h++) {
    const collected = 0.3 + rng() * 0.4
    const filtered = collected * 0.95
    const reused = filtered * 0.7
    // Filter pressure creeps up as the filter loads, then the filter gets changed.
    const pressure = 20 + (h % 360) * 0.04 + rng() * 2
    readings.push({
      unitId: unit.id,
      recordedAt: new Date(from.getTime() + h * HOUR_MS),
      litresCollected: round2(collected),
      litresFiltered: round2(filtered),
      litresReused: round2(reused),
      filterPressureKpa: round1(pressure),
    })
  }
  return readings
}

// Converts a distance-to-water measurement from an ultrasonic sensor into a
// percentage. This is what the device would do before sending the reading.
export function distanceToLevelPercent(distanceCm: number, tankHeightCm: number): number {
  const level = ((tankHeightCm - distanceCm) / tankHeightCm) * 100
  return round1(Math.min(100, Math.max(0, level)))
}
