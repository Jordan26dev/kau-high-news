"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/AuthContext";
import { editors } from "@/data/editors";
import { createArticle, publishArticle } from "@/lib/articleRepository";

const categories = ["News", "Sports", "Clubs"];

export default function NewDraftPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("News");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [selectedEditorId, setSelectedEditorId] = useState(editors[0]?.id ?? null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === "Administrator";
  const selectedEditor = editors.find((editor) => editor.id === selectedEditorId) ?? editors[0];

  const submitArticle = async (nextStatus: "draft" | "submitted") => {
    setSaving(true);
    setError("");

    const newDraft = {
      id: Date.now(),
      title,
      subtitle,
      summary,
      category,
      tags,
      content,
      heroImage,
      imageCaption,
      pdfName: pdfName || undefined,
      status: nextStatus === "submitted" ? "Submitted" : "Draft",
      author: user?.name || "You",
      editor: selectedEditor?.name || "Unassigned",
      updatedAt: "Just now",
    };

    try {
      const savedArticle = await createArticle({
        title,
        subtitle,
        summary,
        category,
        tags: tags.split(",").map(t => t.trim()).filter(t => t),
        content,
        heroImage,
        imageCaption,
        authorId: user?.id ?? "",
        authorName: user?.name || "You",
        status: nextStatus,
      });

      if (nextStatus === "submitted" && isAdmin) {
        await publishArticle(savedArticle.id);
        const storedPublishedArticles = window.sessionStorage.getItem("kau-high-published-articles");
        const publishedArticles = storedPublishedArticles ? JSON.parse(storedPublishedArticles) : [];
        window.sessionStorage.setItem("kau-high-published-articles", JSON.stringify([newDraft.title, ...publishedArticles]));
      }

      if (nextStatus === "draft") {
        const existingDrafts = window.sessionStorage.getItem("kau-high-drafts");
        const drafts = existingDrafts ? JSON.parse(existingDrafts) : [];
        window.sessionStorage.setItem("kau-high-drafts", JSON.stringify([newDraft, ...drafts]));
      }

      if (nextStatus === "submitted") {
        const existingDrafts = window.sessionStorage.getItem("kau-high-drafts");
        const drafts = existingDrafts ? JSON.parse(existingDrafts) : [];
        window.sessionStorage.setItem("kau-high-drafts", JSON.stringify([newDraft, ...drafts]));
      }

      setSubmitted(true);
      setTitle("");
      setSubtitle("");
      setSummary("");
      setTags("");
      setContent("");
      setHeroImage("");
      setImageCaption("");
      setCategory("News");
      setPdfName("");
      setSelectedEditorId(editors[0]?.id ?? null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save the article. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await submitArticle(isAdmin ? "submitted" : "submitted");
  };

  const handleSaveDraft = async () => {
    await submitArticle("draft");
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            New draft
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Create a new story</h1>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold text-amber-700 hover:underline">
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
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
              placeholder="Story title"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
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
          Subtitle / Dek (optional)
          <input
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
            placeholder="Brief subtitle or summary line"
          />
        </label>

        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Summary
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            className="mt-2 min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
            placeholder="Short summary (50-100 words)"
          />
        </label>

        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Tags (comma-separated, optional)
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
            placeholder="e.g., breaking news, feature, opinion"
          />
        </label>

        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Full content
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="mt-2 min-h-60 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
            placeholder="Write the full article"
          />
        </label>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">
            Hero image URL (optional)
            <input
              value={heroImage}
              onChange={(event) => setHeroImage(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
              placeholder="https://example.com/image.jpg"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Image caption (optional)
            <input
              value={imageCaption}
              onChange={(event) => setImageCaption(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-700"
              placeholder="Credit or caption for the image"
            />
          </label>
        </div>

        {heroImage && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Preview</p>
            <div className="mt-3 h-48 w-full overflow-hidden rounded-lg bg-slate-100">
              <img
                src={heroImage}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={() => {
                  /* silently fail if image URL is invalid */
                }}
              />
            </div>
          </div>
        )}

        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Upload PDF
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setPdfName(event.target.files?.[0]?.name ?? "")}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none"
          />
          {pdfName ? (
            <p className="mt-2 text-sm text-amber-700">Selected file: {pdfName}</p>
          ) : (
            <p className="mt-2 text-sm text-slate-500">PDFs make articles easier to review and publish.</p>
          )}
        </label>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-700">Assign an editor</p>
            <select
              value={selectedEditorId ?? undefined}
              onChange={(event) => setSelectedEditorId(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-amber-700"
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
            type="button"
            onClick={handleSaveDraft}
            disabled={saving || !title.trim() || !summary.trim() || !content.trim()}
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save draft"}
          </button>
          <button
            type="submit"
            disabled={saving || !title.trim() || !summary.trim() || !content.trim()}
            className="rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Submitting..." : isAdmin ? "Publish now" : "Submit for review"}
          </button>
          <Link href="/dashboard" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
            Cancel
          </Link>
        </div>

        {error ? (
          <div className="mt-6 border-y border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {submitted ? (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            Draft submitted successfully. It has been added to the dashboard queue and will appear in the review flow.
          </div>
        ) : null}
      </form>
    </main>
  );
}
