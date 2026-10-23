# BrightPath CRM — Master Project Plan & Execution Specification

## 1. Executive Summary & Problem Context
* **Organization**: BrightPath Academy (fictional coaching institute).
* **Business Problem**: Student enquiries arrive via website, phone calls, walk-ins, messaging channels, and referrals. Currently handled via spreadsheets and ad-hoc chats, leading to lost enquiries, duplicate records, unclear ownership, forgotten follow-ups, and zero conversion visibility.
* **Goal**: Build an MVP CRM that makes the enquiry-to-admission pipeline visible, consistent, measurable, and secure.
* **Core Rule**: Truthful data only. No fake/mocked metrics disguised as real analytics. All metrics must derive from permitted Supabase PostgreSQL records via Row Level Security (RLS).
* **Out of Scope for MVP**: LMS, fee collection system, student attendance ERP, automated WhatsApp/SMS gateways, complex multi-tenant billing.

---

## 2. Technical Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18/19 + TypeScript + Vite | Fast, typed single-page application |
| **Styling & UI** | Bespoke CSS Tokens + Vanilla CSS + Lucide Icons | Clean SaaS aesthetic, responsive, zero generic AI feel |
| **Routing** | React Router v6/v7 | Client-side routing with role-based route guards |
| **Database & Auth** | Supabase (PostgreSQL 15+ & Supabase Auth) | Multi-user authentication, relational schema, RLS |
| **Version Control** | Git + GitHub | Clean commit milestones, branching, CI trigger |
| **Hosting & CI/CD** | Vercel Edge Network | Automated git-driven deployments |

### Reference Data Flow
$$\text{Browser (React + TS)} \longrightarrow \text{Typed Service Layer} \longrightarrow \text{Supabase Client (@supabase/supabase-js)} \longrightarrow \text{PostgreSQL (RLS)}$$

---

## 3. Roles & Permissions Boundary

| Role | Default for New Users? | Scope of Permissions |
| :--- | :---: | :--- |
| **Administrator** | No (Assigned via SQL bootstrap) | Full visibility across all leads and follow-ups. Can view and modify user profiles/roles. Manages system settings. Role promotion cannot be executed client-side. |
| **Manager** | No | Team-wide lead visibility. Can reassign leads, review team follow-up pipelines, and view aggregate conversion reports. |
| **Counsellor** | **Yes** (Default role) | Can create leads. Can only view/edit leads assigned to them or created by them. Can schedule, view, and complete follow-ups on accessible leads. Cannot view team-wide metrics. |

---

## 4. Database Schema & Data Dictionary

### Tables
1. **`public.profiles`**
   - `id`: `uuid primary key references auth.users(id) on delete cascade`
   - `full_name`: `text not null`
   - `role`: `text not null check (role in ('admin', 'manager', 'counsellor')) default 'counsellor'`
   - `created_at`: `timestamptz default now()`
   - `updated_at`: `timestamptz default now()`

2. **`public.leads`**
   - `id`: `uuid primary key default gen_random_uuid()`
   - `full_name`: `text not null`
   - `email`: `text` (nullable, format validated)
   - `phone`: `text not null` (format validated)
   - `course_interest`: `text not null`
   - `source`: `text not null` (`Website`, `Call`, `Walk-in`, `Referral`, `Social`)
   - `status`: `text not null check (status in ('New', 'Contacted', 'Qualified', 'Converted', 'Lost')) default 'New'`
   - `assigned_to`: `uuid references public.profiles(id)`
   - `created_by`: `uuid references public.profiles(id)`
   - `notes`: `text`
   - `created_at`: `timestamptz default now()`
   - `updated_at`: `timestamptz default now()`

3. **`public.follow_ups`**
   - `id`: `uuid primary key default gen_random_uuid()`
   - `lead_id`: `uuid not null references public.leads(id) on delete cascade`
   - `assigned_to`: `uuid references public.profiles(id)`
   - `due_at`: `timestamptz not null`
   - `note`: `text not null`
   - `status`: `text not null check (status in ('pending', 'completed', 'cancelled')) default 'pending'`
   - `completed_at`: `timestamptz`
   - `created_by`: `uuid references public.profiles(id)`
   - `created_at`: `timestamptz default now()`

