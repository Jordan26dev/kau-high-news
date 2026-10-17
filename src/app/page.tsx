import AboutSection from "@/components/AboutSection";
import CategorySpotlight from "@/components/CategorySpotlight";
import EditorNote from "@/components/EditorNote";
import FeaturedArticle from "@/components/FeaturedArticle";
import NewsCrewSection from "@/components/NewsCrewSection";
import NewsroomContactsSection from "@/components/NewsroomContactsSection";
import PublishedArticleBrowser from "@/components/PublishedArticleBrowser";
import TopStories from "@/components/TopStories";
import {
  getHomepageSettings,
  listHomepageStaffProfiles,
  listPublishedArticles,
} from "@/lib/articleRepository";
import { defaultHomepageSettings } from "@/types/newsroom";
import type { Article } from "@/types/article";
import type { HomepageSettings, StaffProfile } from "@/types/newsroom";

export default async function Home() {
  let articles: Article[] = [];
  let settings: HomepageSettings = defaultHomepageSettings;
  let profiles: StaffProfile[] = [];
  let unavailable = false;

  try {
    [articles, settings, profiles] = await Promise.all([
      listPublishedArticles(),
      getHomepageSettings(),
      listHomepageStaffProfiles(),
    ]);
  } catch (error) {
    console.error("Unable to load homepage content from Sanity.", error);
    unavailable = true;
  }

  const featuredStory = articles.find((article) => article.id === settings.featuredStoryId) ?? articles[0];
  const homepageListArticles = articles.filter((article) => article.id !== featuredStory?.id);
  const topStories = homepageListArticles.slice(0, settings.topStoriesCount);
  const featuredCategories = [
    { name: "News", description: settings.newsSectionDescription },
    { name: "Sports", description: settings.sportsSectionDescription },
    { name: "Clubs", description: settings.clubsSectionDescription },
  ].map(({ name, description }) => ({
    name,
    description,
    count: articles.filter((article) => article.category === name).length,
  }));

  return (
    <main className="min-h-screen bg-slate-100">
      {unavailable ? (
        <div role="alert" className="mx-auto mt-5 max-w-7xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          Some homepage content is temporarily unavailable. Please try again soon.
        </div>
      ) : null}

      {settings.showFeaturedStory ? (
        featuredStory ? (
          <FeaturedArticle
            article={featuredStory}
            label={settings.featuredLabel}
            asideLabel={settings.featuredAsideLabel}
            asideTitle={settings.featuredAsideTitle}
            asideDescription={settings.featuredAsideDescription}
          />
        ) : (
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="border-y-2 border-[#5b1212] bg-[#fffdf7] px-6 py-12 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-800">{settings.noStoriesKicker}</p>
              <h1 className="mt-3 font-serif text-3xl font-bold text-[#3b0a0a] sm:text-4xl">{settings.noStoriesTitle}</h1>
              <p className="mt-3 text-slate-600">{settings.noStoriesDescription}</p>
            </div>
          </section>
        )
      ) : null}

      {settings.showTopStories && topStories.length > 0 ? (
        <TopStories
          stories={topStories}
          label={settings.topStoriesLabel}
          title={settings.topStoriesTitle}
          description={settings.topStoriesDescription}
        />
      ) : null}
      {settings.showSectionSpotlight ? (
        <CategorySpotlight
          featuredCategories={featuredCategories}
          label={settings.sectionSpotlightLabel}
          title={settings.sectionSpotlightTitle}
          description={settings.sectionSpotlightDescription}
        />
      ) : null}
      {settings.showLatestStories ? (
        <PublishedArticleBrowser
          articles={homepageListArticles}
          label={settings.latestStoriesLabel}
          title={settings.latestStoriesTitle}
          description={settings.latestStoriesDescription}
        />
      ) : null}
      {settings.showNewsCrew ? <NewsCrewSection profiles={profiles} settings={settings} /> : null}
      {settings.showAbout ? <AboutSection {...settings} /> : null}
      {settings.showEditorNote ? (
        <EditorNote
          label={settings.editorNoteLabel}
          title={settings.editorNoteTitle}
          text={settings.editorNoteText}
        />
      ) : null}
      {settings.showContacts ? (
        <NewsroomContactsSection
          contactsTitle={settings.contactsTitle}
          contactsDescription={settings.contactsDescription}
          contacts={settings.contacts}
        />
      ) : null}
    </main>
  );
}
