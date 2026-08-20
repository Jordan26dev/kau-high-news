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
    <article className="border-t-2 border-[#5b1212] pt-4 transition hover:bg-[#fff8ed] sm:pt-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
        {category}
      </p>

      <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-slate-900 sm:text-[1.7rem]">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
        {summary}
      </p>

      <Link
        href={`/news/${slug}`}
        className="mt-4 inline-block text-sm font-bold text-blue-700 hover:underline"
      >
        Read More →
      </Link>
    </article>
  );
}