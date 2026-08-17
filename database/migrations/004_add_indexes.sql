-- Lookup and foreign-key indexes.

-- Storefront browses by category and hides inactive rows.
create index if not exists products_active_category_idx
  on public.products (active, category);

-- Admin order list is newest-first, often filtered by status.
create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

create index if not exists orders_status_idx
  on public.orders (status);

-- "My orders" on the account page.
create index if not exists orders_user_id_idx
  on public.orders (user_id);

-- Every order detail view joins its items.
create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

create index if not exists profiles_role_idx
  on public.profiles (role);

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
