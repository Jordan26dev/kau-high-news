import Link from "next/link";

type TopStoriesProps = {
  stories: Array<{
    title: string;
    summary: string;
    slug: string;
    category: string;
  }>;
};

export default function TopStories({ stories }: TopStoriesProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-8">
      <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
              Top stories
            </p>
            <h3 className="mt-2 text-3xl font-bold">What readers are clicking</h3>
          </div>
          <p className="max-w-xl text-slate-300">
            A quick snapshot of the stories that matter most to the school community.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {stories.map((story) => (
            <Link
              key={story.slug}
              href={`/news/${story.slug}`}
              className="rounded-2xl border border-white/10 bg-white/10 p-6 transition hover:bg-white/20"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                {story.category}
              </p>
              <h4 className="mt-3 text-xl font-semibold text-white">{story.title}</h4>
              <p className="mt-3 text-sm leading-7 text-slate-300">{story.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
