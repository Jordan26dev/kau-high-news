"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AuthGate from "@/components/AuthGate";
import { useAuth } from "@/components/AuthContext";
import {
  listStaffProfiles,
  updateStaffProfile,
  type StaffProfileRow,
} from "@/lib/articleRepository";

const roles = ["Writer", "Teacher", "Editor", "Managing Editor", "Advisor", "Administrator"];

export default function StaffManagementPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<StaffProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user?.role !== "Administrator") return;

    let active = true;

    async function loadProfiles() {
      try {
        const nextProfiles = await listStaffProfiles();
        if (active) setProfiles(nextProfiles);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load staff profiles.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfiles();
    return () => {
      active = false;
    };
  }, [user?.role]);

  const handleUpdate = async (profileId: string, updates: { role?: string; status?: string }) => {
    setSavingId(profileId);
    setError("");
    setSuccess("");

    try {
      await updateStaffProfile(profileId, updates);
      setProfiles((current) =>
        current.map((profile) =>
          profile.id === profileId ? { ...profile, ...updates } : profile
        )
      );
      setSuccess("Staff profile updated.");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update the staff profile.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AuthGate>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Staff management</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Manage newsroom access</h1>
          </div>
          <Link href="/dashboard" className="text-sm font-semibold text-amber-700 hover:underline">
            Back to dashboard
          </Link>
        </div>

        {user?.role !== "Administrator" ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            Only administrators can manage staff roles and account status.
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {error ? <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
            {success ? <div className="mb-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div> : null}
            {loading ? (
              <p className="text-sm text-slate-600">Loading staff profiles...</p>
            ) : profiles.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">No staff profiles found.</p>
            ) : (
              <div className="space-y-4">
                {profiles.map((profile) => (
                  <div key={profile.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{profile.display_name || "Unnamed staff member"}</p>
                      <p className="mt-1 text-xs text-slate-500">{profile.id}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <label className="text-sm font-semibold text-slate-700">
                        Role
                        <select
                          value={profile.role}
                          disabled={savingId === profile.id}
                          onChange={(event) => void handleUpdate(profile.id, { role: event.target.value })}
                          className="ml-2 rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal"
                        >
                          {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                      </label>
                      <label className="text-sm font-semibold text-slate-700">
                        Status
                        <select
                          value={profile.status}
                          disabled={savingId === profile.id}
                          onChange={(event) => void handleUpdate(profile.id, { status: event.target.value })}
                          className="ml-2 rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                        </select>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </AuthGate>
  );
}
