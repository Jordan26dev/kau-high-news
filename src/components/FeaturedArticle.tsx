import Image from "next/image";
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
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
      <div className="overflow-hidden border-y-4 border-[#5b1212] bg-[#fffdf7] text-[#5b1212]">
        <div className="grid gap-0 lg:grid-cols-[0.85fr_1.35fr_0.8fr]">
          <div className="border-b border-[#d9c7ae] p-5 lg:border-b-0 lg:border-r">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-800">
              Featured Story
            </p>

            <div className="mt-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-800">
              {article.category}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-[#5b1212] sm:text-4xl">
              {article.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
              {article.summary}
            </p>
              <p className="mt-5 text-sm text-slate-600">
                By {article.author} • {article.date}
              </p>
            </div>

            <div className="mt-5 border-t border-[#d9c7ae] pt-4">
              <Link
                href={`/news/${article.slug}`}
                className="inline-block border-b-2 border-[#7f1919] pb-1 font-semibold text-[#7f1919] transition hover:text-amber-700"
              >
                Read Full Story →
              </Link>
            </div>
          </div>

          <div className="relative min-h-[250px] w-full lg:min-h-[320px]">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="hidden border-l border-[#d9c7ae] p-5 lg:block">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-800">Editor&apos;s pick</p>
            <p className="mt-3 font-serif text-xl font-bold leading-tight text-[#5b1212]">A closer look at the stories shaping campus this week.</p>
            <p className="mt-3 text-xs leading-5 text-slate-600">Student voices, school events, and reporting from across the community.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
