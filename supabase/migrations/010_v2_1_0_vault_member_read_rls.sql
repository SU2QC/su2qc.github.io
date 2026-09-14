begin;

-- Approved members may read every material; ownership remains enforced by the
-- existing owner/admin management policies and Edge Functions.
create or replace function public.is_active_member_email(candidate_email text)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
set row_security = off
as $$
  select exists (
    select 1 from public.member_emails me
    join public.members m on m.id = me.member_id
    where me.email = lower(candidate_email) and me.active and m.active
  );
$$;

revoke all on function public.is_active_member_email(text) from public, anon, authenticated;

drop policy if exists "active members read all materials" on public.materials;
create policy "active members read all materials" on public.materials for select to authenticated using (
  public.is_active_member_email((select auth.jwt() ->> 'email'))
);

commit;
