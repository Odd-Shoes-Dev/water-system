# Neon database

Migrations are plain SQL files. You run them yourself; the app never changes the schema.

## Files

| File | What it does |
|---|---|
| `migrations/0001_init.sql` | Creates all tables. |
| `migrations/0002_add_location_description.sql` | Adds a written description of where a river report is. |
| `migrations/0003_add_waitlist.sql` | Adds the waitlist_entries table. |
| `migrations/0004_multiple_report_photos.sql` | Lets a report carry up to 10 photos instead of one. |
| `migrations/0005_add_waitlist_email.sql` | Adds an optional email to waitlist entries. |
| `migrations/0006_add_activity_details.sql` | Adds location, description, waste collected and area restored to activities, so each one can carry its own story instead of only totals. |
| `migrations/0007_add_team_members.sql` | Adds the team_members table, for dashboard sign-in. |
| `migrations/0008_soft_delete_tanks_and_greywater.sql` | Adds a deleted_at column to tanks and greywater_units, so deleting one from the dashboard hides it without losing its reading history. |
| `migrations/0009_add_activity_people_metrics.sql` | Adds people_reached, people_employed and volunteers to community_activities. |

Run these in order, `0001` through `0009`. Each one only depends on the ones
before it, so running them in file order is always safe.

There's no seed-data migration here, by design: seed data needs the *final*
schema, so it can never be safely numbered into the middle of this sequence,
it would depend on files that haven't run yet. See "Adding demo data" below
if you want some.

All nine files are safe to re-run; they skip anything that already exists.

## Dashboard sign-in

After running `0007_add_team_members.sql`, create your own login with:

```bash
npm run team:add -- --email you@example.org --name "Your Name" --password "a strong password"
```

Nobody self-registers through the UI; accounts are only ever added this way.

## Adding demo data

The database starts empty. If you want simulated demo data (30 days of tank,
rainfall and greywater readings, sample reports, activities, stakeholders,
waitlist entries, the demo device and a demo team member), generate it after
running all nine migrations above:

```bash
npm run db:generate-seed
```

This writes `neon-database/seed-demo.sql` (not in `migrations/`, since it
isn't a migration). Paste its contents into the SQL Editor and run it last.
Regenerate and re-run it any time the sample data or simulator changes.

## Connecting the app

Set `DATABASE_URL` to the Neon connection string (locally in `.env.local`, and in Vercel under **Project Settings → Environment Variables**). Without it, the app uses in-memory demo data.
