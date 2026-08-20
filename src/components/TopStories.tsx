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
    <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
      <div className="border-y-2 border-[#5b1212] bg-[#fffdf7] py-4 text-[#5b1212]">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-800">
              Top stories
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold">What readers are clicking</h3>
          </div>
          <p className="max-w-xl text-slate-600">
            A quick snapshot of the stories that matter most to the school community.
          </p>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {stories.map((story) => (
            <Link
              key={story.slug}
              href={`/news/${story.slug}`}
              className="border-t border-[#d9c7ae] p-3 transition hover:bg-[#fff8ed] lg:border-t-0 lg:border-l"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
                {story.category}
              </p>
              <h4 className="mt-2 font-serif text-lg font-semibold">{story.title}</h4>
              <p className="mt-2 text-xs leading-5 text-slate-600">{story.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
