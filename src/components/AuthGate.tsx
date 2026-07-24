"use client";

import { useEffect, useMemo, useState } from "react";

import { users } from "@/data/users";

type AuthGateProps = {
  children: React.ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<(typeof users)[number] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = window.sessionStorage.getItem("kau-high-user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    const matchedUser = users.find(
      (candidate) =>
        candidate.email === email.trim().toLowerCase() &&
        candidate.password === password
    );

    if (!matchedUser) {
      setError("Invalid email or password.");
      return;
    }

    setUser(matchedUser);
    window.sessionStorage.setItem("kau-high-user", JSON.stringify(matchedUser));
    setError("");
  };

  const handleLogout = () => {
    setUser(null);
    window.sessionStorage.removeItem("kau-high-user");
  };

  const roleLabel = useMemo(() => user?.role || "Guest", [user]);

  if (user) {
    return (
      <div>
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
                Signed in as {roleLabel}
              </p>
              <p className="text-sm text-slate-600">{user.name}</p>
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
          Use editor@kauhigh.edu, admin@kauhigh.edu, or writer@kauhigh.edu with the password password123.
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
            className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
