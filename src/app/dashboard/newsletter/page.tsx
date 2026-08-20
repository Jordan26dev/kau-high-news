"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import AuthGate from "@/components/AuthGate";
import { useAuth } from "@/components/AuthContext";
import { articles } from "@/data/articles";

type NewsletterDraft = {
  title: string;
  issue: string;
  subtitle: string;
  layout: "classic" | "feature";
  articleSlugs: string[];
};

const defaultDraft: NewsletterDraft = {
  title: "The Kau High Chronicle",
  issue: "Issue 01 • August 2026",
  subtitle: "Student reporting, thoughtfully printed.",
  layout: "classic",
  articleSlugs: articles.slice(0, 4).map((article) => article.slug),
};

export default function NewsletterPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Administrator";
  const [draft, setDraft] = useState<NewsletterDraft>(() => {
    if (typeof window === "undefined") return defaultDraft;
    const stored = window.localStorage.getItem("kau-high-newsletter-draft");
    return stored ? { ...defaultDraft, ...JSON.parse(stored) } : defaultDraft;
  });
  const [saved, setSaved] = useState(false);

  const selectedArticles = useMemo(
    () => draft.articleSlugs
      .map((slug) => articles.find((article) => article.slug === slug))
      .filter((article): article is (typeof articles)[number] => Boolean(article)),
    [draft.articleSlugs]
  );

  const updateDraft = <Key extends keyof NewsletterDraft>(key: Key, value: NewsletterDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const toggleArticle = (slug: string) => {
    const articleSlugs = draft.articleSlugs.includes(slug)
      ? draft.articleSlugs.filter((item) => item !== slug)
      : [...draft.articleSlugs, slug];
    updateDraft("articleSlugs", articleSlugs);
  };

  const saveDraft = () => {
    window.localStorage.setItem("kau-high-newsletter-draft", JSON.stringify(draft));
    setSaved(true);
  };

  const downloadFile = () => {
    const markup = document.querySelector("[data-newsletter-preview]")?.outerHTML ?? "";
    const file = new Blob([`<!doctype html><html><head><meta charset="utf-8"><title>${draft.title}</title><style>body{font-family:Georgia,serif;max-width:900px;margin:40px auto;color:#321212}img{max-width:100%;height:220px;object-fit:cover}article{break-inside:avoid;border-top:1px solid #d9c7ae;padding:18px 0}h1{font-size:48px;margin:0}h2{font-size:28px;margin:8px 0}p{line-height:1.55}</style></head><body>${markup}</body></html>`], { type: "text/html" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return <AuthGate><main className="mx-auto max-w-4xl px-6 py-16"><p className="text-slate-700">This workspace is available to administrators.</p></main></AuthGate>;
  }

  return (
    <AuthGate>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 border-b border-[#d9c7ae] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/dashboard" className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">← Dashboard</Link>
            <h1 className="mt-3 font-serif text-4xl font-bold text-[#3b0a0a] sm:text-5xl">Newsletter desk</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Assemble a printable issue from published stories, then save the layout or export it as a file.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={saveDraft} className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white">{saved ? "Saved" : "Save issue"}</button>
            <button type="button" onClick={() => window.print()} className="rounded-full border border-[#7f1919] bg-white px-4 py-2 text-sm font-semibold text-[#7f1919]">Print issue</button>
            <button type="button" onClick={downloadFile} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800">Save as HTML</button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
          <aside className="newsletter-controls rounded-2xl border border-[#d9c7ae] bg-[#fffdf7] p-5">
            <h2 className="font-serif text-2xl font-bold text-[#3b0a0a]">Issue settings</h2>
            <label className="mt-5 block text-sm font-semibold text-slate-700">Masthead<input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
            <label className="mt-4 block text-sm font-semibold text-slate-700">Issue line<input value={draft.issue} onChange={(event) => updateDraft("issue", event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
            <label className="mt-4 block text-sm font-semibold text-slate-700">Deck<input value={draft.subtitle} onChange={(event) => updateDraft("subtitle", event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-slate-700">Page layout</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["classic", "feature"] as const).map((layout) => <button key={layout} type="button" onClick={() => updateDraft("layout", layout)} className={`rounded-lg border px-3 py-2 text-sm capitalize ${draft.layout === layout ? "border-amber-700 bg-amber-50 text-amber-900" : "border-slate-300 bg-white text-slate-700"}`}>{layout}</button>)}
              </div>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-slate-700">Articles on this issue</legend>
              <div className="mt-3 space-y-3">
                {articles.map((article) => <label key={article.slug} className="flex gap-2 text-sm text-slate-700"><input type="checkbox" checked={draft.articleSlugs.includes(article.slug)} onChange={() => toggleArticle(article.slug)} className="mt-1 accent-[#7f1919]" /><span>{article.title}</span></label>)}
              </div>
            </fieldset>
          </aside>

          <section data-newsletter-preview className={`newsletter-paper ${draft.layout === "feature" ? "newsletter-feature" : ""}`}>
            <header className="border-b-4 border-[#7f1919] pb-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-800">{draft.issue}</p>
              <h2 className="mt-2 font-serif text-5xl font-black tracking-tight text-[#3b0a0a]">{draft.title}</h2>
              <p className="mt-2 font-serif text-lg italic text-slate-600">{draft.subtitle}</p>
            </header>
            <div className="newsletter-articles mt-6">
              {selectedArticles.length === 0 ? <p className="py-16 text-center text-slate-500">Select articles to begin this issue.</p> : selectedArticles.map((article, index) => <article key={article.slug} className={index === 0 ? "newsletter-lead" : ""}>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">{article.category} • {article.date}</p>
                <h3 className="mt-2 font-serif text-3xl font-bold leading-tight text-[#3b0a0a]">{article.title}</h3>
                {index === 0 || draft.layout === "feature" ? <img src={article.image} alt="" className="mt-4 w-full" /> : null}
                <p className="mt-3 text-base leading-7 text-slate-700">{article.summary}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">By {article.author}</p>
              </article>)}
            </div>
          </section>
        </div>
      </main>
    </AuthGate>
  );
}