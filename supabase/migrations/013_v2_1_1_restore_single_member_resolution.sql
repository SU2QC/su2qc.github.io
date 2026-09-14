begin;

-- Keep browser membership checks single-row while allowing the member Vault
-- view to display the contributor name without bypassing materials RLS.
drop policy if exists "active members may view member display names" on public.members;

create or replace function public.active_member_display_name(candidate_member_id uuid)
returns text
language sql
stable
security definer
set search_path = pg_catalog, public
set row_security = off
as $$
  select display_name from public.members where id = candidate_member_id and active;
$$;

revoke all on function public.active_member_display_name(uuid) from public, anon, authenticated;
grant execute on function public.active_member_display_name(uuid) to authenticated;

drop view if exists public.materials_member;
create view public.materials_member with (security_invoker = true) as
select x.id, x.title, x.description, x.citation_json, x.file_name, x.mime_type,
  case when x.mime_type = 'application/pdf' then 'PDF' when x.file_name ilike '%.key' then 'Keynote' else 'Research material' end as file_type,
  x.status, x.visibility, x.created_at, x.updated_at,
  public.active_member_display_name(x.member_id) as display_name
from public.materials x;

revoke all on public.materials_member from anon, authenticated;
grant select on public.materials_member to authenticated;

commit;
