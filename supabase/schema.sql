-- Fatima Express — Supabase schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).

create extension if not exists "pgcrypto";

-- Orders placed at checkout
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  customer_name text not null,
  email text not null,
  phone text not null,
  emirate text not null,
  city text not null,
  address text not null,
  notes text,
  payment_method text not null default 'cod',
  subtotal numeric(10, 2) not null default 0,
  delivery_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  items jsonb not null default '[]'::jsonb,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Anyone can place an order"
  on public.orders for insert
  with check (true);

create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Automatically decrement product stock when an order is placed, matching
-- each line item's `slug` against products.slug. security definer lets it
-- update products even though the placing role (anon/authenticated) only
-- has select access there via RLS.
create or replace function public.decrement_stock_on_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  line jsonb;
begin
  for line in select * from jsonb_array_elements(coalesce(new.items, '[]'::jsonb))
  loop
    update public.products
    set stock_quantity = greatest(0, stock_quantity - coalesce((line->>'qty')::int, 0))
    where slug = (line->>'slug');
  end loop;
  return new;
end;
$$;

drop trigger if exists trg_decrement_stock_on_order on public.orders;
create trigger trg_decrement_stock_on_order
  after insert on public.orders
  for each row
  execute function public.decrement_stock_on_order();

-- Contact form submissions
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  with check (true);

-- Newsletter subscribers
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

-- Admin can resolve/track contact messages
alter table public.contact_messages add column if not exists is_resolved boolean not null default false;

-- Order status is admin-managed after checkout
alter table public.orders add column if not exists updated_at timestamptz not null default now();
alter table public.orders add column if not exists coupon_code text;
alter table public.orders add column if not exists discount_amount numeric(10, 2) not null default 0;

-- =========================================================
-- Catalog — categories & products (admin-managed via /admin)
-- =========================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  blurb text,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Anyone can view active categories"
  on public.categories for select
  using (is_active = true);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sku text,
  category_id uuid references public.categories (id) on delete set null,
  shape text,
  theme text,
  price numeric(10, 2) not null default 0,
  compare_at numeric(10, 2),
  colors jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  specs jsonb not null default '[]'::jsonb,
  bulk_pricing jsonb not null default '[]'::jsonb,
  short text,
  description text,
  visual jsonb not null default '{"kind":"round","color":"#3382f0"}'::jsonb,
  image_url text,
  badge text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  stock_quantity int not null default 100,
  rating numeric(2, 1) default 4.8,
  reviews_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Anyone can view active products"
  on public.products for select
  using (is_active = true);

-- =========================================================
-- Reviews — customers submit, admin approves before they go public
-- =========================================================

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  reviewer_name text,
  rating int not null check (rating between 1 and 5),
  review_text text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Anyone can view approved reviews"
  on public.reviews for select
  using (is_approved = true);

create policy "Users can view their own reviews"
  on public.reviews for select
  using (auth.uid() = user_id);

create policy "Users can submit their own review"
  on public.reviews for insert
  with check (auth.uid() = user_id);

-- =========================================================
-- Coupons
-- =========================================================

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null default 'percent' check (discount_type in ('percent', 'flat')),
  discount_value numeric(10, 2) not null default 0,
  min_order numeric(10, 2) not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.coupons enable row level security;

create policy "Anyone can look up an active coupon"
  on public.coupons for select
  using (is_active = true);

-- =========================================================
-- Site settings (single row) — shipping fees + home page content,
-- both editable from /admin without a redeploy
-- =========================================================

create table if not exists public.site_settings (
  id int primary key default 1,
  shipping jsonb not null default '{"free_threshold":1000,"dubai_fee":25,"courier_fee":40}'::jsonb,
  home_content jsonb,
  about_content jsonb,
  contact jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

alter table public.site_settings enable row level security;

create policy "Anyone can read site settings"
  on public.site_settings for select
  using (true);

insert into public.site_settings (id, shipping)
values (1, '{"free_threshold":1000,"dubai_fee":25,"courier_fee":40}'::jsonb)
on conflict (id) do nothing;
