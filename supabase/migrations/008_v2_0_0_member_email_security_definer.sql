begin;

drop policy if exists "authenticated members may resolve own alias" on public.member_emails;

create or replace function public.is_active_member_for_email(candidate_member_id uuid, candidate_email text)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
set row_security = off
as $$
  select exists (
    select 1
    from public.member_emails me
    join public.members m on m.id = me.member_id
    where me.member_id = candidate_member_id
      and me.email = lower(candidate_email)
      and me.active
      and m.active
  );
$$;

revoke all on function public.is_active_member_for_email(uuid, text) from public, anon, authenticated;
grant execute on function public.is_active_member_for_email(uuid, text) to authenticated;

drop policy if exists "members may view own record" on public.members;
create policy "members may view own record" on public.members for select to authenticated using (
  public.is_active_member_for_email(id, (select auth.jwt() ->> 'email'))
);

drop policy if exists "active members read all materials" on public.materials;
create policy "active members read all materials" on public.materials for select to authenticated using (
  public.is_active_member_for_email(member_id, (select auth.jwt() ->> 'email'))
);

drop policy if exists "approved uploads" on storage.objects;
create policy "approved uploads" on storage.objects for insert to authenticated with check (
  bucket_id = 'materials' and public.is_active_member_for_email(
    split_part(name, '/', 1)::uuid,
    (select auth.jwt() ->> 'email')
  )
);

drop policy if exists "approved member deletes own objects" on storage.objects;
create policy "approved member deletes own objects" on storage.objects for delete to authenticated using (
  bucket_id = 'materials' and public.is_active_member_for_email(
    split_part(name, '/', 1)::uuid,
    (select auth.jwt() ->> 'email')
  )
);

commit;
