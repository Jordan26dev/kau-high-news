"use client";

import { useMemo, useState } from "react";

import AboutSection from "@/components/AboutSection";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import Hero from "@/components/Hero";
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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(articles.map((article) => article.category))
    );

    return ["All", ...uniqueCategories];
  }, []);

  const featuredCategories = useMemo(() => {
    const counts = articles.reduce<Record<string, number>>((accumulator, article) => {
      accumulator[article.category] = (accumulator[article.category] || 0) + 1;
      return accumulator;
    }, {});

    return [
      { name: "Sports", description: "Game coverage and team updates", count: counts.Sports || 0 },
      { name: "News", description: "Campus events and student life", count: counts.News || 0 },
      { name: "Clubs", description: "Student organizations and achievements", count: counts.Clubs || 0 },
    ];
  }, []);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return articles.filter((article) => {
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
  }, [searchTerm, selectedCategory]);

  return (
    <main className="min-h-screen bg-slate-100">
      <Hero />
      <BreakingNewsBanner />
      <FeaturedArticle article={articles[0]} />
      <CategorySpotlight featuredCategories={featuredCategories} />
      <TopStories stories={articles.slice(0, 3)} />
      <PhotoOfWeek />
      <UpcomingEvents />
      <AboutSection />
      <StaffSection />
      <EditorNote />

      <section id="latest-stories" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-5xl">
              Latest Stories
            </h2>
            <p className="mt-2 text-base text-slate-600 sm:text-lg">
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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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