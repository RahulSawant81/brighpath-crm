import { supabase, getSupabaseConfigStatus } from '../lib/supabaseClient';

export type HealthStatus = 'connected' | 'checking' | 'unconfigured' | 'offline' | 'error';

export interface HealthCheckResult {
  status: HealthStatus;
  latencyMs: number | null;
  message: string;
  checkedAt: Date;
}

export const checkSupabaseHealth = async (): Promise<HealthCheckResult> => {
  // Check browser network status first
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      status: 'offline',
      latencyMs: null,
      message: 'Your browser is currently offline. Please check your internet connection.',
      checkedAt: new Date(),
    };
  }

  const config = getSupabaseConfigStatus();
  if (!config.isConfigured) {
    return {
      status: 'unconfigured',
      latencyMs: null,
      message: config.message,
      checkedAt: new Date(),
    };
  }

  const startTime = performance.now();

  try {
    // Perform a lightweight REST ping using Supabase's auth or root health endpoint
    const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true });

    const latencyMs = Math.round(performance.now() - startTime);

    if (error) {
      // If error code is 42P01 (relation does not exist), Supabase is connected but tables aren't migrated yet
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return {
          status: 'connected',
          latencyMs,
          message: 'Supabase connected! Schema tables pending migration (Phase 3).',
          checkedAt: new Date(),
        };
      }

      // If RLS blocked anon request, the database is reachable and RLS is functioning
      if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.code === '42501') {
        return {
          status: 'connected',
          latencyMs,
          message: 'Supabase connected! RLS security active.',
          checkedAt: new Date(),
        };
      }

      return {
        status: 'error',
        latencyMs,
        message: `Database ping returned: ${error.message || 'Unknown error'}`,
        checkedAt: new Date(),
      };
    }

    return {
      status: 'connected',
      latencyMs,
      message: 'Supabase database is connected and responsive.',
      checkedAt: new Date(),
    };
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - startTime);
    const errorMessage = err instanceof Error ? err.message : 'Failed to reach Supabase API';
    return {
      status: 'error',
      latencyMs,
      message: errorMessage,
      checkedAt: new Date(),
    };
  }
};
