import Link from "next/link";

type FeaturedArticleProps = {
  article: {
    category: string;
    title: string;
    summary: string;
    author: string;
    date: string;
    slug: string;
    image: string;
  };
};

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
              Featured Story
            </p>

            <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              {article.category}
            </p>
            <h2 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
              {article.title}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              {article.summary}
            </p>
              <p className="mt-5 text-sm text-slate-400">
                By {article.author} • {article.date}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <Link
                href={`/news/${article.slug}`}
                className="inline-block rounded-full bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400"
              >
                Read Full Story →
              </Link>
            </div>
          </div>

          <div className="h-full min-h-[280px]">
            <img
              src={article.image}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