4. **`public.activities`**
   - `id`: `uuid primary key default gen_random_uuid()`
   - `lead_id`: `uuid not null references public.leads(id) on delete cascade`
   - `actor_id`: `uuid references public.profiles(id)`
   - `activity_type`: `text not null` (`lead_created`, `status_changed`, `note_added`, `follow_up_created`, `follow_up_completed`)
   - `description`: `text not null`
   - `metadata`: `jsonb default '{}'::jsonb`
   - `created_at`: `timestamptz default now()`

---

## 5. Metric Definitions
* **Total Leads**: Exact count of accessible leads under active user's RLS.
* **New Leads**: Accessible leads where `status = 'New'`.
* **Converted Leads**: Accessible leads where `status = 'Converted'`.
* **Conversion Rate (%)**: 
  $$\text{Conversion Rate} = \frac{\text{Converted Leads}}{\text{Total Accessible Leads}} \times 100 \quad (\text{guarded against division by zero})$$
* **Overdue Follow-ups**: Pending follow-ups where `status = 'pending' AND due_at < NOW()`.

---

## 6. Phased Implementation Roadmap & Feature Quality Gates

> **Lifecycle for Every Feature**:
> `[Develop]` $\rightarrow$ `[Test Locally]` $\rightarrow$ `[Verify Criteria]` $\rightarrow$ `[Deploy/Stage]` $\rightarrow$ `[Retest Live & Sign-off]`

```
[Phase 0: Workspace Inspection & Baseline Setup]
       │
       ▼
[Phase 1: Project Scaffolding & App Shell]
  ├── Feature 1.1: Vite + React + TypeScript Tooling Setup
  ├── Feature 1.2: Design Tokens, CSS Theme & Layout (Sidebar, Header)
  └── Feature 1.3: Client Routing & Page Shells
       │
       ▼
[Phase 2: Supabase Integration & Environment Config]
  ├── Feature 2.1: Supabase Client Module & Environment Validator
  └── Feature 2.2: Connection Diagnostics & Health Badge
       │
       ▼
[Phase 3: Database Migrations, RLS & Seed Data]
  ├── Feature 3.1: Relational Schema & Constraints DDL
  ├── Feature 3.2: Row Level Security (RLS) Policies
  └── Feature 3.3: Admin Bootstrap Procedure & Demo Seed Data
       │
       ▼
[Phase 4: Authentication & Role Lifecycle]
  ├── Feature 4.1: Auth State Provider & Session Management
  ├── Feature 4.2: Login, Registration & Password Reset Views
  └── Feature 4.3: Role-Based Route Guards & Component Gates
       │
       ▼
[Phase 5: Lead Management Module (Core CRM)]
  ├── Feature 5.1: Typed Leads Service & Data Access
  ├── Feature 5.2: Lead Creation Modal & Form Validation
  ├── Feature 5.3: Lead List with Debounced Search, Multi-Filter & Sort
  ├── Feature 5.4: Lead Details View & In-Place Editing
  └── Feature 5.5: Status Transition Engine & 'Lost Reason' Flow
       │
       ▼
[Phase 6: Follow-up Scheduling & Activity History]
  ├── Feature 6.1: Follow-up Service & Overdue Calculation Logic
  ├── Feature 6.2: Follow-up Scheduling Modal & Tabbed Board
  ├── Feature 6.3: One-Click Follow-up Completion Workflow
  └── Feature 6.4: Automated Activity Timeline Feed
       │
       ▼
[Phase 7: Dashboard Metrics & Reports]
  ├── Feature 7.1: Real-time Aggregated KPI Cards
  ├── Feature 7.2: Pipeline & Lead Source Visual Distribution
  ├── Feature 7.3: Overdue & Upcoming Priority Widget
  └── Feature 7.4: Conversion & Counsellor Workload Reports
       │
       ▼
[Phase 8: UI Polish, Micro-Animations & Accessibility]
  ├── Feature 8.1: Micro-Animations, Transitions & Non-AI Polish
  ├── Feature 8.2: Global ErrorBoundary, Toast Container & Offline Handler
  └── Feature 8.3: Mobile Ergonomics & WCAG 2.1 AA Accessibility Audit
       │
       ▼
[Phase 9: Production Verification, Test Matrix & Handover]
  ├── Feature 9.1: Automated Lint & Static Production Build Check
  ├── Feature 9.2: Complete End-to-End Acceptance Test Matrix (TC-01 - TC-10)
  └── Feature 9.3: Handover Documentation (README.md, DEPLOYMENT.md)
       │
       ▼
[Phase 10: GitHub CI/CD & Vercel Deployment]
  ├── Feature 10.1: Git Repository Init & GitHub Remote Push
  ├── Feature 10.2: Vercel Project Import & Env Variables Sync
  └── Feature 10.3: Live Production Smoke Test & Final Workshop Handover
```

