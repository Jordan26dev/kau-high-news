export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 to-blue-700 p-12 text-white shadow-2xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-200">
            Featured Story
          </p>

          <h2 className="max-w-3xl text-5xl font-black leading-tight">
            Welcome to the New Kau High News
          </h2>

          <p className="mt-6 max-w-2xl text-xl text-blue-100">
            Bringing students the latest campus news, sports,
            events, achievements, and stories from around Kau High.
          </p>

          <button className="mt-8 rounded-lg bg-white px-6 py-3 font-bold text-blue-900 transition hover:scale-105">
            Explore Stories
          </button>

        </div>
      </div>
    </section>
  );
}
