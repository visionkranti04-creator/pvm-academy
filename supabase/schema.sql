-- ============================================================
-- PVM INTERNATIONAL ACADEMY — Supabase schema
-- Run this once in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. ADMISSION INQUIRIES (from the Admissions page form)
create table if not exists admission_inquiries (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  parent_name text not null,
  phone text not null,
  email text,
  grade_applying text,
  message text,
  created_at timestamptz default now()
);

-- 2. CONTACT MESSAGES (from the Contact page form)
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz default now()
);

-- 3. GALLERY IMAGES (managed from admin.html)
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  category text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 4. NEWS / EVENTS (managed from admin.html)
create table if not exists news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  cover_image_url text,
  category text,
  published_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public site can INSERT inquiries/messages and READ gallery/news.
-- Only signed-in staff (created in Authentication → Users) can
-- write to gallery_images / news_posts and read inquiries.
-- ============================================================

alter table admission_inquiries enable row level security;
alter table contact_messages enable row level security;
alter table gallery_images enable row level security;
alter table news_posts enable row level security;

-- Anyone can submit an admission inquiry, nobody public can read them back
create policy "public can insert admission inquiries"
  on admission_inquiries for insert
  to anon
  with check (true);

create policy "staff can read admission inquiries"
  on admission_inquiries for select
  to authenticated
  using (true);

-- Anyone can submit a contact message
create policy "public can insert contact messages"
  on contact_messages for insert
  to anon
  with check (true);

create policy "staff can read contact messages"
  on contact_messages for select
  to authenticated
  using (true);

-- Gallery: public read, staff write
create policy "public can read gallery"
  on gallery_images for select
  to anon
  using (true);

create policy "staff can manage gallery"
  on gallery_images for all
  to authenticated
  using (true)
  with check (true);

-- News: public read, staff write
create policy "public can read news"
  on news_posts for select
  to anon
  using (true);

create policy "staff can manage news"
  on news_posts for all
  to authenticated
  using (true)
  with check (true);
  -- ============================================================
-- CONTENT BLOCKS
-- Lets staff edit text/images on the site from admin.html
-- without touching code. Each row is one editable piece of content.
-- ============================================================
create table if not exists content_blocks (
  content_key text primary key,
  content_value text,
  updated_at timestamptz default now()
);

alter table content_blocks enable row level security;

create policy "public can read content"
  on content_blocks for select
  to anon
  using (true);

create policy "staff can manage content"
  on content_blocks for all
  to authenticated
  using (true)
  with check (true);