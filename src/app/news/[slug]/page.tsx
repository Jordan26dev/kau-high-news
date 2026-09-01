import Image from "next/image";
import Link from "next/link";

import ArticleBody from "@/components/ArticleBody";
import ArticleMeta from "@/components/ArticleMeta";
import NewsCard from "@/components/NewsCard";
import { articles } from "@/data/articles";
import { authors } from "@/data/authors";
import { getPublishedArticle } from "@/lib/articleRepository";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  let article = articles.find((item) => item.slug === slug) ?? null;

  try {
    article = (await getPublishedArticle(slug)) ?? article;
  } catch {
    // Keep the published demo article available when Supabase is unavailable.
  }

  if (!article) {
    return <div>Article not found.</div>;
  }

  const currentIndex = articles.findIndex((item) => item.slug === article.slug);
  const previousArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  const relatedArticles = articles.filter(
    (item) => item.slug !== article.slug && item.category === article.category
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <article className="overflow-hidden border-y-2 border-[#5b1212] bg-white">
        <div className="relative h-72 w-full">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link
              href={`/categories/${encodeURIComponent(article.category)}`}
              className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700 hover:underline"
            >
              Back to {article.category}
            </Link>
            <span className="text-sm text-slate-500">•</span>
            <p className="text-sm text-slate-600">{article.date}</p>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
            {article.category}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-slate-900">{article.title}</h1>
          {article.subtitle ? (
            <p className="mt-4 text-xl text-slate-700">{article.subtitle}</p>
          ) : null}
          <div className="mt-6">
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

        <div className="mt-8 border-y border-slate-200 bg-slate-50 p-6">
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

      <section className="mx-auto mt-12 max-w-5xl space-y-8">
        {(previousArticle || nextArticle) && (
          <div className="grid gap-4 md:grid-cols-2">
            {previousArticle ? (
              <Link
                href={`/news/${previousArticle.slug}`}
                className="border-t-2 border-[#5b1212] bg-slate-50 p-6 transition hover:bg-slate-100"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Previous story</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{previousArticle.title}</h3>
              </Link>
            ) : null}

            {nextArticle ? (
              <Link
                href={`/news/${nextArticle.slug}`}
                className="border-t-2 border-[#5b1212] bg-slate-50 p-6 transition hover:bg-slate-100"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Next story</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{nextArticle.title}</h3>
              </Link>
            ) : null}
          </div>
        )}

        {relatedArticles.length > 0 && (
          <section className="border-y border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-bold text-slate-900">Related Articles</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </section>
    </main>
  );
}
