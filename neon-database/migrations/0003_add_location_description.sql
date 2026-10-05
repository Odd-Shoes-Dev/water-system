-- 0003_add_location_description.sql
-- Adds a written description of where a river report is, for example
-- "behind the big tree by the river". Run this once in Neon's SQL editor.
-- Safe to re-run: uses "if not exists".

alter table river_reports
  add column if not exists location_description text not null default '';
