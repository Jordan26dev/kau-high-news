type NewsCardProps = {
  category: string;
  title: string;
  summary: string;
};

export default function NewsCard({
  category,
  title,
  summary,
}: NewsCardProps) {
  return (
    <article className="rounded-3xl bg-white p-8 shadow-xl transition hover:-translate-y-2 hover:shadow-2xl">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
        {category}
      </p>

      <h2 className="mt-4 text-3xl font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-4 text-lg text-slate-600">
        {summary}
      </p>

      <button className="mt-8 font-bold text-blue-700 hover:underline">
        Read More →
      </button>
    </article>
  );
}