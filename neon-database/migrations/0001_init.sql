-- 0001_init.sql
-- Creates the tables for Rain & Renew. Run this once in Neon's SQL editor.
-- Safe to re-run: every statement uses "if not exists".

create table if not exists tanks (
  id text primary key,
  name text not null,
  site text not null,
  latitude double precision not null,
  longitude double precision not null,
  capacity_litres integer not null check (capacity_litres > 0),
  roof_area_m2 numeric(8,2) not null check (roof_area_m2 > 0),
  created_at timestamptz not null default now()
);

create table if not exists tank_readings (
  id bigserial primary key,
  tank_id text not null references tanks (id),
  recorded_at timestamptz not null,
  level_percent numeric(5,1) not null check (level_percent between 0 and 100),
  litres_harvested numeric(10,1) not null default 0 check (litres_harvested >= 0),
  litres_used numeric(10,1) not null default 0 check (litres_used >= 0),
  unique (tank_id, recorded_at)
);
create index if not exists tank_readings_recorded_at_idx on tank_readings (recorded_at);

create table if not exists rainfall_readings (
  id bigserial primary key,
  site text not null,
  recorded_at timestamptz not null,
  rainfall_mm numeric(6,2) not null check (rainfall_mm >= 0),
  unique (site, recorded_at)
);

create table if not exists greywater_units (
  id text primary key,
  name text not null,
  site text not null,
  status text not null check (status in ('ok', 'filter_due', 'fault')),
  latitude double precision not null,
  longitude double precision not null
);

create table if not exists greywater_readings (
  id bigserial primary key,
  unit_id text not null references greywater_units (id),
  recorded_at timestamptz not null,
  litres_collected numeric(10,2) not null default 0,
  litres_filtered numeric(10,2) not null default 0,
  litres_reused numeric(10,2) not null default 0,
  filter_pressure_kpa numeric(6,1),
  unique (unit_id, recorded_at)
);

create table if not exists river_reports (
  id bigserial primary key,
  category text not null check (category in (
    'illegal_dumping', 'pollution_hotspot', 'blocked_drainage',
    'riverbank_degradation', 'clean_up', 'restoration')),
  description text not null default '',
  latitude double precision not null,
  longitude double precision not null,
  photo_url text,
  reporter_name text,
  status text not null default 'open' check (status in ('open', 'verified', 'resolved')),
  created_at timestamptz not null default now()
);

create table if not exists community_activities (
  id bigserial primary key,
  kind text not null check (kind in ('training', 'clean_up', 'restoration', 'household_adoption')),
  title text not null,
  occurred_on date not null,
  youth_count integer not null default 0,
  households_reached integer not null default 0,
  facilities_count integer not null default 0,
  trees_planted integer not null default 0,
  participants integer not null default 0
);

create table if not exists stakeholders (
  id bigserial primary key,
  name text not null,
  organisation_type text not null check (organisation_type in (
    'government', 'community', 'school', 'ngo', 'business', 'funder')),
  role text not null default '',
  influence integer not null check (influence between 1 and 5),
  interest integer not null check (interest between 1 and 5),
  latitude double precision,
  longitude double precision
);

-- Devices (sensors) authenticate with a key. Only a SHA-256 hash of the key is stored.
create table if not exists devices (
  id text primary key,
  tank_id text not null references tanks (id),
  key_hash text not null unique,
  last_seen_at timestamptz
);
