-- ==============================================================================
-- BRIGHTPATH CRM: MIGRATION 02 — ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Purpose:
--   Enforces multi-user data boundaries and role permissions directly in PostgreSQL.
--   Prevents unauthorized data access, cross-user exposure, and client privilege escalation.
-- ==============================================================================

-- 1. Helper Functions (Security Definer with fixed search_path to prevent recursion)
create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin_or_manager()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(role in ('admin', 'manager'), false)
  from public.profiles
  where id = auth.uid();
$$;

-- 2. Enable Row Level Security on All Tables
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.follow_ups enable row level security;
alter table public.activities enable row level security;

-- ==============================================================================
-- POLICIES: public.profiles
-- ==============================================================================
-- Drop existing policies if any
drop policy if exists "profiles_select_policy" on public.profiles;
drop policy if exists "profiles_update_policy" on public.profiles;

-- SELECT: Users can read their own profile, OR any authenticated user can view
-- basic staff profile info (name, id, role) to populate assignment dropdowns
create policy "profiles_select_policy"
  on public.profiles
  for select
  to authenticated
  using (true);

-- UPDATE: Users can update their own profile, BUT CANNOT alter their role column!
create policy "profiles_update_policy"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
  );

-- ==============================================================================
-- POLICIES: public.leads
-- ==============================================================================
drop policy if exists "leads_select_policy" on public.leads;
drop policy if exists "leads_insert_policy" on public.leads;
drop policy if exists "leads_update_policy" on public.leads;
drop policy if exists "leads_delete_policy" on public.leads;

-- SELECT:
--   - Admin / Manager: can view all leads across the institute.
--   - Counsellor: can only view leads assigned to them or created by them.
create policy "leads_select_policy"
  on public.leads
  for select
  to authenticated
  using (
    public.is_admin_or_manager()
    or assigned_to = auth.uid()
    or created_by = auth.uid()
  );

-- INSERT:
--   Any authenticated staff member can create a new enquiry.
--   Enforces that created_by is either null or the creator's user id.
create policy "leads_insert_policy"
  on public.leads
  for insert
  to authenticated
  with check (
    created_by = auth.uid() or created_by is null
  );

-- UPDATE:
--   - Admin / Manager: can update any lead.
--   - Counsellor: can update leads assigned to them or created by them.
create policy "leads_update_policy"
  on public.leads
  for update
  to authenticated
  using (
    public.is_admin_or_manager()
    or assigned_to = auth.uid()
    or created_by = auth.uid()
  )
  with check (
    public.is_admin_or_manager()
    or assigned_to = auth.uid()
    or created_by = auth.uid()
  );

-- DELETE:
--   Only Administrator role can permanently delete leads.
create policy "leads_delete_policy"
  on public.leads
  for delete
  to authenticated
  using (
    public.current_user_role() = 'admin'
  );

-- ==============================================================================
-- POLICIES: public.follow_ups
-- ==============================================================================
drop policy if exists "follow_ups_select_policy" on public.follow_ups;
drop policy if exists "follow_ups_insert_policy" on public.follow_ups;
drop policy if exists "follow_ups_update_policy" on public.follow_ups;
drop policy if exists "follow_ups_delete_policy" on public.follow_ups;

-- SELECT: Users can view follow-ups for leads they have permission to access
create policy "follow_ups_select_policy"
  on public.follow_ups
  for select
  to authenticated
  using (
    exists (
      select 1 from public.leads
      where leads.id = follow_ups.lead_id
      and (
        public.is_admin_or_manager()
        or leads.assigned_to = auth.uid()
        or leads.created_by = auth.uid()
      )
    )
  );

-- INSERT: Users can create follow-ups for leads they have permission to access
create policy "follow_ups_insert_policy"
  on public.follow_ups
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.leads
      where leads.id = follow_ups.lead_id
      and (
        public.is_admin_or_manager()
        or leads.assigned_to = auth.uid()
        or leads.created_by = auth.uid()
      )
    )
  );

-- UPDATE: Users can update follow-ups for leads they have permission to access
create policy "follow_ups_update_policy"
  on public.follow_ups
  for update
  to authenticated
  using (
    exists (
      select 1 from public.leads
      where leads.id = follow_ups.lead_id
      and (
        public.is_admin_or_manager()
        or leads.assigned_to = auth.uid()
        or leads.created_by = auth.uid()
      )
    )
  );

-- DELETE: Only Admin or lead assignee can delete follow-up
create policy "follow_ups_delete_policy"
  on public.follow_ups
  for delete
  to authenticated
  using (
    public.is_admin_or_manager()
    or assigned_to = auth.uid()
  );

-- ==============================================================================
-- POLICIES: public.activities
-- ==============================================================================
drop policy if exists "activities_select_policy" on public.activities;
drop policy if exists "activities_insert_policy" on public.activities;

-- SELECT: Users can view activities for leads they have access to
create policy "activities_select_policy"
  on public.activities
  for select
  to authenticated
  using (
    exists (
      select 1 from public.leads
      where leads.id = activities.lead_id
      and (
        public.is_admin_or_manager()
        or leads.assigned_to = auth.uid()
        or leads.created_by = auth.uid()
      )
    )
  );

-- INSERT: Authenticated users can append activities for leads they have access to
create policy "activities_insert_policy"
  on public.activities
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.leads
      where leads.id = activities.lead_id
      and (
        public.is_admin_or_manager()
        or leads.assigned_to = auth.uid()
        or leads.created_by = auth.uid()
      )
    )
  );
