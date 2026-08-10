"use client";

import { useEffect, useMemo, useState } from "react";
import supabase from "@/lib/supabaseClient";

type AuthGateProps = {
  children: React.ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(data.user ?? null);
      } catch (e) {
        // ignore
      }
    }

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      // unsubscribe
      // `subscription` is undefined in some environments; guard defensively
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(subscription as any)?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const trimmed = email.trim().toLowerCase();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: trimmed,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setUser(data.user ?? null);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: "google" });
    setLoading(false);
    if (oauthError) setError(oauthError.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const roleLabel = useMemo(() => (user?.role ? String(user.role) : "Guest"), [user]);

  if (user) {
    return (
      <div>
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
                Signed in as {roleLabel}
              </p>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Log out
            </button>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
          Staff access
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Sign in to continue</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Sign in with your Supabase account (email/password).
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="mt-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800"
            >
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
