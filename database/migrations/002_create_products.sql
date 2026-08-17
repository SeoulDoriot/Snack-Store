-- Product catalog.
--
-- The id is the human-readable slug the frontend already uses
-- (e.g. "coca-cola"), which keeps mock data and live data interchangeable.

do $$ begin
  create type public.product_category as enum
    ('Drinks', 'Noodles', 'Chips', 'Biscuits', 'Sweets');
exception when duplicate_object then null;
end $$;

create table if not exists public.products (
  id          text primary key,
  name        text not null,
  description text not null default '',
  price       numeric(10, 2) not null check (price >= 0),
  stock       integer not null default 0 check (stock >= 0),
  category    public.product_category not null,
  image       text not null default '',
  promo       boolean not null default false,
  popular     boolean not null default false,
  -- Soft delete: hidden from the storefront but kept for order history.
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.products is 'Snacks and drinks available in the store.';
