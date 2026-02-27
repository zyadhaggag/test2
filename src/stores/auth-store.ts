import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';

interface AuthState {
    user: Profile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    initialize: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    sendOTP: (phone: string) => Promise<{ success: boolean; error?: string }>;
    verifyOTP: (phone: string, otp: string) => Promise<{ success: boolean; isNew?: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,

    initialize: async () => {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            if (error) {
                console.error('[Auth] Profile fetch error:', error);
                set({ user: null, isAuthenticated: false, isLoading: false });
            } else {
                console.log('[Auth] Profile loaded, role:', profile?.role);
                set({ user: profile, isAuthenticated: true, isLoading: false });
            }
        } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }

        supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                if (!error && profile) {
                    console.log('[Auth] State change, role:', profile.role);
                    set({ user: profile, isAuthenticated: true, isLoading: false });
                }
            } else if (event === 'SIGNED_OUT') {
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        });
    },

    signIn: async (email, password) => {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        await get().refreshProfile();
        return { error: null };
    },

    signUp: async (email, password, fullName) => {
        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        if (error) return { error: error.message };
        return { error: null };
    },

    signOut: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
    },

    refreshProfile: async () => {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            set({ user: profile, isAuthenticated: true });
        }
    },

    sendOTP: async (phone) => {
        try {
            const res = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });
            const data = await res.json();
            if (!res.ok) return { success: false, error: data.error };
            return { success: true };
        } catch {
            return { success: false, error: 'خطأ في الاتصال' };
        }
    },

    verifyOTP: async (phone, otp) => {
        try {
            const res = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp }),
            });
            const data = await res.json();
            if (!res.ok) return { success: false, error: data.error };
            if (!data.is_new) {
                await get().refreshProfile();
            }
            return { success: true, isNew: data.is_new };
        } catch {
            return { success: false, error: 'خطأ في الاتصال' };
        }
    },
}));
