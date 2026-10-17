import type { HomepageSettings } from "@/types/newsroom";

type AboutSectionProps = Pick<
  HomepageSettings,
  "aboutLabel" | "aboutTitle" | "aboutDescription" | "aboutSideLabel" | "aboutSideText"
>;

export default function AboutSection(settings: AboutSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 border-y border-slate-200 bg-white p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
            {settings.aboutLabel}
          </p>
          <h3 className="mt-3 font-serif text-3xl font-bold text-slate-900">
            {settings.aboutTitle}
          </h3>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {settings.aboutDescription}
          </p>
        </div>

        <div className="border-l-4 border-amber-500 bg-slate-900 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            {settings.aboutSideLabel}
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {settings.aboutSideText}
          </p>
        </div>
      </div>
    </section>
  );
}
