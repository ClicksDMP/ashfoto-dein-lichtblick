import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
      }
      // Check if email was just confirmed and generate welcome code
      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        supabase.functions.invoke("generate-welcome-code").catch(console.error);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Separate effect to check admin role when user changes
  useEffect(() => {
    if (user) {
      setLoading(true);
      supabase.rpc("has_role", { _user_id: user.id, _role: "admin" })
        .then(({ data }) => {
          setIsAdmin(!!data);
          setLoading(false);
        });
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, [user?.id]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
