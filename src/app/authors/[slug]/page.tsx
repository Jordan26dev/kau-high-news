import Link from "next/link";

import { articles } from "@/data/articles";
import { authors } from "@/data/authors";

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = authors.find((item) => item.slug === slug);

  if (!author) {
    return <main className="mx-auto max-w-5xl px-6 py-16">Author not found.</main>;
  }

  const authoredArticles = articles.filter((article) => article.author === author.name);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="border-y-2 border-[#5b1212] bg-white p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
          Author profile
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-slate-900">{author.name}</h1>
        <p className="mt-2 text-lg text-slate-600">{author.role}</p>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">{author.bio}</p>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          {author.location}
        </p>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900">Stories by {author.name}</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {authoredArticles.map((article) => (
            <article key={article.slug} className="border-t-2 border-[#5b1212] bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                {article.category}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{article.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{article.summary}</p>
              <Link href={`/news/${article.slug}`} className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
                Read story →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
