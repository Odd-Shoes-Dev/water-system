-- 0005_add_waitlist_email.sql
-- Adds an optional email to waitlist entries. Run this once in Neon's SQL
-- editor, after 0001 through 0004. Safe to re-run: uses "if not exists".

alter table waitlist_entries
  add column if not exists email text;
