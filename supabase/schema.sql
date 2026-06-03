-- ============================================================
-- MapLead Scraper — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- USERS TABLE
-- Stores extended profile data beyond Supabase Auth
-- ============================================================
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  email       text not null unique,
  company     text,
  role        text not null default 'user' check (role in ('user', 'admin', 'super_admin')),
  features    jsonb not null default '{"scraping": true, "export": true, "savedSearches": true, "resultsMap": true}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- SCRAPE_JOBS TABLE
-- ============================================================
create table if not exists public.scrape_jobs (
  id            text primary key,
  user_id       uuid not null references public.users(id) on delete cascade,
  name          text not null,
  keyword       text not null,
  location      text not null,
  category      text,
  radius        integer not null default 10,
  result_limit  integer not null default 500,
  filters       jsonb not null default '{}'::jsonb,
  status        text not null default 'idle' check (status in ('idle', 'running', 'completed', 'failed')),
  progress      integer not null default 0,
  result_count  integer not null default 0,
  results       jsonb,
  error         text,
  created_at    timestamptz not null default now(),
  completed_at  timestamptz
);

create index if not exists scrape_jobs_user_id_idx on public.scrape_jobs(user_id);
create index if not exists scrape_jobs_status_idx on public.scrape_jobs(status);

-- ============================================================
-- SAVED_SEARCHES TABLE
-- ============================================================
create table if not exists public.saved_searches (
  id            text primary key,
  user_id       uuid not null references public.users(id) on delete cascade,
  name          text not null,
  keyword       text not null,
  location      text not null,
  category      text,
  radius        integer not null default 10,
  result_limit  integer not null default 500,
  filters       jsonb not null default '{}'::jsonb,
  avg_results   integer not null default 0,
  last_run_at   timestamptz,
  icon_key      text,
  created_at    timestamptz not null default now()
);

create index if not exists saved_searches_user_id_idx on public.saved_searches(user_id);

-- ============================================================
-- FEATURE_FLAGS TABLE (admin-managed)
-- ============================================================
create table if not exists public.feature_flags (
  key         text primary key,
  label       text not null,
  description text,
  enabled     boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- Seed default feature flags
insert into public.feature_flags (key, label, description, enabled) values
  ('scraping',       'Scraping',        'Allow users to run scrape jobs',          true),
  ('export',         'Export',          'Allow CSV/Excel/JSON export',             true),
  ('savedSearches',  'Saved Searches',  'Allow saving search presets',             true),
  ('resultsMap',     'Results Map',     'Show interactive map on results page',    true),
  ('apiSettings',    'API Settings',    'Allow users to configure Apify API key',  true)
on conflict (key) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Users: can only read/update their own row; admins can read all
alter table public.users enable row level security;

create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

create policy "admins_select_all_users" on public.users
  for select using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('admin', 'super_admin')
    )
  );

create policy "admins_update_all_users" on public.users
  for update using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('admin', 'super_admin')
    )
  );

-- Scrape jobs: users own their jobs; admins see all
alter table public.scrape_jobs enable row level security;

create policy "jobs_select_own" on public.scrape_jobs
  for select using (auth.uid() = user_id);

create policy "jobs_insert_own" on public.scrape_jobs
  for insert with check (auth.uid() = user_id);

create policy "jobs_update_own" on public.scrape_jobs
  for update using (auth.uid() = user_id);

create policy "jobs_delete_own" on public.scrape_jobs
  for delete using (auth.uid() = user_id);

create policy "admins_select_all_jobs" on public.scrape_jobs
  for select using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('admin', 'super_admin')
    )
  );

-- Saved searches: same pattern
alter table public.saved_searches enable row level security;

create policy "searches_select_own" on public.saved_searches
  for select using (auth.uid() = user_id);

create policy "searches_insert_own" on public.saved_searches
  for insert with check (auth.uid() = user_id);

create policy "searches_update_own" on public.saved_searches
  for update using (auth.uid() = user_id);

create policy "searches_delete_own" on public.saved_searches
  for delete using (auth.uid() = user_id);

-- Feature flags: readable by all authenticated users; writable by admins only
alter table public.feature_flags enable row level security;

create policy "flags_select_authenticated" on public.feature_flags
  for select using (auth.role() = 'authenticated');

create policy "flags_update_admins" on public.feature_flags
  for update using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('admin', 'super_admin')
    )
  );
