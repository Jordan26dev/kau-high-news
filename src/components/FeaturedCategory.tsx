import Link from "next/link";

type FeaturedCategoryProps = {
  name: string;
  description: string;
  count: number;
};

export default function FeaturedCategory({ name, description, count }: FeaturedCategoryProps) {
  return (
    <Link
      href={`/categories/${encodeURIComponent(name)}`}
      className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:bg-slate-100"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{name}</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{description}</h3>
      <p className="mt-4 text-sm text-slate-600">{count} stories available</p>
    </Link>
  );
}
