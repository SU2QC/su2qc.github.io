begin;

-- Keep aliases non-readable by direct client queries while allowing RLS
-- policy subqueries to verify the current authenticated email.
drop policy if exists "authenticated members may resolve own alias" on public.member_emails;
create policy "authenticated members may resolve own alias"
on public.member_emails for select to authenticated
using (active and email = lower((select auth.jwt() ->> 'email')));

commit;
