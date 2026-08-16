begin;

revoke all on public.members from anon, authenticated;
grant select (id, display_name) on public.members to anon;
grant select on public.members to authenticated;

revoke all on public.materials from anon, authenticated;
grant select on public.materials to anon, authenticated;
grant insert, update, delete on public.materials to authenticated;

commit;
