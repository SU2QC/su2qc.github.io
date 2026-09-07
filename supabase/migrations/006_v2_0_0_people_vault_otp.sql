begin;

-- v2 is forward-only: existing members and published materials remain intact.
create table if not exists public.member_emails (
  member_id uuid not null references public.members(id) on delete cascade,
  email text primary key,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint member_emails_lower_nonempty_check check (email = lower(email) and char_length(btrim(email)) > 0)
);

alter table public.member_emails enable row level security;
insert into public.member_emails (member_id, email, active)
select id, lower(btrim(email)), active from public.members
on conflict (email) do update set member_id = excluded.member_id, active = excluded.active;

alter table public.materials add column if not exists visibility text not null default 'library';
alter table public.materials add column if not exists updated_at timestamptz not null default now();
update public.materials set visibility = 'library' where visibility is null;
update public.materials set updated_at = created_at where updated_at is null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'materials_visibility_check_v2' and conrelid = 'public.materials'::regclass) then
    alter table public.materials add constraint materials_visibility_check_v2 check (visibility in ('library', 'vault'));
  end if;
end $$;

create index if not exists member_emails_member_id_idx on public.member_emails (member_id);
create index if not exists materials_visibility_status_idx on public.materials (visibility, status, updated_at desc);

create or replace function public.set_material_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists materials_set_updated_at on public.materials;
create trigger materials_set_updated_at before update on public.materials for each row execute function public.set_material_updated_at();

alter table public.members enable row level security;
alter table public.materials enable row level security;

drop policy if exists "members may view own record" on public.members;
drop policy if exists "public member display names" on public.members;
create policy "public member display names" on public.members for select to anon using (active);
create policy "members may view own record" on public.members for select to authenticated using (
  exists (select 1 from public.member_emails me where me.member_id = id and me.email = lower((select auth.jwt() ->> 'email')) and me.active)
);

drop policy if exists "public reads published materials" on public.materials;
drop policy if exists "active members read all materials" on public.materials;
drop policy if exists "approved members may insert materials" on public.materials;
drop policy if exists "owners manage materials" on public.materials;
drop policy if exists "owners delete materials" on public.materials;
create policy "public reads library materials" on public.materials for select to anon using (status = 'published' and visibility = 'library');
create policy "active members read all materials" on public.materials for select to authenticated using (
  exists (
    select 1 from public.member_emails me
    join public.members m on m.id = me.member_id
    where me.email = lower((select auth.jwt() ->> 'email')) and me.active and m.active
  )
);

revoke all on public.member_emails from anon, authenticated;
revoke all on public.members from anon, authenticated;
grant select (id, display_name) on public.members to anon;
grant select (id, display_name, role, active) on public.members to authenticated;
revoke all on public.materials from anon, authenticated;
grant select (id, member_id, title, description, citation_json, file_name, mime_type, status, visibility, created_at, updated_at) on public.materials to anon, authenticated;

drop view if exists public.materials_member;
drop view if exists public.materials_public;
create view public.materials_public with (security_invoker = true) as
select x.id, x.title, x.description, x.citation_json, x.file_name,
  case when x.mime_type = 'application/pdf' then 'PDF' when x.file_name ilike '%.key' then 'Keynote' else 'Research material' end as file_type,
  x.created_at, x.updated_at, m.display_name, x.visibility,
  ('/functions/v1/material-download?id=' || x.id)::text as download_url
from public.materials x join public.members m on m.id = x.member_id
where x.status = 'published' and x.visibility = 'library';

create view public.materials_member with (security_invoker = true) as
select x.id, x.title, x.description, x.citation_json, x.file_name, x.mime_type,
  case when x.mime_type = 'application/pdf' then 'PDF' when x.file_name ilike '%.key' then 'Keynote' else 'Research material' end as file_type,
  x.status, x.visibility, x.created_at, x.updated_at, m.display_name
from public.materials x join public.members m on m.id = x.member_id;

revoke all on public.materials_public, public.materials_member from anon, authenticated;
grant select on public.materials_public to anon, authenticated;
grant select on public.materials_member to authenticated;

drop policy if exists "approved uploads" on storage.objects;
drop policy if exists "approved member reads own objects" on storage.objects;
drop policy if exists "approved member deletes own objects" on storage.objects;
drop policy if exists "public downloads of published materials" on storage.objects;
create policy "approved uploads" on storage.objects for insert to authenticated with check (
  bucket_id = 'materials' and exists (
    select 1 from public.member_emails me join public.members m on m.id = me.member_id
    where m.id::text = split_part(name, '/', 1)
      and me.email = lower((select auth.jwt() ->> 'email')) and me.active and m.active
  )
);
create policy "approved member deletes own objects" on storage.objects for delete to authenticated using (
  bucket_id = 'materials' and exists (
    select 1 from public.member_emails me join public.members m on m.id = me.member_id
    where m.id::text = split_part(name, '/', 1)
      and me.email = lower((select auth.jwt() ->> 'email')) and me.active and m.active
  )
);

update storage.buckets set public = false, file_size_limit = 52428800 where id = 'materials';

commit;
