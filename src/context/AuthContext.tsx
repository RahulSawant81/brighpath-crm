import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Profile, UserRole } from '../types/database.types';
import { AuthState } from '../types/auth.types';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch or auto-create profile row in public.profiles
  const fetchProfile = useCallback(async (authUser: User): Promise<Profile | null> => {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.warn('Could not fetch user profile:', error.message);
        return null;
      }

      if (data) {
        return data as Profile;
      }

      // If profile record is missing, try self-heal insert
      const fullName =
        authUser.user_metadata?.full_name ||
        authUser.email?.split('@')[0] ||
        'Staff Counsellor';

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          full_name: fullName,
          role: 'counsellor',
        } as never)
        .select()
        .single();

      if (insertError) {
        console.warn('Could not auto-create profile:', insertError.message);
        return null;
      }

      return newProfile as Profile;
    } catch (err) {
      console.error('Unexpected error loading profile:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await fetchProfile(user);
      setProfile(p);
      setRole(p?.role || 'counsellor');
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user).then((p) => {
          if (!isMounted) return;
          setProfile(p);
          setRole(p?.role || 'counsellor');
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // 2. Auth State Change Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        const p = await fetchProfile(session.user);
        if (!isMounted) return;
        setProfile(p);
        setRole(p?.role || 'counsellor');
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign In
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Sign Up
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) return { error };
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Sign Out
  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const value: AuthState = {
    user,
    profile,
    role,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
