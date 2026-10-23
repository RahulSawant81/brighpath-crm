-- ==============================================================================
-- BRIGHTPATH CRM: MIGRATION 01 — INITIAL DATABASE SCHEMA
-- ==============================================================================
-- Purpose:
--   Creates core relational tables, constraints, foreign keys, timestamps,
--   automatic profile provisioning on user signup, and performance indexes.
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Generic updated_at Trigger Function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ==============================================================================
-- TABLE 1: public.profiles
-- User profile linked 1:1 with Supabase Auth users (auth.users)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin', 'manager', 'counsellor')) default 'counsellor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger for profiles.updated_at
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Automatic Profile Creation Trigger on Supabase Auth Signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    'counsellor'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger to execute on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- TABLE 2: public.leads
-- Core student admission enquiries
-- ==============================================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text not null,
  course_interest text not null,
  source text not null check (source in ('Website', 'Call', 'Walk-in', 'Referral', 'Social')),
  status text not null check (status in ('New', 'Contacted', 'Qualified', 'Converted', 'Lost')) default 'New',
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger for leads.updated_at
drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
  before update on public.leads
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- TABLE 3: public.follow_ups
-- Scheduled follow-up tasks, calls, and consultations
-- ==============================================================================
create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  due_at timestamptz not null,
  note text not null,
  status text not null check (status in ('pending', 'completed', 'cancelled')) default 'pending',
  completed_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- TABLE 4: public.activities
-- Immutable chronological audit log of lead interactions & transitions
-- ==============================================================================
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  activity_type text not null check (
    activity_type in (
      'lead_created',
      'status_changed',
      'note_added',
      'follow_up_created',
      'follow_up_completed'
    )
  ),
  description text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
create index if not exists idx_profiles_role on public.profiles(role);

create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_source on public.leads(source);
create index if not exists idx_leads_assigned_to on public.leads(assigned_to);
create index if not exists idx_leads_created_by on public.leads(created_by);
create index if not exists idx_leads_created_at on public.leads(created_at desc);

create index if not exists idx_follow_ups_lead_id on public.follow_ups(lead_id);
create index if not exists idx_follow_ups_assigned_to on public.follow_ups(assigned_to);
create index if not exists idx_follow_ups_due_at_status on public.follow_ups(due_at, status);

create index if not exists idx_activities_lead_id on public.activities(lead_id);
create index if not exists idx_activities_created_at on public.activities(created_at desc);
