import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";

console.log(NewsCard);


export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />
      <Hero />   

      <NewsCard
          category="Sports"
          title="Test"
          summary="Test summary."
      />

    </main>
  );
}
