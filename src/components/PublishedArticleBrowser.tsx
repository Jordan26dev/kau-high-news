"use client";

import { useMemo, useState } from "react";

import CategoryFilters from "@/components/CategoryFilters";
import NewsCard from "@/components/NewsCard";
import SearchBar from "@/components/SearchBar";
import type { Article } from "@/types/article";

type PublishedArticleBrowserProps = {
  articles: Article[];
  label: string;
  title: string;
  description: string;
};

export default function PublishedArticleBrowser({
  articles,
  label,
  title,
  description,
}: PublishedArticleBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((article) => article.category)))],
    [articles]
  );
  const filteredArticles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
      const matchesSearch =
        !normalizedSearch ||
        [article.title, article.summary, article.category, ...article.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [articles, searchTerm, selectedCategory]);

  return (
    <section id="latest-stories" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-col gap-3 border-b-2 border-[#5b1212] pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-800">{label}</p>
          <h2 className="mt-1 font-serif text-3xl font-bold text-[#3b0a0a] sm:text-4xl">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        {articles.length > 0 ? (
          <div className="flex flex-col gap-3 md:items-end">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <CategoryFilters categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
          </div>
        ) : null}
      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
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
      ) : (
        <div className="border border-dashed border-[#cbb99f] bg-white p-8 text-center text-slate-600">
          {articles.length === 0
            ? "No stories have been published yet."
            : "No stories matched your search. Try another keyword or section."}
        </div>
      )}
    </section>
  );
}
