import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 p-6 text-white shadow-2xl sm:p-12">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-200">
            The student voice
          </p>

          <h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
            Welcome to the new Kau High News.
          </h2>

          <p className="mt-6 max-w-2xl text-base text-blue-100 sm:text-xl">
            The latest campus stories, sports highlights, club achievements, and student perspectives from around Kau High.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#latest-stories"
              className="rounded-full bg-white px-6 py-3 font-bold text-blue-950 transition hover:scale-105"
            >
              Explore stories
            </Link>
            <Link
              href="/authors/jordan-virgo"
              className="rounded-full border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"
            >
              Meet the staff
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
