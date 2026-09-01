"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import supabase from "@/lib/supabaseClient";
import { isRole, type AppUser, type Role } from "@/types/user";

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

type StaffProfile = {
  display_name: string | null;
  role: string | null;
  status: string | null;
};

function buildAppUser(user: User, profile?: StaffProfile): AppUser {
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const databaseRole: Role = isRole(profile?.role) ? profile.role : "Writer";

  return {
    id: user.id,
    email: user.email ?? "",
    name: profile?.display_name || (metadata.name as string) || "",
    role: databaseRole,
    status: profile?.status === "pending" ? "pending" : "active",
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
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, role, status")
          .eq("id", data.user.id)
          .maybeSingle();
        if (mounted) setUser(buildAppUser(data.user, profile ?? undefined));
      }
      setLoading(false);
    }

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session: Session | null) => {
      if (!mounted) return;

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, role, status")
          .eq("id", session.user.id)
          .maybeSingle();
        if (mounted) setUser(buildAppUser(session.user, profile ?? undefined));
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
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
