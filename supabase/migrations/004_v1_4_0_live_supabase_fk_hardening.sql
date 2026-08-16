begin;

alter table public.materials
  drop constraint if exists materials_member_id_fkey_v2;

create index if not exists materials_member_id_idx
  on public.materials (member_id);

commit;
