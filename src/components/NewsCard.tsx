console.log("NewsCard file loaded");

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
    <article className="rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
      <span className="text-sm font-bold uppercase text-blue-700">
        {category}
      </span>

      <h3 className="mt-3 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-gray-600">
        {summary}
      </p>

      <button className="mt-6 font-semibold text-blue-800 hover:underline">
        Read More →
      </button>
    </article>
  );
}
