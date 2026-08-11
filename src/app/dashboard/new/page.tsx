"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/AuthContext";
import { editors } from "@/data/editors";

const categories = ["News", "Sports", "Clubs"];

export default function NewDraftPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("News");
  const [content, setContent] = useState("");
  const [selectedEditorId, setSelectedEditorId] = useState(editors[0]?.id ?? null);
  const [submitted, setSubmitted] = useState(false);

  const selectedEditor = editors.find((editor) => editor.id === selectedEditorId) ?? editors[0];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newDraft = {
      id: Date.now(),
      title,
      summary,
      category,
      content,
      status: "Draft",
      author: user?.name || "You",
      editor: selectedEditor?.name || "Unassigned",
      updatedAt: "Just now",
    };

    const existingDrafts = window.sessionStorage.getItem("kau-high-drafts");
    const drafts = existingDrafts ? JSON.parse(existingDrafts) : [];
    const nextDrafts = [newDraft, ...drafts];

    window.sessionStorage.setItem("kau-high-drafts", JSON.stringify(nextDrafts));
    setSubmitted(true);
    setTitle("");
    setSummary("");
    setContent("");
    setCategory("News");
    setSelectedEditorId(editors[0]?.id ?? null);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
            New draft
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Create a new story</h1>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold text-blue-700 hover:underline">
          Back to dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
              placeholder="Story title"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Summary
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            className="mt-2 min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            placeholder="Short summary"
          />
        </label>

        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Full content
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="mt-2 min-h-60 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            placeholder="Write the full article"
          />
        </label>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-700">Assign an editor</p>
            <select
              value={selectedEditorId ?? undefined}
              onChange={(event) => setSelectedEditorId(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-700"
            >
              {editors.map((editor) => (
                <option key={editor.id} value={editor.id}>
                  {editor.name} ({editor.tasks} tasks)
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Editor workload</p>
            <p className="mt-3 text-sm text-slate-600">
              {selectedEditor?.name} currently has {selectedEditor?.tasks} assigned task{selectedEditor?.tasks === 1 ? "" : "s"}.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Submit for review
          </button>
          <Link href="/dashboard" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
            Cancel
          </Link>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            Draft submitted successfully. It has been added to the dashboard queue and will appear in the review flow.
          </div>
        ) : null}
      </form>
    </main>
  );
}
