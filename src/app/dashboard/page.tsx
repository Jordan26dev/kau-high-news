
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import AuthGate from "@/components/AuthGate";
import { useAuth } from "@/components/AuthContext";
import ReviewActions from "@/components/ReviewActions";
import { drafts as initialDrafts } from "@/data/drafts";
import { pendingArticles as initialPendingArticles } from "@/data/pendingArticles";
import { users as accountUsers } from "@/data/users";
import { articles } from "@/data/articles";
import { listDashboardArticles, listStaffProfiles, updateArticleStatus } from "@/lib/articleRepository";
import siteSettings from "@/lib/siteSettings";

type Draft = {
  id: number;
  title: string;
  status: string;
  author: string;
  updatedAt: string;
  pdfName?: string;
};

type PendingArticle = {
  id: number;
  title: string;
  author: string;
  status: string;
  category: string;
  pdfName?: string;
};

type Account = {
  id: number | string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export default function DashboardPage() {
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    if (typeof window === "undefined") {
      return initialDrafts;
    }

    const storedDrafts = window.sessionStorage.getItem("kau-high-drafts");
    return storedDrafts ? JSON.parse(storedDrafts) : initialDrafts;
  });

  const [pendingArticles, setPendingArticles] = useState<PendingArticle[]>(() => {
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

  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboardArticles() {
      setArticlesLoading(true);
      try {
        const rows = await listDashboardArticles();

        if (!active || rows.length === 0) {
          setArticlesLoading(false);
          return;
        }

        const nextDrafts = rows
          .filter((row) => ["draft", "changes_requested"].includes(row.status ?? ""))
          .map((row) => ({
            id: row.id,
            title: row.title ?? "Untitled story",
            status: row.status ?? "Draft",
            author: row.author ?? "Staff writer",
            updatedAt: row.updated_at ? new Date(row.updated_at).toLocaleDateString() : "Recently",
          }));

        const nextPending = rows
          .filter((row) => ["submitted", "in_review", "changes_requested"].includes(row.status ?? ""))
          .map((row) => ({
            id: row.id,
            title: row.title ?? "Untitled story",
            author: row.author ?? "Staff writer",
            status: row.status ?? "Submitted",
            category: row.category ?? "News",
          }));

        const nextPublished = rows
          .filter((row) => row.status === "published")
          .map((row) => row.title ?? "Untitled story");

        setDrafts(nextDrafts.length > 0 ? nextDrafts : initialDrafts);
        setPendingArticles(nextPending.length > 0 ? nextPending : initialPendingArticles);
        setPublishedArticles(nextPublished.length > 0 ? nextPublished : []);
      } catch {
        // fallback to local demo data in the same way the app already supports
      } finally {
        setArticlesLoading(false);
      }
    }

    loadDashboardArticles();

    return () => {
      active = false;
    };
  }, []);

  const [contentOrder, setContentOrder] = useState<string[]>(() => {
    const defaultOrder = ["Top stories", "Photo of the week", "Upcoming events"];
    if (typeof window === "undefined") {
      return defaultOrder;
    }
    const storedOrder = window.localStorage.getItem("kau-high-content-order");
    return storedOrder ? JSON.parse(storedOrder) : defaultOrder;
  });

  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>(() => {
    const defaultVisibility = {
      "Top stories": true,
      "Photo of the week": true,
      "Upcoming events": true,
    };
    if (typeof window === "undefined") {
      return defaultVisibility;
    }
    const storedVisibility = window.localStorage.getItem("kau-high-section-visibility");
    return storedVisibility ? JSON.parse(storedVisibility) : defaultVisibility;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("kau-high-drafts", JSON.stringify(drafts));
    }
  }, [drafts]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("kau-high-pending-articles", JSON.stringify(pendingArticles));
    }
  }, [pendingArticles]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("kau-high-published-articles", JSON.stringify(publishedArticles));
    }
  }, [publishedArticles]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kau-high-content-order", JSON.stringify(contentOrder));
    }
  }, [contentOrder]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kau-high-section-visibility", JSON.stringify(sectionVisibility));
    }
  }, [sectionVisibility]);

  const handleApprove = async (id: number) => {
    const approvedArticle = pendingArticles.find((article: PendingArticle) => article.id === id);

    try {
      await updateArticleStatus(id, "published");
    } catch {
      // allow the local dashboard to continue even if the write is unavailable
    }

    if (!approvedArticle) {
      return;
    }

    setPendingArticles((currentArticles: PendingArticle[]) =>
      currentArticles.filter((article: PendingArticle) => article.id !== id)
    );
    setPublishedArticles((currentArticles) => [approvedArticle.title, ...currentArticles]);
  };

  const handleRequestRevision = async (id: number) => {
    try {
      await updateArticleStatus(id, "changes_requested");
    } catch {
      // allow the local dashboard to continue even if the write is unavailable
    }

    setPendingArticles((currentArticles: PendingArticle[]) =>
      currentArticles.map((article: PendingArticle) =>
        article.id === id ? { ...article, status: "Needs Revision" } : article
      )
    );
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    setContentOrder((currentOrder) => {
      const updated = [...currentOrder];
      const [item] = updated.splice(index, 1);
      updated.splice(index + direction, 0, item);
      return updated;
    });
  };

  const toggleSection = (section: string) => {
    setSectionVisibility((currentVisibility) => ({
      ...currentVisibility,
      [section]: !currentVisibility[section],
    }));
  };

  const { user } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>(() => {
    if (typeof window === "undefined") return accountUsers;
    const stored = window.localStorage.getItem("kau-high-accounts");
    return stored ? JSON.parse(stored) : accountUsers;
  });

  useEffect(() => {
    if (user?.role !== "Administrator") return;

    let active = true;

    async function loadProfiles() {
      try {
        const profiles = await listStaffProfiles();
        if (!active || profiles.length === 0) return;

        setAccounts(
          profiles.map((profile) => ({
            id: profile.id,
            name: profile.display_name || "Unnamed staff member",
            email: "",
            role: profile.role,
            status: profile.status,
          }))
        );
      } catch {
        // Keep the existing demo account fallback when profiles are unavailable.
      }
    }

    void loadProfiles();

    return () => {
      active = false;
    };
  }, [user?.role]);

  const [underDevelopment, setUnderDevelopment] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("kau-high-under-development") === "true";
  });

  const [featuredSlug, setFeaturedSlug] = useState(() => {
    if (typeof window === "undefined") return articles[0]?.slug ?? "";
    return window.localStorage.getItem("kau-high-featured-slug") ?? articles[0]?.slug ?? "";
  });

  // Persist accounts, dev mode and featured slug
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kau-high-accounts", JSON.stringify(accounts));
    }
  }, [accounts]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kau-high-under-development", String(underDevelopment));
    }
  }, [underDevelopment]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kau-high-featured-slug", featuredSlug);
    }
  }, [featuredSlug]);

  const [featuredImage, setFeaturedImage] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("kau-high-featured-image") ?? "";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kau-high-featured-image", featuredImage);
    }
  }, [featuredImage]);

  // load settings from Supabase (or fallback) on first render
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const dev = await siteSettings.getUnderDevelopment();
        const featured = await siteSettings.getFeatured();
        if (!mounted) return;
        if (dev !== null && dev !== undefined) setUnderDevelopment(Boolean(dev));
        if (featured?.slug) setFeaturedSlug(featured.slug as string);
        if (featured?.image) setFeaturedImage(featured.image as string);
      } catch (e) {
        // ignore; fallbacks already read from localStorage
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const isReviewer = user?.role === "Teacher" || user?.role === "Editor" || user?.role === "Administrator";
  const isAdmin = user?.role === "Administrator";
  const isWriter = user?.role === "Writer";
  const canCreateDraft = isWriter || isAdmin;
  const dashboardRoleLabel = isAdmin
    ? "Administrator workspace"
    : isReviewer
    ? "Editorial workspace"
    : isWriter
    ? "Writer workspace"
    : "Staff workspace";
  const dashboardTitle = isAdmin ? "Admin dashboard" : isReviewer ? "Editorial dashboard" : "Writer dashboard";

  const dashboardSections = useMemo(
    () => [
      {
        title: "Drafts",
        description: "Create and manage draft stories before publishing.",
        count: drafts.length,
      },
      {
        title: "Pending Review",
        description: "Track stories waiting for review.",
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
      <div className="border-y-2 border-[#7f1919] bg-white p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
          {dashboardRoleLabel}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-slate-900">{dashboardTitle}</h1>
        <p className="mt-3 text-lg text-slate-600">
          A role-aware newsroom experience designed to help your team move from draft to publish faster.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          {isAdmin
            ? "Manage the site layout, review workflow, and view all account roles from one dashboard."
            : isReviewer
            ? "Approve stories, request revisions, and keep the newsroom moving."
            : isWriter
            ? "Upload reporting PDFs, submit drafts, and track your publishing progress."
            : "Use your account to access the newsroom."}
        </p>
      </div>

      {isAdmin ? (
        <div className="mt-6 border-y border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Admin controls</p>
              <p className="mt-2">Admins can manage site ordering, adjust homepage sections, and review every account role.</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={async () => {
                  const next = !underDevelopment;
                  setUnderDevelopment(next);
                  try {
                    await siteSettings.setUnderDevelopment(next);
                  } catch (e) {
                    // ignore
                  }
                }}
                className="rounded-full border border-amber-700 bg-white/90 px-3 py-2 text-sm font-semibold text-amber-700"
              >
                {underDevelopment ? "Disable dev mode" : "Enable dev mode"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  setDrafts([]);
                  setPendingArticles([]);
                  setPublishedArticles([]);
                  try {
                    await siteSettings.clearDemoData();
                  } catch (e) {
                    // ignore
                  }
                  if (typeof window !== "undefined") {
                    window.sessionStorage.removeItem("kau-high-drafts");
                    window.sessionStorage.removeItem("kau-high-pending-articles");
                    window.sessionStorage.removeItem("kau-high-published-articles");
                  }
                }}
                className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
              >
                Clear demo content
              </button>
              <button
                type="button"
                onClick={async () => {
                  setAccounts([]);
                  try {
                    await siteSettings.clearDemoData();
                  } catch (e) {
                    // ignore
                  }
                }}
                className="rounded-full border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-600"
              >
                Remove demo accounts
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-8 border-y border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Quick actions</h2>
            <p className="mt-2 text-sm text-slate-600">
              {canCreateDraft
                ? "Create content, manage stories, and keep the site posting in the right order."
                : "Track your stories and stay up to date with the latest newsroom activity."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {canCreateDraft ? (
              <Link href="/dashboard/new" className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">
                New article
              </Link>
            ) : null}
            {isAdmin ? (
              <Link href="/dashboard/newsletter" className="rounded-full border border-amber-700 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100">
                Design newsletter
              </Link>
            ) : null}
            {isAdmin ? (
              <Link href="/dashboard/staff" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                Manage staff
              </Link>
            ) : null}
            {(isReviewer || isAdmin) ? (
              <Link
                href="/dashboard/review"
                className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Review queue
              </Link>
            ) : null}
            <Link href="/" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900">
              View latest stories
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {articlesLoading ? (
          <>
            <div className="h-32 rounded-2xl border border-slate-200 bg-slate-50 p-6 animate-pulse" />
            <div className="h-32 rounded-2xl border border-slate-200 bg-slate-50 p-6 animate-pulse" />
            <div className="h-32 rounded-2xl border border-slate-200 bg-slate-50 p-6 animate-pulse" />
          </>
        ) : (
          dashboardSections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {section.title}
              </p>
              <p className="mt-4 text-4xl font-bold text-slate-900">{section.count}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{section.description}</p>
            </div>
          ))
        )}
      </div>

      {isAdmin ? (
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Site layout & order</h2>
            <p className="mt-2 text-sm text-slate-600">
              Adjust the order of homepage sections and turn sections on or off for a cleaner student newspaper experience.
            </p>
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Homepage order</h3>
                <ul className="mt-4 space-y-2">
                  {contentOrder.map((section, index) => (
                    <li key={section} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <span>{index + 1}. {section}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveSection(index, -1)}
                          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={index === contentOrder.length - 1}
                          onClick={() => moveSection(index, 1)}
                          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ↓
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Show section</h3>
                <div className="mt-4 space-y-3">
                  {Object.entries(sectionVisibility).map(([section, visible]) => (
                    <label key={section} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={visible}
                        onChange={() => toggleSection(section)}
                        className="h-4 w-4 rounded border-slate-300 text-amber-600"
                      />
                      <span className="text-sm text-slate-700">{section}</span>
                    </label>
                  ))}
                </div>
              </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Featured article</h3>
                  <div className="mt-4 space-y-3">
                    <select
                      value={featuredSlug}
                      onChange={async (e) => {
                        const slug = e.target.value;
                        setFeaturedSlug(slug);
                        try {
                          await siteSettings.setFeatured(slug, featuredImage || undefined);
                        } catch (err) {
                          // ignore
                        }
                      }}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    >
                      {articles.map((a) => (
                        <option key={a.slug} value={a.slug}>
                          {a.title}
                        </option>
                      ))}
                    </select>

                    <label className="block text-sm font-medium text-slate-700">
                      Featured image URL (optional)
                      <input
                        value={featuredImage}
                        onChange={async (e) => {
                          const img = e.target.value;
                          setFeaturedImage(img);
                          try {
                            await siteSettings.setFeatured(featuredSlug || undefined, img || undefined);
                          } catch (err) {
                            // ignore
                          }
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                      />
                    </label>

                    <div className="mt-2">
                      <p className="text-sm text-slate-600">Preview</p>
                      <div className="mt-2 h-36 w-full overflow-hidden rounded-lg bg-slate-100">
                        <img
                          src={featuredImage || (articles.find((a) => a.slug === featuredSlug)?.image ?? "")}
                          alt="Featured preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Team accounts</h2>
            <p className="mt-2 text-sm text-slate-600">See every account role in the newsroom and who has active access.</p>
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-semibold text-slate-900">{account.name}</td>
                      <td className="px-4 py-3">{account.email}</td>
                      <td className="px-4 py-3">{account.role}</td>
                      <td className="px-4 py-3 text-slate-600">{account.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Draft queue</h2>
              <p className="mt-1 text-sm text-slate-600">
                {isWriter
                  ? "Create and manage your drafts before submitting them for review."
                  : "Review drafts and help writers refine their stories."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {canCreateDraft ? (
                <Link href="/dashboard/new" className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">
                  New article
                </Link>
              ) : null}
              <Link href="/" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                View latest stories
              </Link>
            </div>
        </div>

        <div className="mt-6 space-y-3">
          {drafts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
              <p className="font-semibold">No drafts yet</p>
              <p className="mt-1">Start writing your first story.</p>
              {canCreateDraft ? (
                <Link href="/dashboard/new" className="mt-4 inline-block rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">
                  Create article
                </Link>
              ) : null}
            </div>
          ) : (
            drafts.map((draft) => (
              <div key={draft.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{draft.title}</p>
                  <p className="text-sm text-slate-600">
                    {draft.author} • {draft.updatedAt}
                  </p>
                  {draft.pdfName ? (
                    <p className="mt-1 text-sm text-amber-700">PDF attached: {draft.pdfName}</p>
                  ) : null}
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {draft.status}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900">Pending review</h3>
          <div className="mt-4 space-y-3">
            {pendingArticles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                <p className="font-semibold">No articles waiting for review</p>
                <p className="mt-1">All submissions have been processed.</p>
              </div>
            ) : (
              pendingArticles.map((article) => (
                <div key={article.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{article.title}</p>
                    <p className="text-sm text-slate-600">
                      {article.author} • {article.category}
                    </p>
                    {article.pdfName ? (
                      <p className="mt-1 text-sm text-amber-700">PDF attached: {article.pdfName}</p>
                    ) : null}
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
              ))
            )}
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
