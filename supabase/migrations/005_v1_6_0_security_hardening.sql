begin;

-- The event trigger is owned and invoked by postgres, not by API roles.
alter function public.rls_auto_enable() set search_path = pg_catalog;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;
grant execute on function public.rls_auto_enable() to postgres;

-- Cache the JWT claim once per statement without changing the allowlist rules.
alter policy "members may view own record" on public.members
  using (email = lower((select auth.jwt() ->> 'email')));

alter policy "approved members may insert materials" on public.materials
  with check (exists (
    select 1 from public.members m
    where m.id = member_id
      and m.email = lower((select auth.jwt() ->> 'email'))
      and m.active
  ));

alter policy "owners manage materials" on public.materials
  using (exists (
    select 1 from public.members m
    where m.id = member_id
      and m.email = lower((select auth.jwt() ->> 'email'))
      and m.active
  ))
  with check (exists (
    select 1 from public.members m
    where m.id = member_id
      and m.email = lower((select auth.jwt() ->> 'email'))
      and m.active
  ));

alter policy "owners delete materials" on public.materials
  using (exists (
    select 1 from public.members m
    where m.id = member_id
      and m.email = lower((select auth.jwt() ->> 'email'))
      and m.active
  ));

alter policy "approved uploads" on storage.objects
  with check (
    bucket_id = 'materials'
    and exists (
      select 1 from public.members m
      where m.id::text = split_part(name, '/', 1)
        and m.email = lower((select auth.jwt() ->> 'email'))
        and m.active
    )
  );

alter policy "approved member reads own objects" on storage.objects
  using (
    bucket_id = 'materials'
    and exists (
      select 1 from public.members m
      where m.id::text = split_part(name, '/', 1)
        and m.email = lower((select auth.jwt() ->> 'email'))
        and m.active
    )
  );

alter policy "approved member deletes own objects" on storage.objects
  using (
    bucket_id = 'materials'
    and exists (
      select 1 from public.members m
      where m.id::text = split_part(name, '/', 1)
        and m.email = lower((select auth.jwt() ->> 'email'))
        and m.active
    )
  );

commit;
