"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import AuthGate from "@/components/AuthGate";
import ReviewActions from "@/components/ReviewActions";
import { drafts as initialDrafts } from "@/data/drafts";
import { pendingArticles as initialPendingArticles } from "@/data/pendingArticles";

export default function DashboardPage() {
  const [drafts] = useState(() => {
    if (typeof window === "undefined") {
      return initialDrafts;
    }

    const storedDrafts = window.sessionStorage.getItem("kau-high-drafts");
    return storedDrafts ? JSON.parse(storedDrafts) : initialDrafts;
  });

  const [pendingArticles, setPendingArticles] = useState(() => {
    if (typeof window === "undefined") {
      return initialPendingArticles;
    }

    const storedPendingArticles = window.sessionStorage.getItem("kau-high-pending-articles");
    return storedPendingArticles ? JSON.parse(storedPendingArticles) : initialPendingArticles;
  });

  const [publishedArticles, setPublishedArticles] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const storedPublishedArticles = window.sessionStorage.getItem("kau-high-published-articles");
    return storedPublishedArticles ? JSON.parse(storedPublishedArticles) : [];
  });

  useEffect(() => {
    window.sessionStorage.setItem("kau-high-drafts", JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    window.sessionStorage.setItem("kau-high-pending-articles", JSON.stringify(pendingArticles));
  }, [pendingArticles]);

  useEffect(() => {
    window.sessionStorage.setItem("kau-high-published-articles", JSON.stringify(publishedArticles));
  }, [publishedArticles]);

  const handleApprove = (id: number) => {
    const approvedArticle = pendingArticles.find((article) => article.id === id);

    if (!approvedArticle) {
      return;
    }

    setPendingArticles((currentArticles) =>
      currentArticles.filter((article) => article.id !== id)
    );
    setPublishedArticles((currentArticles) => [approvedArticle.title, ...currentArticles]);
  };

  const handleRequestRevision = (id: number) => {
    setPendingArticles((currentArticles) =>
      currentArticles.map((article) =>
        article.id === id ? { ...article, status: "Needs Revision" } : article
      )
    );
  };

  const dashboardSections = useMemo(
    () => [
      {
        title: "Drafts",
        description: "Create and manage draft stories before publishing.",
        count: drafts.length,
      },
      {
        title: "Pending Review",
        description: "Track stories waiting for teacher approval.",
        count: pendingArticles.length,
      },
      {
        title: "Published",
        description: "View articles that have already gone live.",
        count: publishedArticles.length,
      },
    ],
    [drafts.length, pendingArticles.length, publishedArticles.length]
  );

  return (
    <AuthGate>
      <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
          Staff dashboard
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Editor dashboard</h1>
        <p className="mt-3 text-lg text-slate-600">
          A simple workspace for managing upcoming stories, approvals, and published content.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {dashboardSections.map((section) => (
          <div key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {section.title}
            </p>
            <p className="mt-4 text-4xl font-bold text-slate-900">{section.count}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{section.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900">Draft queue</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/new" className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white">
              New draft
            </Link>
            <Link href="/" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              View latest stories
            </Link>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {drafts.map((draft) => (
            <div key={draft.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{draft.title}</p>
                <p className="text-sm text-slate-600">
                  {draft.author} • {draft.updatedAt}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {draft.status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900">Pending review</h3>
          <div className="mt-4 space-y-3">
            {pendingArticles.map((article) => (
              <div key={article.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{article.title}</p>
                  <p className="text-sm text-slate-600">
                    {article.author} • {article.category}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 md:items-end">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                    {article.status}
                  </span>
                  <ReviewActions
                    articleId={article.id}
                    onApprove={handleApprove}
                    onRequestRevision={handleRequestRevision}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900">Published queue</h3>
          <div className="mt-4 space-y-3">
            {publishedArticles.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                Approved stories will appear here once they are published.
              </p>
            ) : (
              publishedArticles.map((title, index) => (
                <div key={`${title}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800">
                  {title}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </main>
    </AuthGate>
  );
}
