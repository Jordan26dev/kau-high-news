import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";

const articles = [
  {
    category: "Sports",
    title: "Football Team Wins Season Opener",
    summary:
      "The Trojans opened the season with a strong victory in front of a packed home crowd.",
  },
  {
    category: "News",
    title: "Student Council Plans Spirit Week",
    summary:
      "Spirit Week will include dress-up days, lunchtime games, and a pep rally.",
  },
  {
    category: "Clubs",
    title: "Robotics Team Qualifies for States",
    summary:
      "After an impressive regional competition, the Robotics Club will compete at the state championship.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />
      <Hero />

      <section className="mx-auto mt-16 max-w-7xl px-6">
        <h2 className="mb-8 text-4xl font-bold text-slate-900">
          Latest Stories
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard
              key={article.title}
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