-- 0010_tank_capacity_optional.sql
-- Capacity and roof area became optional on the "Add tank" form (default 0
-- when left blank), but the original check (x > 0) constraints from
-- 0001_init.sql were never relaxed to match, so a tank with either field
-- left blank fails to save with a 502. Run this once in Neon's SQL editor.
-- Safe to re-run: drops before re-adding.

alter table tanks drop constraint if exists tanks_capacity_litres_check;
alter table tanks add constraint tanks_capacity_litres_check check (capacity_litres >= 0);

alter table tanks drop constraint if exists tanks_roof_area_m2_check;
alter table tanks add constraint tanks_roof_area_m2_check check (roof_area_m2 >= 0);
