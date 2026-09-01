"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import AuthGate from "@/components/AuthGate";
import { useAuth } from "@/components/AuthContext";
import {
  addEditorialNote,
  listArticleHistory,
  listEditorialNotes,
  type ArticleHistoryEntry,
  type EditorialNote,
} from "@/lib/articleRepository";
import supabase from "@/lib/supabaseClient";

type ArticleFormState = {
  title: string;
  summary: string;
  category: string;
  content: string;
  status: string;
};

export default function EditArticlePage() {
  const params = useParams();
  const articleId = Number(params?.id);
  const { user } = useAuth();
  const [form, setForm] = useState<ArticleFormState>({
    title: "",
    summary: "",
    category: "News",
    content: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<EditorialNote[]>([]);
  const [history, setHistory] = useState<ArticleHistoryEntry[]>([]);

  const canEdit =
    user &&
    ["Writer", "Teacher", "Editor", "Managing Editor", "Advisor", "Administrator"].includes(user.role);

  useEffect(() => {
    if (!articleId || !user) return;

    async function loadArticle() {
      setLoading(true);
      setError("");

      try {
        const { data, error: fetchError } = await supabase
          .from("articles")
          .select("title, summary, category, content, status")
          .eq("id", articleId)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          setError("The requested article could not be found.");
          return;
        }

        setForm({
          title: data.title ?? "",
          summary: data.summary ?? "",
          category: data.category ?? "News",
          content: data.content ?? "",
          status: data.status ?? "draft",
        });

        const [nextNotes, nextHistory] = await Promise.all([
          listEditorialNotes(articleId),
          listArticleHistory(articleId),
        ]);
        setNotes(nextNotes);
        setHistory(nextHistory);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load this article.");
      } finally {
        setLoading(false);
      }
    }

    void loadArticle();
  }, [articleId, user]);

  const handleChange = (field: keyof ArticleFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSuccess("");
  };

  const handleAddNote = async () => {
    if (!user?.id || !note.trim() || !articleId) return;

    setError("");
    setSuccess("");

    try {
      await addEditorialNote(articleId, user.id, note);
      setNotes(await listEditorialNotes(articleId));
      setNote("");
      setSuccess("Editorial note added.");
    } catch (noteError) {
      setError(noteError instanceof Error ? noteError.message : "Unable to save the editorial note.");
    }
  };

  const handleSave = async () => {
    if (!articleId) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { error: updateError } = await supabase
        .from("articles")
        .update({
          title: form.title,
          summary: form.summary,
          category: form.category,
          content: form.content,
          status: form.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", articleId);

      if (updateError) {
        throw updateError;
      }

      setSuccess("Article saved successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save the article.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGate>
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Article editor</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Edit story</h1>
          </div>
          <Link href="/dashboard/review" className="text-sm font-semibold text-amber-700 hover:underline">
            Back to review queue
          </Link>
        </div>

        {!canEdit ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            You do not have access to edit newsroom articles.
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            {error ? <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
            {success ? <div className="mb-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div> : null}

            {loading ? (
              <p className="text-sm text-slate-600">Loading article...</p>
            ) : (
              <div className="space-y-6">
                <label className="block text-sm font-semibold text-slate-700">
                  Title
                  <input
                    value={form.title}
                    onChange={(event) => handleChange("title", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Summary
                  <textarea
                    value={form.summary}
                    onChange={(event) => handleChange("summary", event.target.value)}
                    className="mt-2 min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
                  />
                </label>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Category
                    <select
                      value={form.category}
                      onChange={(event) => handleChange("category", event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-amber-700"
                    >
                      <option value="News">News</option>
                      <option value="Sports">Sports</option>
                      <option value="Clubs">Clubs</option>
                    </select>
                  </label>

                  <label className="block text-sm font-semibold text-slate-700">
                    Status
                    <select
                      value={form.status}
                      onChange={(event) => handleChange("status", event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-amber-700"
                    >
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="in_review">In review</option>
                      <option value="approved">Approved</option>
                      <option value="changes_requested">Changes requested</option>
                      <option value="published">Published</option>
                    </select>
                  </label>
                </div>

                <label className="block text-sm font-semibold text-slate-700">
                  Content
                  <textarea
                    value={form.content}
                    onChange={(event) => handleChange("content", event.target.value)}
                    className="mt-2 min-h-72 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
                  />
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={saving || !form.title.trim() || !form.content.trim()}
                    className="rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                  <Link href="/dashboard/review" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                    Cancel
                  </Link>
                </div>

                <section className="border-t border-slate-200 pt-6">
                  <h2 className="text-xl font-semibold text-slate-900">Private editorial notes</h2>
                  <p className="mt-2 text-sm text-slate-600">Notes are visible only to authorized newsroom staff.</p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Leave a note for the newsroom"
                      className="min-h-24 flex-1 rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
                    />
                    <button
                      type="button"
                      onClick={() => void handleAddNote()}
                      disabled={!note.trim()}
                      className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Add note
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {notes.length === 0 ? (
                      <p className="text-sm text-slate-500">No editorial notes yet.</p>
                    ) : (
                      notes.map((entry) => (
                        <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                          <p>{entry.note}</p>
                          <p className="mt-2 text-xs text-slate-500">{new Date(entry.created_at).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="border-t border-slate-200 pt-6">
                  <h2 className="text-xl font-semibold text-slate-900">Article history</h2>
                  <div className="mt-4 space-y-3">
                    {history.length === 0 ? (
                      <p className="text-sm text-slate-500">No status changes recorded yet.</p>
                    ) : (
                      history.map((entry) => (
                        <div key={entry.id} className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
                          <span>
                            {entry.previous_status ?? "Created"} to {entry.new_status ?? "Updated"}
                          </span>
                          <span className="text-xs text-slate-500">{new Date(entry.created_at).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}
      </main>
    </AuthGate>
  );
}
