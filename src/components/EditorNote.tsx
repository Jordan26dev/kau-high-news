type EditorNoteProps = {
  label: string;
  title: string;
  text: string;
};

export default function EditorNote({ label, title, text }: EditorNoteProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
              {label}
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              {title}
            </h3>
          </div>
          <p className="max-w-2xl text-slate-300">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
