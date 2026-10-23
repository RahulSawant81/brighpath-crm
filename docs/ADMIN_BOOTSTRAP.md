# BrightPath CRM — Database Setup & Admin Bootstrap Guide

This guide explains how to apply the SQL migrations to your Supabase project and safely bootstrap your first **Administrator** account.

---

## 1. Quick Supabase Project Setup

1. Sign in or create a free account at [supabase.com](https://supabase.com).
2. Click **New Project** and name it `BrightPath CRM`.
3. Choose a database password and select your nearest geographic region.
4. When the project finishes provisioning:
   * Go to **Project Settings** (gear icon in the left menu) $\rightarrow$ **API**.
   * Copy the **Project URL** and paste it into your local `.env` file as `VITE_SUPABASE_URL`.
   * Copy the **Project API Keys** (`anon` / `public`) and paste it as `VITE_SUPABASE_ANON_KEY`.

---

## 2. Applying Database Migrations

You can apply the migrations easily using the **Supabase SQL Editor**:

1. In the Supabase left navigation bar, click the **SQL Editor** icon (terminal icon).
2. Click **+ New Query**.
3. Open and copy the contents of the migration files in order:

### Step 2.1: Run Migration 01 (Schema & Triggers)
* File: [`supabase/migrations/20261023000001_initial_schema.sql`](file:///e:/Antigravity/BRIGHTPATH%20CRM/supabase/migrations/20261023000001_initial_schema.sql)
* Paste into the SQL editor and click **Run**.
* *Result*: Creates `profiles`, `leads`, `follow_ups`, and `activities` tables, foreign keys, indexes, and the auto-profile trigger on new user signups.

### Step 2.2: Run Migration 02 (Row Level Security & Policies)
* File: [`supabase/migrations/20261023000002_rls_policies.sql`](file:///e:/Antigravity/BRIGHTPATH%20CRM/supabase/migrations/20261023000002_rls_policies.sql)
* Paste into a new query and click **Run**.
* *Result*: Enables RLS across all tables and establishes strict data isolation rules between counsellors, managers, and administrators.

### Step 2.3: Run Migration 03 (Demo Seed Data)
* File: [`supabase/migrations/20261023000003_seed_data.sql`](file:///e:/Antigravity/BRIGHTPATH%20CRM/supabase/migrations/20261023000003_seed_data.sql)
* Paste into a new query and click **Run**.
* *Result*: Injects 12 realistic student enquiries, scheduled/overdue follow-ups, and activity logs.

---

## 3. Safe Administrator Bootstrap Procedure

By default, all new users who register via the CRM frontend receive the least-privileged role: **`counsellor`**. 

To prevent privilege escalation attacks, users **cannot** change or promote their own role through client-side requests. The project owner promotes the initial administrator account directly inside Supabase:

### Step 3.1: Register Your Account
1. Open your CRM web app locally (e.g. `http://localhost:5173/login`).
2. Click **Don't have an account? Sign Up**.
3. Register with your staff email address (e.g., `admin@brightpath.edu`) and a password.

### Step 3.2: Promote to Administrator via SQL Editor
1. In your Supabase Dashboard, open the **SQL Editor**.
2. Run the following command (replace with your registered email):

```sql
-- Promote your registered user to Administrator
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

3. Confirm the update:
```sql
SELECT id, full_name, role FROM public.profiles;
```

You are now the certified **Administrator** of BrightPath CRM!

---

## 4. Safe Workshop Reset Procedure (Optional)

If you ever need to completely wipe and re-initialize the workshop demo database, run the following script in the SQL Editor:

```sql
-- DANGER: Drops all CRM tables and functions.
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.follow_ups CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.current_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_or_manager() CASCADE;
```
After executing the drop script, simply re-run migrations `01`, `02`, and `03`.
