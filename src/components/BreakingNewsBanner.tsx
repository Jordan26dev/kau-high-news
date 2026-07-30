import Link from "next/link";

export default function BreakingNewsBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-red-600/20 bg-red-50 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-700">
              Breaking News
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Kau High Robotics Team Qualifies for State Championship
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700 sm:text-base">
              After a standout performance at regionals, the team earned its ticket to the state tournament with strong student support.
            </p>
          </div>

          <Link
            href="/news/robotics-team-qualifies-for-states"
            className="inline-flex items-center justify-center rounded-full bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Read the story
          </Link>
        </div>
      </div>
    </section>
  );
}
