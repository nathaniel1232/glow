-- Glow: Supabase Database Schema
-- Run this in the Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  subscription_status text not null default 'free' check (subscription_status in ('free', 'one_time', 'subscribed')),
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
do $$ begin
  create policy "Users can read own profile"
    on public.profiles for select
    using (auth.uid() = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);
exception when duplicate_object then null; end $$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Brand projects table
create table if not exists public.brand_projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text not null,
  vibe text not null check (vibe in ('minimal', 'bold', 'organic', 'y2k', 'dark', 'coastal', 'retro')),
  brand_names jsonb not null default '[]'::jsonb,
  colors jsonb not null default '{}'::jsonb,
  fonts jsonb not null default '{}'::jsonb,
  voice jsonb not null default '{}'::jsonb,
  logos jsonb not null default '[]'::jsonb,
  social_templates jsonb not null default '[]'::jsonb,
  bio_slug text unique,
  bio_links jsonb not null default '[]'::jsonb,
  is_paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.brand_projects enable row level security;

-- Brand projects policies
do $$ begin
  create policy "Users can read own projects"
    on public.brand_projects for select
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own projects"
    on public.brand_projects for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own projects"
    on public.brand_projects for update
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can delete own projects"
    on public.brand_projects for delete
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Public can read bio pages"
    on public.brand_projects for select
    using (bio_slug is not null);
exception when duplicate_object then null; end $$;

-- Indexes
create index if not exists idx_brand_projects_user_id on public.brand_projects(user_id);
create index if not exists idx_brand_projects_bio_slug on public.brand_projects(bio_slug);
create index if not exists idx_brand_projects_created_at on public.brand_projects(created_at desc);

-- Updated at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

drop trigger if exists update_brand_projects_updated_at on public.brand_projects;
create trigger update_brand_projects_updated_at
  before update on public.brand_projects
  for each row execute procedure public.update_updated_at();

-- Storage bucket for brand assets
insert into storage.buckets (id, name, public)
  values ('brand-assets', 'brand-assets', true)
  on conflict (id) do nothing;

-- Storage policies
do $$ begin
  create policy "Users can upload own assets"
    on storage.objects for insert
    with check (
      bucket_id = 'brand-assets' and
      (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Public can read brand assets"
    on storage.objects for select
    using (bucket_id = 'brand-assets');
exception when duplicate_object then null; end $$;
