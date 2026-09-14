begin;

grant execute on function public.is_active_member_email(text) to authenticated;

commit;
