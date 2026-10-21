-- 0007_add_team_members.sql
-- People who can sign in to the dashboard. Passwords are never stored in
-- plain text, only a salted scrypt hash (see lib/services/auth.ts). Nobody
-- self-registers: an admin adds each row via `npm run team:add`. Run this
-- once in Neon's SQL editor. Safe to re-run: uses "if not exists".

create table if not exists team_members (
  id bigserial primary key,
  email text not null unique,
  password_hash text not null,
  name text not null,
  created_at timestamptz not null default now()
);
