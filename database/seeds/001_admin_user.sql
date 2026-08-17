-- Promote a signed-up user to store admin.
--
-- Admins cannot be created directly in SQL: Supabase Auth owns the password,
-- so the person must register through the app first (or be invited from
-- Authentication → Users in the dashboard).
--
-- Then run this with their email to give them access to /admin.

update public.profiles p
set role = 'admin'
from auth.users u
where u.id = p.id
  and u.email = 'replace-with-your-email@kit.edu.kh';

-- Check it worked:
--   select u.email, p.role
--   from public.profiles p
--   join auth.users u on u.id = p.id
--   where p.role = 'admin';
