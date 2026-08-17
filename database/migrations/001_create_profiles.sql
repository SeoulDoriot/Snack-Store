-- Customer and staff profiles, one row per Supabase auth user.
--
-- Supabase owns `auth.users`; this table holds the store-specific fields and
-- the role flag that the admin pages check.

do $$ begin
  create type public.user_role as enum ('customer', 'admin');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null default '',
  student_id  text not null default '',
  batch       text not null default '',
  phone       text not null default '',
  dorm        text not null default 'Dorm B',
  room        text not null default '',
  role        public.user_role not null default 'customer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Store profile for each authenticated user.';

-- Create the profile automatically whenever someone signs up. Runs as the
-- definer so it can write to a table the new user cannot yet see.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role lookup used by the RLS policies below. SECURITY DEFINER so that
-- checking "am I an admin?" does not re-enter the profiles policies and
-- recurse infinitely.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
