// Password hashing for team member accounts. Passwords are never stored in
// plain text, only this salted scrypt hash — stronger than the bare SHA-256
// used for device keys in devices.ts, which is fine only because those are
// high-entropy random tokens, not human-chosen passwords.
import { randomBytes, scrypt, scryptSync, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt) as (password: string, salt: string, keylen: number) => Promise<Buffer>
const KEY_LENGTH = 64

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derived = await scryptAsync(password, salt, KEY_LENGTH)
  return `${salt}:${derived.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hashHex] = stored.split(':')
  if (!salt || !hashHex) return false
  const derived = await scryptAsync(password, salt, KEY_LENGTH)
  const expected = Buffer.from(hashHex, 'hex')
  return derived.length === expected.length && timingSafeEqual(derived, expected)
}

// Synchronous variant, used only for building fixed seed data at module load
// (lib/providers/database/seed.ts). Real signups/logins use the async form.
export function hashPasswordSync(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, KEY_LENGTH)
  return `${salt}:${derived.toString('hex')}`
}

// Credentials for the demo (no DATABASE_URL) environment, so it has
// something to log in with out of the box.
export const DEMO_TEAM_MEMBER_EMAIL = 'demo@rainandrenew.org'
export const DEMO_TEAM_MEMBER_PASSWORD = 'rainandrenew-demo'
export const DEMO_TEAM_MEMBER_NAME = 'Demo team member'
