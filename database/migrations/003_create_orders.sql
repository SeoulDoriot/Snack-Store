-- Orders and their line items.
--
-- user_id is nullable on purpose: students can order as guests straight from
-- the QR code without creating an account.

do $$ begin
  create type public.order_status as enum
    ('pending', 'preparing', 'delivering', 'delivered', 'cancelled');
exception when duplicate_object then null;
end $$;

create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  order_number  text not null unique,
  user_id       uuid references auth.users (id) on delete set null,

  -- Delivery details captured at checkout.
  customer_name text not null,
  student_id    text not null default '',
  batch         text not null default '',
  phone         text not null,
  dorm          text not null,
  room          text not null,
  note          text not null default '',

  payment       text not null default 'cash',
  status        public.order_status not null default 'pending',

  subtotal      numeric(10, 2) not null default 0,
  delivery      numeric(10, 2) not null default 0,
  total         numeric(10, 2) not null default 0,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Line items copy name/price so historical orders stay correct even if the
-- product is later renamed, repriced or removed.
create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  product_id text references public.products (id) on delete set null,
  name       text not null,
  image      text not null default '',
  price      numeric(10, 2) not null,
  quantity   integer not null check (quantity > 0)
);

comment on table public.orders is 'Customer orders, including guest orders.';
comment on table public.order_items is 'Line items, denormalised for history.';
