// Pretends to be a tank sensor. It sends one reading per interval to the app's
// /api/ingest endpoint, the same way a real device will.
//
// 1. Start the app:            npm run dev
// 2. In another terminal:      npm run simulate:device
//
// Options (environment variables):
//   APP_URL      default http://localhost:3000
//   DEVICE_KEY   default is the demo device key
//   INTERVAL_MS  time between readings, default 5000
import { sampleTanks } from '../lib/providers/database/sample-data'
import { createRng, simulateRainfall, stepTank, STARTING_LEVEL_PERCENT } from '../lib/providers/iot/simulator'
import { DEMO_DEVICE_KEY, DEMO_DEVICE_TANK_ID } from '../lib/services/devices'

const APP_URL = process.env.APP_URL ?? 'http://localhost:3000'
const DEVICE_KEY = process.env.DEVICE_KEY ?? DEMO_DEVICE_KEY
const INTERVAL_MS = Number(process.env.INTERVAL_MS ?? 5000)
const HOURS = 720

const tank = sampleTanks.find((t) => t.id === DEMO_DEVICE_TANK_ID)
if (!tank) throw new Error(`Tank ${DEMO_DEVICE_TANK_ID} not found in sample data`)

const rng = createRng(Date.now() % 100_000)
const rainfall = simulateRainfall(tank.site, new Date(), HOURS, rng)
let storedLitres = (tank.capacityLitres * STARTING_LEVEL_PERCENT) / 100

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  console.log(`Simulating ${tank!.name} → ${APP_URL}/api/ingest every ${INTERVAL_MS} ms`)

  for (let hour = 0; hour < HOURS; hour++) {
    const step = stepTank(tank!, storedLitres, rainfall[hour].rainfallMm, rng)
    storedLitres = step.storedLitres

    const response = await fetch(`${APP_URL}/api/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEVICE_KEY}`,
      },
      body: JSON.stringify({
        readings: [{ recordedAt: new Date().toISOString(), ...step.reading }],
      }),
    })

    const body = await response.text()
    console.log(
      `[${response.status}] level ${step.reading.levelPercent}% · harvested ${step.reading.litresHarvested} L · used ${step.reading.litresUsed} L ${response.ok ? '' : body}`,
    )
    await sleep(INTERVAL_MS)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
