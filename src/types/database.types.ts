export type UserRole = 'admin' | 'manager' | 'counsellor';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

export type LeadSource = 'Website' | 'Call' | 'Walk-in' | 'Referral' | 'Social';

export type FollowUpStatus = 'pending' | 'completed' | 'cancelled';

export type ActivityType =
  | 'lead_created'
  | 'status_changed'
  | 'note_added'
  | 'follow_up_created'
  | 'follow_up_completed';

export interface Profile {
  id: string; // references auth.users.id
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  course_interest: string;
  source: LeadSource | string;
  status: LeadStatus;
  assigned_to: string | null; // references Profile.id
  created_by: string | null; // references Profile.id
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Optional joined relationships
  assignee?: Profile | null;
  creator?: Profile | null;
}

export interface FollowUp {
  id: string;
  lead_id: string; // references Lead.id
  assigned_to: string | null; // references Profile.id
  due_at: string;
  note: string;
  status: FollowUpStatus;
  completed_at: string | null;
  created_by: string | null; // references Profile.id
  created_at: string;
  // Optional joined relationships
  lead?: Lead | null;
  assignee?: Profile | null;
}

export interface Activity {
  id: string;
  lead_id: string; // references Lead.id
  actor_id: string | null; // references Profile.id
  activity_type: ActivityType;
  description: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  // Optional joined relationships
  actor?: Profile | null;
}

// Supabase PostgREST Database schema definition
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Lead, 'id' | 'created_at'>>;
      };
      follow_ups: {
        Row: FollowUp;
        Insert: Omit<FollowUp, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<FollowUp, 'id' | 'created_at'>>;
      };
      activities: {
        Row: Activity;
        Insert: Omit<Activity, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Activity, 'id' | 'created_at'>>;
      };
    };
  };
}
