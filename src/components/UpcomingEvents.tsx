import Link from "next/link";

const events = [
  {
    title: "Homecoming Pep Rally",
    date: "Aug 12",
    description: "A celebration of school spirit with performances, games, and club showcases.",
    href: "/news/homecoming-pep-rally",
  },
  {
    title: "Open Mic Night",
    date: "Aug 18",
    description: "Student performers share poetry, music, and stories in the cafeteria.",
    href: "/news/open-mic-night",
  },
  {
    title: "Club Fair",
    date: "Aug 24",
    description: "Discover student groups, organizations, and ways to get involved at Kau High.",
    href: "/categories/Clubs",
  },
];

export default function UpcomingEvents() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              Upcoming events
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">What’s happening at Kau High</h3>
          </div>
          <p className="max-w-xl text-slate-600">
            Keep up with the key campus events that matter for students, families, and the broader community.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {events.map((event) => (
            <article key={event.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                {event.date}
              </p>
              <h4 className="mt-3 text-xl font-semibold text-slate-900">{event.title}</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">{event.description}</p>
              <Link href={event.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">
                Learn more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
