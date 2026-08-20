export default function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 border-y border-slate-200 bg-white p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
            About the paper
          </p>
          <h3 className="mt-3 font-serif text-3xl font-bold text-slate-900">
            Reporting the stories that shape school life.
          </h3>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Kau High News brings together student reporting, school updates, and club highlights in one clear, modern publication.
          </p>
        </div>

        <div className="border-l-4 border-amber-500 bg-slate-900 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            This week at Kau
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>• New stories published each week</li>
            <li>• Student voices from across campus</li>
            <li>• Fresh coverage of clubs, events, and athletics</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
