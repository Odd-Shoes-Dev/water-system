# Neon database

Migrations are plain SQL files. You run them yourself; the app never changes the schema.

## Files

| File | What it does |
|---|---|
| `migrations/0001_init.sql` | Creates all tables. Run first. |
| `migrations/0002_seed_demo.sql` | Adds simulated demo data (30 days of tank, rainfall and greywater readings, sample reports, activities, stakeholders and the demo device). Run second. Generated, do not edit by hand. |

## Running them

1. Open your project in the [Neon console](https://console.neon.tech) and go to **SQL Editor**.
2. Paste the contents of `0001_init.sql` and run it.
3. Paste the contents of `0002_seed_demo.sql` and run it.

Both files are safe to re-run; they skip anything that already exists.

## Regenerating the seed

If the sample data or the simulator changes, regenerate the seed file:

```bash
npm run db:generate-seed
```

Then run the new `0002_seed_demo.sql` in the SQL Editor. Remove the old demo rows first if you need an exact match.

## Connecting the app

Set `DATABASE_URL` to the Neon connection string (locally in `.env.local`, and in Vercel under **Project Settings → Environment Variables**). Without it, the app uses in-memory demo data.
