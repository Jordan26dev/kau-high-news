"use client";

import { useMemo, useState, useEffect } from "react";

import AboutSection from "@/components/AboutSection";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import FeaturedArticle from "@/components/FeaturedArticle";
import CategoryFilters from "@/components/CategoryFilters";
import CategorySpotlight from "@/components/CategorySpotlight";
import NewsCard from "@/components/NewsCard";
import EditorNote from "@/components/EditorNote";
import NewsletterCallout from "@/components/NewsletterCallout";
import PhotoOfWeek from "@/components/PhotoOfWeek";
import SearchBar from "@/components/SearchBar";
import StaffSection from "@/components/StaffSection";
import TopStories from "@/components/TopStories";
import UpcomingEvents from "@/components/UpcomingEvents";

import { articles } from "@/data/articles";
import { listPublishedArticles } from "@/lib/articleRepository";
import siteSettings from "@/lib/siteSettings";

export default function Home() {
  const [publishedArticles, setPublishedArticles] = useState(articles);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [underDevelopment, setUnderDevelopment] = useState(false);
  const [featuredSlug, setFeaturedSlug] = useState(articles[0]?.slug ?? "");
  const [featuredImage, setFeaturedImage] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const dev = await siteSettings.getUnderDevelopment();
        const featured = await siteSettings.getFeatured();
        if (!mounted) return;
        setUnderDevelopment(Boolean(dev));
        if (featured?.slug) setFeaturedSlug(featured.slug as string);
        if (featured?.image) setFeaturedImage(featured.image as string);
      } catch (e) {
        if (typeof window === "undefined") return;
        const dev = window.localStorage.getItem("kau-high-under-development");
        const featured = window.localStorage.getItem("kau-high-featured-slug");
        setUnderDevelopment(dev === "true");
        if (featured) setFeaturedSlug(featured);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadPublishedArticles() {
      try {
        const nextArticles = await listPublishedArticles();
        if (mounted && nextArticles.length > 0) setPublishedArticles(nextArticles);
      } catch {
        // Keep the local published demo stories available when Supabase is unavailable.
      }
    }

    void loadPublishedArticles();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(publishedArticles.map((article) => article.category))
    );

    return ["All", ...uniqueCategories];
  }, [publishedArticles]);

  const featuredCategories = useMemo(() => {
    const counts = publishedArticles.reduce<Record<string, number>>((accumulator, article) => {
      accumulator[article.category] = (accumulator[article.category] || 0) + 1;
      return accumulator;
    }, {});

    return [
      { name: "Sports", description: "Game coverage and team updates", count: counts.Sports || 0 },
      { name: "News", description: "Campus events and student life", count: counts.News || 0 },
      { name: "Clubs", description: "Student organizations and achievements", count: counts.Clubs || 0 },
    ];
  }, [publishedArticles]);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return publishedArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" || article.category === selectedCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [article.title, article.summary, article.category, ...article.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [publishedArticles, searchTerm, selectedCategory]);

  return (
    <main className="min-h-screen bg-slate-100">
      {underDevelopment ? (
        <section className="min-h-screen flex items-center justify-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Site Under Development</h2>
            <p className="mt-3 text-sm text-slate-600">The site is temporarily in development mode. Sign in to the dashboard to manage content.</p>
            <div className="mt-6">
              <a href="/dashboard" className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white">Open dashboard</a>
            </div>
          </div>
        </section>
      ) : (
        <>
          <BreakingNewsBanner />
          {(() => {
            const base = publishedArticles.find((a) => a.slug === featuredSlug) ?? publishedArticles[0];
            if (!base) return null;
            const featured = { ...base, image: featuredImage || base.image };
            return <FeaturedArticle article={featured} />;
          })()}
          <section className="newspaper-section mx-auto max-w-7xl px-4 pb-6 sm:px-6">
            <div className="mb-3 flex items-end justify-between border-b-2 border-[#5b1212] pb-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-800">The front page</p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#5b1212] sm:text-3xl">Today at Kau High</h2>
              </div>
              <span className="hidden text-sm text-slate-500 sm:block">Reporting from the campus community</span>
            </div>
            <div className="newspaper-grid grid gap-5 lg:grid-cols-[1.55fr_0.95fr_0.95fr] lg:gap-0">
              {publishedArticles.slice(0, 3).map((article, index) => (
                <article key={article.slug} className={`px-0 lg:px-6 ${index > 0 ? "lg:border-l lg:border-[#d9c7ae]" : ""}`}>
                  {index === 0 ? <img src={article.image} alt="" className="mb-3 aspect-[16/8] w-full object-cover" /> : null}
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">{article.category}</p>
                  <h3 className={`${index === 0 ? "text-3xl sm:text-4xl" : "text-2xl"} mt-2 font-serif font-bold leading-tight text-[#5b1212]`}>
                    {article.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm">{article.summary}</p>
                  <a href={`/news/${article.slug}`} className="mt-3 inline-block text-xs font-bold text-[#5b1212] hover:underline">Continue reading →</a>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
      <CategorySpotlight featuredCategories={featuredCategories} />
      <TopStories stories={publishedArticles.slice(0, 3)} />
      <PhotoOfWeek />
      <UpcomingEvents />
      <AboutSection />
      <StaffSection />
      <EditorNote />

      <section id="latest-stories" className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Latest Stories
            </h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Search by topic, tag, or category.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <CategoryFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {filteredArticles.map((article) => (
            <NewsCard
              key={article.slug}
              category={article.category}
              title={article.title}
              summary={article.summary}
              slug={article.slug}
            />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            No stories matched your search. Try another keyword or category.
          </div>
        )}
      </section>

      <NewsletterCallout />

      <footer className="border-t border-slate-200 bg-white/80 px-6 py-10 text-center text-sm text-slate-600">
        <p>© 2026 Kau High News</p>
        <p className="mt-2">Student reporting for a stronger school community.</p>
      </footer>
    </main>
  );
}