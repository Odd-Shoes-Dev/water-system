// Adds a team member who can sign in to the dashboard. Nobody self-registers
// (see docs/known-issues.md), so this is how an account gets created.
//
// Needs DATABASE_URL set (a real Neon database) — the in-memory demo store
// lives only inside the `next dev` process, so a row created by this script
// in a separate process wouldn't be visible to the running app. For local
// development without a database, sign in with the fixed demo account
// instead (see DEMO_TEAM_MEMBER_EMAIL/PASSWORD in lib/services/auth.ts).
//
// Usage: npm run team:add -- --email you@example.org --name "Your Name" --password "a strong password"
// (the "team:add" npm script passes --env-file=.env.local so DATABASE_URL is loaded)
import { createNeonStore } from '../lib/providers/database/neon'
import { hashPassword } from '../lib/services/auth'

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`)
  return index === -1 ? undefined : process.argv[index + 1]
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set. This script only writes to a real Neon database, see the comment above.')
  }

  const email = arg('email')
  const name = arg('name')
  const password = arg('password')
  if (!email || !name || !password) {
    throw new Error('Usage: npm run team:add -- --email you@example.org --name "Your Name" --password "..."')
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters.')
  }

  const store = createNeonStore(databaseUrl)
  const existing = await store.findTeamMemberByEmail(email)
  if (existing) {
    throw new Error(`A team member with email ${email} already exists.`)
  }

  const passwordHash = await hashPassword(password)
  const member = await store.createTeamMember({ email, name, passwordHash })
  console.log(`Created team member ${member.name} <${member.email}> (id ${member.id}).`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
