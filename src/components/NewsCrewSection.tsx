import Image from "next/image";
import Link from "next/link";

import type { HomepageSettings, StaffProfile } from "@/types/newsroom";

type NewsCrewSectionProps = {
  profiles: StaffProfile[];
  settings: Pick<
    HomepageSettings,
    "crewLabel" | "crewTitle" | "crewDescription" | "crewPhoto" | "crewPhotoAlt" | "crewPhotoCaption"
  >;
};

export default function NewsCrewSection({ profiles, settings }: NewsCrewSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="border-y border-slate-200 bg-white p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              {settings.crewLabel}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900">
              {settings.crewTitle}
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-slate-600">
              {settings.crewDescription}
            </p>

            {settings.crewPhoto ? (
              <figure className="mt-6">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={settings.crewPhoto}
                    alt={settings.crewPhotoAlt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {settings.crewPhotoCaption ? (
                  <figcaption className="mt-2 text-sm text-slate-500">
                    {settings.crewPhotoCaption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
          </div>

          {profiles.length > 0 ? (
            <div className="grid content-start gap-4 sm:grid-cols-2">
              {profiles.map((profile) => (
                <article key={profile.id} className="border-t-2 border-[#7f1919] bg-slate-50 p-5">
                  {profile.photo ? (
                    <div className="relative mb-4 aspect-[4/3] overflow-hidden bg-slate-200">
                      <Image
                        src={profile.photo}
                        alt={profile.photoAlt ?? ""}
                        fill
                        sizes="(min-width: 640px) 25vw, 100vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {profile.role}{profile.club ? ` · ${profile.club}` : ""}
                  </p>
                  <h3 className="mt-2 font-serif text-xl font-bold text-slate-900">
                    {profile.name}
                  </h3>
                  {profile.bio ? (
                    <p className="mt-2 text-sm leading-6 text-slate-600">{profile.bio}</p>
                  ) : null}
                  <Link
                    href={`/authors/${profile.slug}`}
                    className="mt-4 inline-block font-semibold text-[#7f1919] hover:underline"
                  >
                    View profile and stories
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="self-center border border-dashed border-[#cbb99f] bg-[#fffdf7] p-6 text-slate-600">
              Crew profiles will appear here.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
