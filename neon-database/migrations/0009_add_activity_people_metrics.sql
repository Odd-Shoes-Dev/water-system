-- 0009_add_activity_people_metrics.sql
-- Adds people reached, people employed and volunteers to community
-- activities — separate from the existing participants/youth_count, which
-- measure different things. Run this once in Neon's SQL editor, after 0001
-- through 0008. Safe to re-run: uses "if not exists".

alter table community_activities
  add column if not exists people_reached integer not null default 0,
  add column if not exists people_employed integer not null default 0,
  add column if not exists volunteers integer not null default 0;
