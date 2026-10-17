import Link from "next/link";

type CategorySpotlightProps = {
  label: string;
  title: string;
  description: string;
  featuredCategories: Array<{
    name: string;
    description: string;
    count: number;
  }>;
};

export default function CategorySpotlight({
  label,
  title,
  description,
  featuredCategories,
}: CategorySpotlightProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
      <div className="border-y border-[#d9c7ae] bg-[#fffdf7] py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-800">
              {label}
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold text-slate-900">
              {title}
            </h3>
          </div>
          <p className="max-w-xl text-slate-600">
            {description}
          </p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {featuredCategories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${encodeURIComponent(category.name)}`}
              className="border-t-2 border-[#5b1212] bg-slate-50 p-4 transition hover:bg-[#fff8ed]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {category.name}
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {category.description}
              </p>
              <p className="mt-2 text-xs text-slate-600">
                {category.count} stories available
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
