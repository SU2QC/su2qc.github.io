begin;

create extension if not exists pgcrypto;

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  display_name text not null,
  role text not null default 'member',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint members_email_lower_nonempty_check check (email = lower(email) and char_length(btrim(email)) > 0),
  constraint members_role_check_v2 check (role in ('admin','member'))
);

alter table public.members add column if not exists id uuid default gen_random_uuid();
alter table public.members add column if not exists email text;
alter table public.members add column if not exists display_name text;
alter table public.members add column if not exists role text default 'member';
alter table public.members add column if not exists active boolean default true;
alter table public.members add column if not exists created_at timestamptz default now();
alter table public.members alter column id set default gen_random_uuid();
alter table public.members alter column email set not null;
alter table public.members alter column display_name set not null;
alter table public.members alter column role set not null;
alter table public.members alter column active set not null;
alter table public.members alter column created_at set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'members_email_lower_nonempty_check_v2' and conrelid = 'public.members'::regclass) then
    alter table public.members add constraint members_email_lower_nonempty_check_v2 check (email = lower(email) and char_length(btrim(email)) > 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'members_role_check_v2' and conrelid = 'public.members'::regclass) then
    alter table public.members add constraint members_role_check_v2 check (role in ('admin','member'));
  end if;
end $$;

create unique index if not exists members_email_lower_unique_idx on public.members (lower(email));

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id),
  title text not null,
  description text not null default '',
  bibtex text,
  citation_json jsonb,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  constraint materials_title_check_v2 check (char_length(title) between 1 and 180),
  constraint materials_description_check_v2 check (char_length(description) <= 2000),
  constraint materials_size_check_v2 check (size_bytes between 0 and 52428800),
  constraint materials_status_check_v2 check (status in ('draft','published','archived'))
);

alter table public.materials add column if not exists id uuid default gen_random_uuid();
alter table public.materials add column if not exists member_id uuid;
alter table public.materials add column if not exists title text;
alter table public.materials add column if not exists description text default '';
alter table public.materials add column if not exists bibtex text;
alter table public.materials add column if not exists citation_json jsonb;
alter table public.materials add column if not exists storage_path text;
alter table public.materials add column if not exists file_name text;
alter table public.materials add column if not exists mime_type text;
alter table public.materials add column if not exists size_bytes bigint;
alter table public.materials add column if not exists status text default 'published';
alter table public.materials add column if not exists created_at timestamptz default now();
alter table public.materials alter column id set default gen_random_uuid();
alter table public.materials alter column member_id set not null;
alter table public.materials alter column title set not null;
alter table public.materials alter column description set default '';
alter table public.materials alter column description set not null;
alter table public.materials alter column storage_path set not null;
alter table public.materials alter column file_name set not null;
alter table public.materials alter column mime_type set not null;
alter table public.materials alter column size_bytes set not null;
alter table public.materials alter column status set not null;
alter table public.materials alter column created_at set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'materials_member_id_fkey_v2' and conrelid = 'public.materials'::regclass) then
    alter table public.materials add constraint materials_member_id_fkey_v2 foreign key (member_id) references public.members(id);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'materials_title_check_v2' and conrelid = 'public.materials'::regclass) then
    alter table public.materials add constraint materials_title_check_v2 check (char_length(title) between 1 and 180);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'materials_description_check_v2' and conrelid = 'public.materials'::regclass) then
    alter table public.materials add constraint materials_description_check_v2 check (char_length(description) <= 2000);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'materials_size_check_v2' and conrelid = 'public.materials'::regclass) then
    alter table public.materials add constraint materials_size_check_v2 check (size_bytes between 0 and 52428800);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'materials_status_check_v2' and conrelid = 'public.materials'::regclass) then
    alter table public.materials add constraint materials_status_check_v2 check (status in ('draft','published','archived'));
  end if;
end $$;

create unique index if not exists materials_storage_path_unique_idx on public.materials (storage_path);

alter table public.members enable row level security;
alter table public.materials enable row level security;

drop policy if exists "members may view own record" on public.members;
create policy "members may view own record" on public.members
  for select to authenticated
  using (email = lower(auth.jwt()->>'email'));

drop policy if exists "public member display names" on public.members;
create policy "public member display names" on public.members
  for select to anon
  using (active);

drop policy if exists "approved members may insert materials" on public.materials;
create policy "approved members may insert materials" on public.materials
  for insert to authenticated
  with check (exists (
    select 1 from public.members m
    where m.id = member_id
      and m.email = lower(auth.jwt()->>'email')
      and m.active
  ));

drop policy if exists "public reads published materials" on public.materials;
create policy "public reads published materials" on public.materials
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists "owners manage materials" on public.materials;
create policy "owners manage materials" on public.materials
  for update to authenticated
  using (exists (
    select 1 from public.members m
    where m.id = member_id
      and m.email = lower(auth.jwt()->>'email')
      and m.active
  ))
  with check (exists (
    select 1 from public.members m
    where m.id = member_id
      and m.email = lower(auth.jwt()->>'email')
      and m.active
  ));

drop policy if exists "owners delete materials" on public.materials;
create policy "owners delete materials" on public.materials
  for delete to authenticated
  using (exists (
    select 1 from public.members m
    where m.id = member_id
      and m.email = lower(auth.jwt()->>'email')
      and m.active
  ));

revoke insert, update, delete on public.members from anon, authenticated;
revoke all on public.members from anon;
grant select (id, display_name) on public.members to anon;
grant select on public.members to authenticated;
grant select on public.materials to anon, authenticated;
grant insert, update, delete on public.materials to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'materials',
  'materials',
  false,
  52428800,
  array[
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.apple.keynote'
  ]
)
on conflict (id) do update
set name = excluded.name,
    public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "approved uploads" on storage.objects;
create policy "approved uploads" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'materials'
    and exists (
      select 1 from public.members m
      where m.id::text = split_part(name, '/', 1)
        and m.email = lower(auth.jwt()->>'email')
        and m.active
    )
  );

drop policy if exists "approved member reads own objects" on storage.objects;
create policy "approved member reads own objects" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'materials'
    and exists (
      select 1 from public.members m
      where m.id::text = split_part(name, '/', 1)
        and m.email = lower(auth.jwt()->>'email')
        and m.active
    )
  );

drop policy if exists "approved member deletes own objects" on storage.objects;
create policy "approved member deletes own objects" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'materials'
    and exists (
      select 1 from public.members m
      where m.id::text = split_part(name, '/', 1)
        and m.email = lower(auth.jwt()->>'email')
        and m.active
    )
  );

drop policy if exists "public downloads of published materials" on storage.objects;
create policy "public downloads of published materials" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'materials'
    and exists (
      select 1 from public.materials x
      where x.storage_path = name
        and x.status = 'published'
    )
  );

create or replace view public.materials_public
with (security_invoker = true) as
select x.id,
  x.title,
  x.description,
  x.citation_json,
  x.file_name,
  case
    when x.mime_type = 'application/pdf' then 'PDF'
    when x.file_name ilike '%.key' then 'Keynote'
    else 'Presentation'
  end as file_type,
  x.created_at,
  m.display_name,
  ('/api/materials/' || x.id || '/download')::text as download_url
from public.materials x
join public.members m on m.id = x.member_id
where x.status = 'published';

revoke all on public.materials_public from anon, authenticated;
grant select on public.materials_public to anon, authenticated;

commit;
