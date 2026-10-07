-- 0004_multiple_report_photos.sql
-- Reports can now carry up to 10 photos instead of one. Run this once in
-- Neon's SQL editor. Safe to re-run: the column add is guarded, and the
-- migration step only runs while the old photo_url column still exists.

alter table river_reports
  add column if not exists photo_urls text[] not null default '{}';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'river_reports' and column_name = 'photo_url'
  ) then
    update river_reports
    set photo_urls = array[photo_url]
    where photo_url is not null and photo_urls = '{}';

    alter table river_reports drop column photo_url;
  end if;
end $$;
