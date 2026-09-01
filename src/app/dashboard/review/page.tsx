"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AuthGate from "@/components/AuthGate";
import { useAuth } from "@/components/AuthContext";
import { listDashboardArticles, updateArticleStatus } from "@/lib/articleRepository";

type ReviewItem = {
  id: number;
  title: string;
  author: string;
  category: string;
  status: string;
  updatedAt: string;
};

export default function ReviewQueuePage() {
  const { user } = useAuth();
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canReview =
    user &&
    ["Teacher", "Editor", "Managing Editor", "Advisor", "Administrator"].includes(user.role);

  const loadQueue = async () => {
    setLoading(true);
    setError("");

    try {
      const rows = await listDashboardArticles();
      const queued = rows
        .filter((row) => ["submitted", "in_review", "changes_requested", "approved", "published"].includes(row.status ?? ""))
        .map((row) => ({
          id: row.id,
          title: row.title ?? "Untitled story",
          author: row.author ?? "Staff writer",
          category: row.category ?? "News",
          status: row.status ?? "submitted",
          updatedAt: row.updated_at ? new Date(row.updated_at).toLocaleDateString() : "Recently",
        }));

      setItems(queued);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load the review queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const timeoutId = window.setTimeout(() => {
      void loadQueue();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [user]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateArticleStatus(id, status);
      await loadQueue();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update the article.");
    }
  };

  return (
    <AuthGate>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Review queue</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Editorial review</h1>
          </div>
          <Link href="/dashboard" className="text-sm font-semibold text-amber-700 hover:underline">
            Back to dashboard
          </Link>
        </div>

        {!canReview ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            Only staff with editorial access can review submitted stories.
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {error ? <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

            {loading ? (
              <p className="text-sm text-slate-600">Loading review queue...</p>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
                No articles are waiting for review right now. You’re all caught up.
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.author} • {item.category} • {item.updatedAt}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                          {item.status}
                        </span>
                        <Link
                          href={`/dashboard/articles/${item.id}/edit`}
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                        >
                          Open article
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleStatusChange(item.id, "approved")}
                          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleStatusChange(item.id, "changes_requested")}
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                          Request changes
                        </button>
                      </div>
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
