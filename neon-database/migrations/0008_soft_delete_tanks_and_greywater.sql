-- 0008_soft_delete_tanks_and_greywater.sql
-- Lets a tank or greywater system be "deleted" from the dashboard without
-- losing its reading history: tank_readings/greywater_readings reference
-- their parent by id, so a hard delete would either violate that foreign
-- key or cascade-wipe real sensor history. Deleting just sets this column;
-- listTanks()/listGreywaterUnits() filter it out. Run this once in Neon's
-- SQL editor. Safe to re-run: uses "if not exists".

alter table tanks add column if not exists deleted_at timestamptz;
alter table greywater_units add column if not exists deleted_at timestamptz;
