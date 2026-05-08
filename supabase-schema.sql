-- =============================================
-- SaaS Starter Template - Database Schema
-- =============================================
-- Run this in your Supabase SQL Editor.
-- =============================================

create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
-- Extends auth.users with application-level fields.
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  name text,
  avatar_url text,
  subscription_tier text not null default 'authenticated',
  subscription_status text not null default 'active',
  trial_ends_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint profiles_subscription_tier_check
    check (subscription_tier in ('public', 'authenticated', 'basic', 'pro', 'enterprise')),
  constraint profiles_subscription_status_check
    check (subscription_status in ('active', 'canceled', 'past_due', 'incomplete'))
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.profiles enable row level security;

-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- =============================================
-- TIMESTAMP TRIGGERS
-- =============================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
