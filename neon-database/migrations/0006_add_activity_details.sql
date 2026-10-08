-- 0006_add_activity_details.sql
-- Adds the fields needed for a per-activity feed: location, description,
-- waste collected, area restored, and photos. Run this once in Neon's SQL
-- editor, after 0001 through 0004. Safe to re-run: uses "if not exists".

alter table community_activities
  add column if not exists location text not null default '',
  add column if not exists description text not null default '',
  add column if not exists waste_collected_kg numeric(8,1) not null default 0,
  add column if not exists area_restored_m2 numeric(10,1) not null default 0,
  add column if not exists photo_urls text[] not null default '{}';
