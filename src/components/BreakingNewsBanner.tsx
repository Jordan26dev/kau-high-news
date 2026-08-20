import Link from "next/link";

export default function BreakingNewsBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
      <div className="border-y border-[#d9c7ae] bg-[#fffdf7] px-3 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#5b1212]">
              Latest update
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold text-slate-900 sm:text-2xl">
              Kau High Robotics Team Qualifies for State Championship
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-700 sm:text-sm">
              After a standout performance at regionals, the team earned its ticket to the state tournament with strong student support.
            </p>
          </div>

          <Link
            href="/news/robotics-team-qualifies-for-states"
            className="inline-flex items-center justify-center border-b-2 border-[#5b1212] px-1 py-1 text-xs font-semibold text-[#5b1212] transition hover:text-amber-700"
          >
            Read the story
          </Link>
        </div>
      </div>
    </section>
  );
}
