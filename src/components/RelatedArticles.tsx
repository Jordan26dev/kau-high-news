import NewsCard from "@/components/NewsCard";
import type { Article } from "@/types/article";

type RelatedArticlesProps = {
  articles: Article[];
};

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              Related stories
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">More stories from this section</h2>
          </div>
          <p className="max-w-xl text-slate-600">
            Explore stories that share the same theme, category, or student perspective.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard
              key={article.slug}
              category={article.category}
              title={article.title}
              summary={article.summary}
              slug={article.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
