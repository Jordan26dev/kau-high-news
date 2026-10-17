import Image from "next/image";
import Link from "next/link";

import { getStaffProfile, listPublishedArticles } from "@/lib/articleRepository";
import type { Article } from "@/types/article";
import type { StaffProfile } from "@/types/newsroom";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

function toAuthorSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  let articles: Article[];
  let profile: StaffProfile | null;

  try {
    [articles, profile] = await Promise.all([
      listPublishedArticles(),
      getStaffProfile(slug),
    ]);
  } catch (error) {
    console.error("Unable to load public author stories.", error);
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p role="alert" className="border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          Author stories are temporarily unavailable. Please try again soon.
        </p>
      </main>
    );
  }

  const authoredArticles = profile
    ? articles.filter((article) => article.authorProfileId === profile.id)
    : articles.filter((article) => toAuthorSlug(article.author) === slug);
  const authorName = profile?.name ?? authoredArticles[0]?.author;

  if (!authorName) {
    return <main className="mx-auto max-w-5xl px-6 py-16">Author not found.</main>;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-6 border-y-2 border-[#5b1212] bg-white p-8 sm:grid-cols-[12rem_1fr] sm:items-center">
        {profile?.photo ? (
          <div className="relative aspect-square overflow-hidden bg-slate-100">
            <Image src={profile.photo} alt={profile.photoAlt ?? ""} fill sizes="12rem" className="object-cover" unoptimized />
          </div>
        ) : null}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">
            {profile ? [profile.role, profile.club].filter(Boolean).join(" · ") : "Published by"}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-[#3b0a0a]">{authorName}</h1>
          {profile?.bio ? <p className="mt-4 max-w-2xl leading-7 text-slate-600">{profile.bio}</p> : null}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-[#3b0a0a]">Stories by {authorName}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {authoredArticles.map((article) => (
            <article key={article.slug} className="border-t-2 border-[#5b1212] bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">{article.category}</p>
              <h3 className="mt-3 font-serif text-xl font-bold text-[#3b0a0a]">{article.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{article.summary}</p>
              <Link href={`/news/${article.slug}`} className="mt-4 inline-block font-semibold text-[#7f1919] hover:underline">
                Read story →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
