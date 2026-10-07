-- 0003_add_waitlist.sql
-- A general interest list: name, place, phone number, and optional photo or
-- audio as evidence of interest. Run this once in Neon's SQL editor.
-- Safe to re-run: uses "if not exists".

create table if not exists waitlist_entries (
  id bigserial primary key,
  name text not null,
  place text not null,
  phone text not null,
  photo_url text,
  audio_url text,
  created_at timestamptz not null default now()
);
