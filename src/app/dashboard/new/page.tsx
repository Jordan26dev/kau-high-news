"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const categories = ["News", "Sports", "Clubs"];

export default function NewDraftPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("News");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    const storedDrafts = window.sessionStorage.getItem("kau-high-drafts");
    if (storedDrafts) {
      setDraftCount(JSON.parse(storedDrafts).length);
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newDraft = {
      id: Date.now(),
      title,
      status: "Draft",
      author: "You",
      updatedAt: "Just now",
    };

    const existingDrafts = window.sessionStorage.getItem("kau-high-drafts");
    const drafts = existingDrafts ? JSON.parse(existingDrafts) : [];
    const nextDrafts = [newDraft, ...drafts];

    window.sessionStorage.setItem("kau-high-drafts", JSON.stringify(nextDrafts));
    setDraftCount(nextDrafts.length);
    setSubmitted(true);
    setTitle("");
    setSummary("");
    setContent("");
    setCategory("News");
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
