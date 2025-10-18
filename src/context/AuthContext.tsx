import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['app_227ebbfd7d_profiles']['Row'];

interface AuthUser extends User {
  profile?: Profile;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  isSupabaseReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseReady] = useState(isSupabaseConfigured());

  useEffect(() => {
    // Only initialize auth if Supabase is configured
    if (!isSupabaseReady) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isSupabaseReady]);

  const fetchProfile = async (userId: string) => {
    if (!isSupabaseReady) return;
    
    try {
      const { data, error } = await supabase
        .from('app_227ebbfd7d_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is expected for new users
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseReady) {
      return { error: 'Supabase is not configured. Please enable Supabase in the MGX platform.' };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    if (!isSupabaseReady) {
      return { error: 'Supabase is not configured. Please enable Supabase in the MGX platform.' };
    }

    try {
      console.log('Starting signup process for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined // Disable email confirmation for development
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup successful, user:', data.user?.id);

      // Create profile immediately after successful signup
      if (data.user) {
        console.log('Creating profile for user:', data.user.id);
        
        const { error: profileError } = await supabase
          .from('app_227ebbfd7d_profiles')
          .insert([
            {
              id: data.user.id,
              first_name: firstName,
              last_name: lastName,
              status: 'online'
            }
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
        
        console.log('Profile created successfully');
      }

      return {};
    } catch (error) {
      console.error('Full signup error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred during signup' };
    }
  };

  const signOut = async () => {
    if (!isSupabaseReady) return;
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!isSupabaseReady) {
      return { error: 'Supabase is not configured' };
    }
    
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('app_227ebbfd7d_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  };

  const value = {
    user,
    profile,
    isAuthenticated: !!user,
    loading,
    isSupabaseReady,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};