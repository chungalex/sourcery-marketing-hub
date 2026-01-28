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

    const hydrateFromStorage = () => {
      try {
        // Supabase stores session in localStorage under a key like `sb-<ref>-auth-token`.
        const key = Object.keys(localStorage).find(
          (k) => k.startsWith("sb-") && k.endsWith("-auth-token")
        );
        if (!key) return;
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const sessionCandidate = (parsed?.currentSession ?? parsed) as Session | null;
        const userCandidate = sessionCandidate?.user ?? null;
        if (!isMounted) return;
        setState((prev) => ({
          ...prev,
          user: userCandidate,
          session: sessionCandidate,
          isLoading: false,
        }));
      } catch {
        // ignore
      }
    };

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

    const updateIsAdminInBackground = (userId: string) => {
      // Important: do NOT await this in the auth listener; it can stall auth flows.
      resolveIsAdmin(userId).then((isAdmin) => {
        if (!isMounted) return;
        setState((prev) => ({ ...prev, isAdmin }));
      });
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        const user = session?.user ?? null;

        // Never block auth state propagation on a DB call.
        setState({
          user,
          session,
          isLoading: false,
          isAdmin: false,
        });

        if (user) updateIsAdminInBackground(user.id);
      }
    );

    // Hydrate immediately from localStorage to avoid any potential auth lock deadlocks.
    hydrateFromStorage();

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
