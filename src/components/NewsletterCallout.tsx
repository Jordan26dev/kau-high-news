export default function NewsletterCallout() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              Stay in the loop
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              Get the next issue delivered to your inbox.
            </h3>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Follow the latest student stories, events, and updates from Kau High.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded-full border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-700"
            />
            <button
              type="button"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
