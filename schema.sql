-- =============================================
-- Panadería El Molino – Supabase Schema
-- =============================================

create extension if not exists "uuid-ossp";

-- =============================================
-- PRODUCTS (catálogo)
-- =============================================
create table if not exists products (
  id text primary key,
  name text not null,
  price numeric(10,2) not null,
  category text check (category in ('Panes','Tortas','Pasteles','Bebidas')),
  emoji text,
  unit text,
  is_available boolean default true,
  created_at timestamptz default now()
);

insert into products (id, name, price, category, emoji, unit) values
  ('pan-frances',      'Pan Francés',             0.30, 'Panes',    '🥖', 'unidad'),
  ('pan-yema',         'Pan de Yema',             0.50, 'Panes',    '🍞', 'unidad'),
  ('pan-integral',     'Pan Integral',            0.50, 'Panes',    '🌾', 'unidad'),
  ('pan-molde',        'Pan de Molde',            6.00, 'Panes',    '🍞', 'bolsa'),
  ('ciabatta',         'Ciabatta',                2.00, 'Panes',    '🥖', 'unidad'),
  ('pan-chapla',       'Pan Chapla',              0.50, 'Panes',    '🫓', 'unidad'),
  ('torta-chocolate',  'Torta de Chocolate',     38.00, 'Tortas',   '🍫', 'torta'),
  ('torta-tres-leches','Torta Tres Leches',       42.00, 'Tortas',  '🎂', 'torta'),
  ('torta-vainilla',   'Torta de Vainilla',       35.00, 'Tortas',  '🎂', 'torta'),
  ('torta-frutas',     'Torta de Frutas',         40.00, 'Tortas',  '🍓', 'torta'),
  ('croissant',        'Croissant',                3.50, 'Pasteles', '🥐', 'unidad'),
  ('empanada',         'Empanada de Carne',        2.50, 'Pasteles', '🥟', 'unidad'),
  ('keke',             'Keke Marmolado',          16.00, 'Pasteles', '🍰', 'pieza'),
  ('pionono',          'Pionono',                 14.00, 'Pasteles', '🍥', 'pieza'),
  ('alfajor',          'Alfajor de Maicena',       2.00, 'Pasteles', '🍪', 'unidad'),
  ('galletas',         'Galletas Artesanales',     9.00, 'Pasteles', '🍪', 'bolsa x6'),
  ('cafe',             'Café Americano',           4.00, 'Bebidas',  '☕', 'vaso'),
  ('chocolate',        'Chocolate Caliente',       5.00, 'Bebidas',  '🍵', 'vaso'),
  ('jugo-naranja',     'Jugo de Naranja',          4.50, 'Bebidas',  '🍊', 'vaso');

-- =============================================
-- ORDERS
-- =============================================
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  customer_phone text,
  delivery_type text check (delivery_type in ('pickup','delivery')) not null,
  delivery_address text,
  subtotal numeric(10,2) not null,
  delivery_cost numeric(10,2) default 0,
  total numeric(10,2) not null,
  status text check (status in ('pending','confirmed','preparing','ready','delivered','cancelled')) default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- ORDER ITEMS
-- =============================================
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id text references products(id) on delete set null,
  product_name text not null,
  unit_price numeric(10,2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(10,2) generated always as (unit_price * quantity) stored
);

-- =============================================
-- CONTACT MESSAGES (WhatsApp leads)
-- =============================================
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  customer_name text,
  phone text,
  message text,
  source text default 'whatsapp',
  is_read boolean default false,
  created_at timestamptz default now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table contact_messages enable row level security;

create policy "Products are publicly readable" on products for select using (is_available = true);
create policy "Anyone can create orders" on orders for insert with check (true);
create policy "Anyone can create order items" on order_items for insert with check (true);
create policy "Anyone can create contact messages" on contact_messages for insert with check (true);

create policy "Service role manages products" on products for all using (auth.role() = 'service_role');
create policy "Service role manages orders" on orders for all using (auth.role() = 'service_role');
create policy "Service role manages order_items" on order_items for all using (auth.role() = 'service_role');
create policy "Service role manages contact_messages" on contact_messages for all using (auth.role() = 'service_role');

-- =============================================
-- INDEXES
-- =============================================
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_order_items_order_id on order_items(order_id);
