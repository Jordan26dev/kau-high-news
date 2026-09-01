"use client";

import { useMemo, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthContext";
import type { Role } from "@/types/user";

type AuthGateProps = {
  children: React.ReactNode;
};

type FormMode = "sign-in" | "sign-up";

const roleOptions: Array<{ value: Role; label: string }> = [
  { value: "Teacher", label: "Teacher" },
  { value: "Writer", label: "Writer" },
];

export default function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<FormMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("Writer");
  const [requestEditor, setRequestEditor] = useState(false);
  const [error, setError] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const roleLabel = useMemo(() => user?.role || "Guest", [user]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingForm(true);
    setError("");

    const trimmed = email.trim().toLowerCase();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: trimmed,
      password,
    });

    setLoadingForm(false);

    if (signInError) {
      setError(signInError.message);
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingForm(true);
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const selectedRole: Role = role;
    const wantsEditor = selectedRole === "Writer" && requestEditor;

    const { error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          name: trimmedName,
          role: selectedRole,
          status: selectedRole === "Writer" && wantsEditor ? "pending" : "active",
          requestedEditor: wantsEditor,
        },
      },
    });

    setLoadingForm(false);

    if (signUpError) {
      setError(signUpError.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-slate-700">
          Loading authentication...
        </div>
      </div>
    );
  }

  return user ? (
    <div>
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              Signed in as {roleLabel}
            </p>
            <p className="text-sm text-slate-600">{user.email}</p>
            {user.status === "pending" ? (
              <p className="text-sm text-amber-700">Your account is pending admin approval.</p>
            ) : null}
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
      {user.status === "pending" ? (
        <div className="mx-auto mt-8 max-w-5xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-sm text-amber-900">
          Your editor request is waiting on admin approval. You can still sign in once approved.
        </div>
      ) : (
        children
      )}
    </div>
  ) : (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              Staff access
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              {mode === "sign-in" ? "Sign in" : "Create account"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Sign in with email/password and choose the account role you need.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
            className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            {mode === "sign-in" ? "Need an account?" : "Already have one?"}
          </button>
        </div>

        <form onSubmit={mode === "sign-in" ? handleLogin : handleSignUp} className="mt-8 space-y-4">
          {mode === "sign-up" ? (
            <label className="block text-sm font-semibold text-slate-700">
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
                placeholder="Your name"
              />
            </label>
          ) : null}

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

          {mode === "sign-up" ? (
            <>
              <label className="block text-sm font-semibold text-slate-700">
                Account type
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as Role)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-700"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <p className="text-xs leading-5 text-slate-500">
                Staff roles are assigned by an administrator after account creation.
              </p>
            </>
          ) : null}

          {mode === "sign-up" && role === "Writer" ? (
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={requestEditor}
                onChange={(event) => setRequestEditor(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-700"
              />
              Request editor access (admin approval required)
            </label>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loadingForm}
            className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loadingForm ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
