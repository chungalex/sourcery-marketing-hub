import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAdmin: false,
  });

  useEffect(() => {
    let isMounted = true;

    const resolveIsAdmin = async (userId: string): Promise<boolean> => {
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();
        return !!data;
      } catch {
        return false;
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        const user = session?.user ?? null;
        const isAdmin = user ? await resolveIsAdmin(user.id) : false;

        if (isMounted) {
          setState({
            user,
            session,
            isLoading: false,
            isAdmin,
          });
        }
      }
    );

    // Get initial session with timeout fallback
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        const user = session?.user ?? null;
        const isAdmin = user ? await resolveIsAdmin(user.id) : false;

        if (isMounted) {
          setState({
            user,
            session,
            isLoading: false,
            isAdmin,
          });
        }
      } catch {
        if (isMounted) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    // Timeout fallback to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isMounted) {
        setState(prev => {
          if (prev.isLoading) {
            console.warn("useAuth: timeout reached, forcing isLoading=false");
            return { ...prev, isLoading: false };
          }
          return prev;
        });
      }
    }, 5000);

    initSession();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
  };
}
