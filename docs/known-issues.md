# Known issues and deferred work

Things identified during the build that are deliberately left for later. Not
urgent for the demo, but worth doing before this goes further than a pilot.

## Security and abuse protection

- **No rate limiting on the open forms.** `/api/reports`, `/api/waitlist` and
  `/api/ingest` all accept requests from anyone, with nothing to stop
  repeated or automated submissions. Needs a rate limit (for example, by IP
  or a simple token bucket) before these are exposed to the public at scale.
- **One shared demo device key.** The sensor simulator and the ingest
  endpoint currently use a single demo key
  (`lib/services/devices.ts`). Each real sensor should be issued its own
  key, so a compromised or decommissioned device can be revoked without
  affecting the others. Needs a way to generate and manage per-device keys
  (likely a small admin tool once there's a login).

## Data freshness

- **Seed data has fixed dates.** The simulated history, in
  `lib/providers/database/seed.ts` and in `neon-database/seed-demo.sql` if
  you've generated it (see `neon-database/README.md`), is anchored to
  September 2026. The
  "last 7 days" and "last 30 days" figures on the Streams page will drift
  toward zero as real time moves past that window. Either re-seed
  periodically with recent dates, or change the seed to generate relative
  to "now" each time it's built.

## Access control

- **Real login exists now: email + password.** `/login` checks credentials
  against a `team_members` table (`neon-database/migrations/0007_add_team_members.sql`),
  passwords are salted-scrypt hashed (`lib/services/auth.ts`), and sessions
  are a signed, stateless cookie verified by `proxy.ts` on every
  `/dashboard/*` request. Nobody self-registers — accounts are created with
  `npm run team:add` (needs `DATABASE_URL`; the in-memory demo store seeds
  one fixed demo account instead, see `DEMO_TEAM_MEMBER_EMAIL`/`PASSWORD` in
  `lib/services/auth.ts`).

  **Google sign-in is still the longer-term plan**, once there's a reason to
  build it (more team members than one or two, or a wish to avoid managing
  passwords at all):
  - Sign in with **Google**, so no passwords are stored at all.
  - After Google confirms the person's identity, check their email against
    an allowlist (the `team_members` table could gain a `google_sub` column,
    or it's replaced outright). Not on the list → access denied with a clear
    message. On it → let them in.
  - This needs a Google Cloud OAuth app to be created first (only the
    project owner can do this), with its Client ID and Secret added as
    environment variables, the same pattern as the ImageKit keys.

  Still true even with real login in place:
  - The reporter's name on a submitted report is visible to anyone who
    opens its details modal — now at least that requires being signed in.
  - Anyone signed in can open a report's full details ("admin-style"
    click-through); there's no finer-grained role system yet.
  - The waitlist form only returns a count publicly (by design), but a real
    admin view of entries (with contact details) should sit behind login
    instead of the public count — not built yet.
  - Two write endpoints meant to be team-only aren't actually protected by
    `proxy.ts` (it only covers page routes under `/dashboard`):
    `PATCH /api/reports/[id]/status` (marking a report resolved) and
    `POST /api/activities` (logging a restoration activity). Both still work
    for anyone who calls them directly, not just from the dashboard UI.
  - No password reset flow, no rate limiting on login attempts, and no
    CSRF token beyond the cookie's `SameSite=Lax`.

## Accessibility

- **Not yet reviewed.** Known gaps to check:
  - The Leaflet maps (reports map, stakeholder map, report detail mini-map)
    need meaningful text alternatives for screen reader users, since map
    tiles and markers aren't inherently accessible.
  - The report category colors (`markerColors` in `app/reports/page.tsx`)
    haven't been checked for contrast or color-blind distinguishability.

## Deployment configuration

- **Confirm Vercel environment variables.** `.env.local` only applies
  locally. `DATABASE_URL` and the ImageKit variables
  (`IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`,
  `IMAGEKIT_APP_FOLDER`) need to be added separately in the Vercel
  project's Settings → Environment Variables, and the deployment
  redeployed, before uploads or the database will work in production. This
  was the exact cause of the "File uploads are not set up yet" error seen
  earlier in testing.
