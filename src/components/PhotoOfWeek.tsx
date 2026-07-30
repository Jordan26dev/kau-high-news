import Image from "next/image";

export default function PhotoOfWeek() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
        <div className="rounded-3xl bg-slate-950 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
            Photo of the week
          </p>
          <h3 className="mt-3 text-3xl font-bold">Students capture the energy of Kau High spirit.</h3>
          <p className="mt-4 text-base leading-7 text-slate-300">
            A vibrant photo from last Friday’s pep rally highlights the community energy and school pride across campus.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-slate-100 h-72 sm:h-96">
          <Image
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80"
            alt="Students at a pep rally"
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
