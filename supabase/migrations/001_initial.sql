create extension if not exists pgcrypto;

create table public.members (
  id uuid primary key default gen_random_uuid(),
  email text unique not null check (email = lower(email)),
  display_name text not null,
  role text not null default 'member' check (role in ('admin','member')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id),
  title text not null check (char_length(title) between 1 and 180),
  description text not null default '' check (char_length(description) <= 2000),
  bibtex text,
  citation_json jsonb,
  storage_path text unique not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes <= 52428800),
  status text not null default 'published' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now()
);

alter table public.members enable row level security;
alter table public.materials enable row level security;

create policy "members may view own record" on public.members for select to authenticated using (email = lower(auth.jwt()->>'email'));
create policy "approved members may insert materials" on public.materials for insert to authenticated with check (exists(select 1 from public.members m where m.id=member_id and m.email=lower(auth.jwt()->>'email') and m.active));
create policy "public reads published materials" on public.materials for select to anon, authenticated using (status='published');
create policy "owners manage materials" on public.materials for update to authenticated using (exists(select 1 from public.members m where m.id=member_id and m.email=lower(auth.jwt()->>'email') and m.active));
create policy "owners delete materials" on public.materials for delete to authenticated using (exists(select 1 from public.members m where m.id=member_id and m.email=lower(auth.jwt()->>'email') and m.active));

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('materials','materials',false,52428800,array['application/pdf','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.apple.keynote'])
on conflict (id) do update set public=false,file_size_limit=52428800,allowed_mime_types=excluded.allowed_mime_types;

create policy "approved uploads" on storage.objects for insert to authenticated with check (bucket_id='materials' and name like (select m.id::text || '/%' from public.members m where m.email=lower(auth.jwt()->>'email') and m.active limit 1));
create policy "public downloads of published materials" on storage.objects for select to anon,authenticated using (bucket_id='materials' and exists(select 1 from public.materials x where x.storage_path=name and x.status='published'));

create or replace view public.materials_public as
select x.id,x.title,x.description,x.citation_json,x.file_name,
  case when x.mime_type='application/pdf' then 'PDF' when x.file_name ilike '%.key' then 'Keynote' else 'Presentation' end as file_type,
  x.created_at,m.display_name,('/api/materials/'||x.id||'/download')::text as download_url
from public.materials x join public.members m on m.id=x.member_id where x.status='published';
grant select on public.materials_public to anon,authenticated;
