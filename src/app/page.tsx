import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";

import { articles } from "@/data/articles";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-10 text-5xl font-bold text-slate-900">
          Latest Stories
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <NewsCard
              key={index}
              category={article.category}
              title={article.title}
              summary={article.summary}
            />
          ))}
        </div>
      </section>
    </main>
  );
}