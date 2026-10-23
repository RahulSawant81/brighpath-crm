import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validation helpers
export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url: string | null;
  hasKey: boolean;
  isPlaceholder: boolean;
  isServiceRoleKey: boolean;
  message: string;
}

export const getSupabaseConfigStatus = (): SupabaseConfigStatus => {
  const url = (rawUrl || '').trim();
  const key = (rawAnonKey || '').trim();

  const isPlaceholderUrl =
    !url ||
    url.includes('your-project-id.supabase.co') ||
    !url.startsWith('https://');

  const isPlaceholderKey =
    !key ||
    key.includes('your-public-anon-key') ||
    key.length < 20;

  // Detect accidental service-role key usage
  const isServiceRoleKey = key.toLowerCase().includes('service_role');

  if (isPlaceholderUrl || isPlaceholderKey) {
    return {
      isConfigured: false,
      url: url || null,
      hasKey: !isPlaceholderKey,
      isPlaceholder: true,
      isServiceRoleKey,
      message: 'Supabase credentials are not configured or are using placeholder values in .env',
    };
  }

  if (isServiceRoleKey) {
    return {
      isConfigured: false,
      url,
      hasKey: true,
      isPlaceholder: false,
      isServiceRoleKey: true,
      message: 'CRITICAL SECURITY ALERT: service-role key detected in frontend! Replace with public anon key.',
    };
  }

  return {
    isConfigured: true,
    url,
    hasKey: true,
    isPlaceholder: false,
    isServiceRoleKey: false,
    message: 'Supabase client environment is configured and ready.',
  };
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfigStatus().isConfigured;
};

// Safe fallback URL for initial local development before .env is populated
const fallbackUrl = 'https://unconfigured-placeholder.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase: SupabaseClient<Database> = createClient<Database>(
  isSupabaseConfigured() ? rawUrl! : fallbackUrl,
  isSupabaseConfigured() ? rawAnonKey! : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
