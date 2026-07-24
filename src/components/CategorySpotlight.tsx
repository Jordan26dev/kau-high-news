import Link from "next/link";

type CategorySpotlightProps = {
  featuredCategories: Array<{
    name: string;
    description: string;
    count: number;
  }>;
};

export default function CategorySpotlight({
  featuredCategories,
}: CategorySpotlightProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              In the newsroom
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              Browse by section
            </h3>
          </div>
          <p className="max-w-xl text-slate-600">
            A quick look at the most active parts of the paper, from sports to student life.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {featuredCategories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${encodeURIComponent(category.name)}`}
              className="rounded-2xl bg-slate-50 p-6 transition hover:bg-slate-100"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {category.name}
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                {category.description}
              </p>
              <p className="mt-4 text-sm text-slate-600">
                {category.count} stories available
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