---

## 7. Master Feature Checklist & Status Tracker

- [x] **Phase 0: Workspace Inspection & Baseline Setup**
  - [x] Check directory state and file inventory
  - [x] Inspect Node & NPM versions (`Node v22.13.1`, `NPM 10.9.2`)
  - [x] Check Git state (Initialized with first commit)

- [x] **Phase 1: Project Scaffolding, Design System & App Shell**
  - [x] **F-1.1**: Scaffold React + TypeScript + Vite project
  - [x] **F-1.2**: Implement CSS design system tokens and responsive layout shell
  - [x] **F-1.3**: Configure React Router and lazy-loaded page shells

- [x] **Phase 2: Supabase Integration & Environment Configuration**
  - [x] **F-2.1**: Implement typed `supabaseClient.ts` with strict environment variable validation
  - [x] **F-2.2**: Implement connection diagnostics & status indicator

- [ ] **Phase 3: Database Schema, Migrations, Seed Data & RLS**
  - [ ] **F-3.1**: Create `20261023000001_initial_schema.sql` (Tables, FKs, Constraints)
  - [ ] **F-3.2**: Create `20261023000002_rls_policies.sql` (Strict tenant & role policies)
  - [ ] **F-3.3**: Create `20261023000003_seed_data.sql` and Admin Bootstrap guide

- [ ] **Phase 4: Authentication & Role Lifecycle**
  - [ ] **F-4.1**: Build `AuthContext` and session subscription hooks
  - [ ] **F-4.2**: Build Login and Register forms with validation and error alerts
  - [ ] **F-4.3**: Implement `ProtectedRoute` and `RoleGate` components

- [ ] **Phase 5: Lead Management Module**
  - [ ] **F-5.1**: Build `leadService.ts` strongly typed data access layer
  - [ ] **F-5.2**: Build `CreateLeadModal` with field validation and double-submit prevention
  - [ ] **F-5.3**: Build interactive `LeadListTable` with debounced search, filters, and sort
  - [ ] **F-5.4**: Build `LeadDetailPage` with contact quick-actions and edit controls
  - [ ] **F-5.5**: Implement status transition workflow and mandatory Lost Reason modal

- [ ] **Phase 6: Follow-up Scheduling & Activity History**
  - [ ] **F-6.1**: Build `followUpService.ts` and timezone-aware overdue logic
  - [ ] **F-6.2**: Build `CreateFollowUpModal` and tabbed Follow-ups management view
  - [ ] **F-6.3**: Implement one-click completion workflow with completion timestamp
  - [ ] **F-6.4**: Build `ActivityTimeline` event feed with action badges

- [ ] **Phase 7: Dashboard Metrics & Reports**
  - [ ] **F-7.1**: Implement `KpiOverview` with live calculated metrics
  - [ ] **F-7.2**: Build pipeline status and lead source distribution visual charts
  - [ ] **F-7.3**: Build priority urgent follow-up alert widget
  - [ ] **F-7.4**: Build conversion and counsellor workload reporting tables

- [ ] **Phase 8: UI Polish, Micro-Animations & Accessibility**
  - [ ] **F-8.1**: Integrate micro-interactions, skeleton loaders, and non-AI custom styling
  - [ ] **F-8.2**: Build React `ErrorBoundary`, Toast notification system, and offline detector
  - [ ] **F-8.3**: Conduct mobile responsiveness and WCAG 2.1 AA accessibility audit

- [ ] **Phase 9: Production Verification, Test Matrix & Handover**
  - [ ] **F-9.1**: Execute `npm run build` and `npm run lint` validation
  - [ ] **F-9.2**: Complete end-to-end acceptance test checklist (TC-01 to TC-10)
  - [ ] **F-9.3**: Generate developer handover documentation (`README.md`, `DEPLOYMENT.md`)

- [ ] **Phase 10: GitHub CI/CD & Vercel Deployment**
  - [ ] **F-10.1**: Initialize git repository, configure `.gitignore`, create commits, push to GitHub
  - [ ] **F-10.2**: Import project in Vercel and configure production environment variables
  - [ ] **F-10.3**: Run live production smoke tests on Vercel deployment URL
