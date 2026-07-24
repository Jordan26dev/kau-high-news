import Link from "next/link";

import ArticleBody from "@/components/ArticleBody";
import ArticleMeta from "@/components/ArticleMeta";
import NewsCard from "@/components/NewsCard";
import { articles } from "@/data/articles";
import { authors } from "@/data/authors";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return <div>Article not found.</div>;
  }

  const relatedArticles = articles.filter(
    (item) => item.slug !== article.slug && item.category === article.category
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <article className="overflow-hidden rounded-3xl bg-white shadow-xl">
        <img src={article.image} alt={article.title} className="h-72 w-full object-cover" />

        <div className="p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
          {article.category}
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">{article.title}</h1>
        <div className="mt-4">
          <p className="text-sm text-slate-600">
            Written by{" "}
            <Link href={`/authors/${authors.find((author) => author.name === article.author)?.slug || ""}`} className="font-semibold text-blue-700 hover:underline">
              {article.author}
            </Link>
          </p>
        </div>

        <ArticleMeta
          author={article.author}
          date={article.date}
          readingTime={article.readingTime}
          title={article.title}
          slug={article.slug}
        />

        <div className="mt-6 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            In this story
          </p>
          <p className="mt-3 text-lg text-slate-700">
            {article.summary}
          </p>
        </div>

        <ArticleBody content={article.content} />
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Related Articles
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <NewsCard
                key={relatedArticle.slug}
                category={relatedArticle.category}
                title={relatedArticle.title}
                summary={relatedArticle.summary}
                slug={relatedArticle.slug}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
