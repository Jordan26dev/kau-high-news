import Link from "next/link";

type NewsCardProps = {
  category: string;
  title: string;
  summary: string;
  slug: string;
};

export default function NewsCard({
  category,
  title,
  summary,
  slug,
}: NewsCardProps) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-xl transition hover:-translate-y-2 hover:shadow-2xl sm:p-8">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
        {category}
      </p>

      <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
        {title}
      </h2>

      <p className="mt-4 text-base text-slate-600 sm:text-lg">
        {summary}
      </p>

      <Link
        href={`/news/${slug}`}
        className="mt-8 inline-block font-bold text-blue-700 hover:underline"
      >
        Read More →
      </Link>
    </article>
  );
}