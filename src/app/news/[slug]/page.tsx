import Image from "next/image";
import Link from "next/link";

import ArticleBody from "@/components/ArticleBody";
import ArticleMeta from "@/components/ArticleMeta";
import NewsCard from "@/components/NewsCard";
import { listPublishedArticles } from "@/lib/articleRepository";
import type { Article } from "@/types/article";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  let publishedArticles: Article[];

  try {
    publishedArticles = await listPublishedArticles();
  } catch (error) {
    console.error("Unable to load public story.", error);
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p role="alert" className="border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          This story is temporarily unavailable. Please try again soon.
        </p>
      </main>
    );
  }

  const articleIndex = publishedArticles.findIndex((item) => item.slug === slug);
  if (articleIndex < 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="border-y-2 border-[#5b1212] bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">Kau High News</p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#3b0a0a]">Story not found</h1>
          <Link href="/" className="mt-5 inline-block font-semibold text-[#7f1919] underline underline-offset-4">Back to the front page</Link>
        </div>
      </main>
    );
  }

  const article = publishedArticles[articleIndex];
  const previousArticle = publishedArticles[articleIndex + 1] ?? null;
  const nextArticle = publishedArticles[articleIndex - 1] ?? null;
  const relatedArticles = publishedArticles
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <article className="overflow-hidden border-y-2 border-[#5b1212] bg-white">
        {article.image ? (
          <figure>
            <div className="relative h-64 w-full bg-slate-100 sm:h-[28rem]">
              <Image src={article.image} alt={article.imageAlt || article.title} fill sizes="100vw" className="object-cover" unoptimized />
            </div>
            {article.imageCaption ? <figcaption className="px-6 pt-3 text-sm text-slate-500 sm:px-10">{article.imageCaption}</figcaption> : null}
          </figure>
        ) : null}

        <div className="p-6 sm:p-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link href={`/categories/${encodeURIComponent(article.category)}`} className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7f1919] hover:underline">
              {article.category}
            </Link>
            <span className="text-slate-400" aria-hidden="true">•</span>
            <p className="text-sm text-slate-600">{article.date}</p>
          </div>
          <h1 className="font-serif text-4xl font-bold leading-tight text-[#3b0a0a] sm:text-5xl">{article.title}</h1>
          {article.subtitle ? <p className="mt-4 text-xl leading-8 text-slate-700">{article.subtitle}</p> : null}
          <ArticleMeta
            author={article.author}
            authorSlug={article.authorProfileSlug}
            date={article.date}
            readingTime={article.readingTime}
            title={article.title}
            slug={article.slug}
          />

          {article.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag) => <span key={tag} className="border border-[#e7ded1] bg-[#fffdf7] px-3 py-1 text-sm text-slate-700">#{tag}</span>)}
            </div>
          ) : null}

          {article.summary ? (
            <div className="mt-8 border-y border-[#d9c7ae] bg-[#fffdf7] p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">The story</p>
              <p className="mt-2 text-lg leading-7 text-slate-700">{article.summary}</p>
            </div>
          ) : null}

          <ArticleBody content={article.content} storyBlocks={article.storyBlocks} />
        </div>
      </article>

      {previousArticle || nextArticle ? (
        <nav aria-label="More stories" className="mt-8 grid gap-4 sm:grid-cols-2">
          {previousArticle ? (
            <Link href={`/news/${previousArticle.slug}`} className="border-t-2 border-[#5b1212] bg-white p-5 hover:bg-[#fffdf7]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Older story</p>
              <h2 className="mt-2 font-serif text-xl font-bold text-[#3b0a0a]">{previousArticle.title}</h2>
            </Link>
          ) : <div />}
          {nextArticle ? (
            <Link href={`/news/${nextArticle.slug}`} className="border-t-2 border-[#5b1212] bg-white p-5 text-right hover:bg-[#fffdf7]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Newer story</p>
              <h2 className="mt-2 font-serif text-xl font-bold text-[#3b0a0a]">{nextArticle.title}</h2>
            </Link>
          ) : null}
        </nav>
      ) : null}

      {relatedArticles.length > 0 ? (
        <section className="mt-10">
          <h2 className="border-b-2 border-[#5b1212] pb-3 font-serif text-2xl font-bold text-[#3b0a0a]">More in {article.category}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <NewsCard key={relatedArticle.slug} category={relatedArticle.category} title={relatedArticle.title} summary={relatedArticle.summary} slug={relatedArticle.slug} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
