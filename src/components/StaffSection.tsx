import Link from "next/link";

const staff = [
  {
    name: "Jordan Virgo",
    role: "Staff Reporter",
    bio: "Covers school events, community stories, and student life.",
    slug: "jordan-virgo",
  },
];

export default function StaffSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="border-y border-slate-200 bg-white p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              Meet the staff
            </p>
            <h3 className="mt-2 font-serif text-3xl font-bold text-slate-900">
              The voices behind Kau High News
            </h3>
          </div>
          <p className="max-w-xl text-slate-600">
            A small but growing team of student journalists bringing stories to life.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {staff.map((person) => (
            <div key={person.name} className="border-t-2 border-[#7f1919] bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {person.role}
              </p>
              <h4 className="mt-3 text-xl font-semibold text-slate-900">{person.name}</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">{person.bio}</p>
              <Link href={`/authors/${person.slug}`} className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
                View profile →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
