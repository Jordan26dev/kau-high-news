"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import supabase from "@/lib/supabaseClient";
import type { AppUser } from "@/types/user";

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  value,
  children,
}: {
  value: AuthContextValue;
  children: ReactNode;
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function buildAppUser(user: any): AppUser {
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;

  return {
    id: user.id,
    email: user.email,
    name: (metadata.name as string) || "",
    role: (metadata.role as AppUser["role"]) || "Writer",
    status: (metadata.status as "active" | "pending") || "active",
    requestedEditor: Boolean(metadata.requestedEditor),
  };
}

export function AuthStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;

      if (data?.user) {
        setUser(buildAppUser(data.user));
      }
      setLoading(false);
    }

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(buildAppUser(session.user));
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      (subscription as any)?.subscription?.unsubscribe?.();
    };
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
