import NewsCard from "@/components/NewsCard";
import type { Article } from "@/types/article";

type SearchResultsProps = {
  articles: Article[];
};

export default function SearchResults({ articles }: SearchResultsProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Search results</h2>
        <p className="mt-2 text-sm text-slate-600">Showing stories that match your search and selected categories.</p>

        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.length > 0 ? (
            articles.map((article) => (
              <NewsCard
                key={article.slug}
                category={article.category}
                title={article.title}
                summary={article.summary}
                slug={article.slug}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
              No stories matched your search. Try a different keyword or category.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
