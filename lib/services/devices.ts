import { createHash } from 'node:crypto'

// Device keys are never stored in plain text. The database keeps only this hash.
export function hashDeviceKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

// Key for the simulated sensor in the demo. Real devices get their own keys.
export const DEMO_DEVICE_KEY = 'demo-device-key'
export const DEMO_DEVICE_ID = 'device-kawempe-school'
export const DEMO_DEVICE_TANK_ID = 'tank-kawempe-school'
