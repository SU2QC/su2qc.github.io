begin;

drop policy if exists "active members may view member display names" on public.members;
create policy "active members may view member display names" on public.members for select to authenticated using (
  active and public.is_active_member_email((select auth.jwt() ->> 'email'))
);

commit;
