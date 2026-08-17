-- Row level security.
--
-- The anon key ships to every browser, so RLS is the only thing protecting
-- this data. Every table is locked by default and opened deliberately.

alter table public.profiles    enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- ---------------- profiles ----------------
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- ---------------- products ----------------
-- The storefront is public: anyone with the QR code can browse without
-- signing in. Only staff may change the catalog.
drop policy if exists products_select_public on public.products;
create policy products_select_public on public.products
  for select using (active or public.is_admin());

drop policy if exists products_write_admin on public.products;
create policy products_write_admin on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------- orders ----------------
-- Guests may place an order, but only the owner or staff may read it back.
drop policy if exists orders_insert_any on public.orders;
create policy orders_insert_any on public.orders
  for insert with check (user_id is null or user_id = auth.uid());

drop policy if exists orders_select_own on public.orders;
create policy orders_select_own on public.orders
  for select using (
    public.is_admin() or (user_id is not null and user_id = auth.uid())
  );

drop policy if exists orders_update_admin on public.orders;
create policy orders_update_admin on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists orders_delete_admin on public.orders;
create policy orders_delete_admin on public.orders
  for delete using (public.is_admin());

-- ---------------- order_items ----------------
drop policy if exists order_items_insert_any on public.order_items;
create policy order_items_insert_any on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id is null or o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists order_items_select_own on public.order_items;
create policy order_items_select_own on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (public.is_admin() or (o.user_id is not null and o.user_id = auth.uid()))
    )
  );
