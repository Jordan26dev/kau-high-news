export default function EditorNote() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
              Editor’s note
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              Keeping the school community informed.
            </h3>
          </div>
          <p className="max-w-2xl text-slate-300">
            Kau High News is built to share student stories, school updates, and events in a clear and welcoming format for readers of all ages.
          </p>
        </div>
      </div>
    </section>
  );
}
