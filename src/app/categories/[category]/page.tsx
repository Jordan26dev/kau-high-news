import Link from "next/link";

import { articles } from "@/data/articles";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const categoryArticles = articles.filter(
    (article) => article.category === decodedCategory
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
          Section
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">{decodedCategory}</h1>
        <p className="mt-3 text-lg text-slate-600">
          Browse all stories currently published in this section.
        </p>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {categoryArticles.map((article) => (
          <article key={article.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              {article.category}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">{article.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{article.summary}</p>
            <Link href={`/news/${article.slug}`} className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
              Read story →
            </Link>
          </article>
        ))}
      </div>

      {categoryArticles.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          No stories are available in this section yet.
        </div>
      )}
    </main>
  );
}
