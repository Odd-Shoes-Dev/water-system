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

- **No real login yet.** The "Log in" link and `/login` currently redirect
  straight to `/dashboard` with no authentication at all. That means
  `/dashboard` (and everything under it: tanks, map, alerts, recycling,
  river watch, impact) is reachable by anyone who opens that URL directly,
  not only through the button.

  The planned replacement, once there's a reason to build it (real team
  members, not just this demo):
  - Sign in with **Google**, so no passwords are ever stored.
  - After Google confirms the person's identity, check their email against
    an allowlist kept in the database (a small `team_members`-style table).
    Not on the list → access denied with a clear message. On it → let them
    in. Nobody self-registers; an admin adds the email first.
  - This needs a Google Cloud OAuth app to be created first (only the
    project owner can do this), with its Client ID and Secret added as
    environment variables, the same pattern as the ImageKit keys.

  Until that's built:
  - The reporter's name on a submitted report is visible to anyone who
    opens its details modal.
  - Anyone can open a report's full details ("admin-style" click-through),
    not just a trusted viewer.
  - The waitlist form only returns a count publicly (by design), but once
    real login exists, an actual admin view of entries (with contact
    details) should sit behind it instead of the public count.
  - "Sign out" in the dashboard sidebar just links back to the public home
    page, since there's no session yet to end.

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
