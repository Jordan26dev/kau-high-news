import { createClient, defineQuery } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";

import type { Article } from "@/types/article";
import {
  defaultHomepageSettings,
  type HomepageSettings,
  type StaffProfile,
} from "@/types/newsroom";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const publishedContentRevalidateSeconds = 10;

const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2025-01-01",
      useCdn: true,
    })
  : null;

const articleFields = `
  "id": _id,
  "slug": slug.current,
  category,
  title,
  subtitle,
  summary,
  "author": coalesce(authorProfile->name, author),
  "authorProfileId": authorProfile._ref,
  "authorProfileSlug": authorProfile->slug.current,
  "date": publishedAt,
  "updatedDate": _updatedAt,
  readingTime,
  "image": heroImage.asset->url,
  "imageAlt": heroImage.alt,
  "imageCaption": heroImage.caption,
  tags,
  content,
  "storyBlocks": storyBlocks[]{
    ...,
    _type == "image" => {
      ...,
      "assetUrl": asset->url
    }
  }
`;

const publishedArticlesQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc, _createdAt desc) {
    ${articleFields}
  }
`);

const publishedArticleBySlugQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] {
    ${articleFields}
  }
`);

const homepageSettingsQuery = defineQuery(`
  *[_type == "homepageSettings"] | order(_updatedAt desc)[0] {
    "siteLogo": siteLogo.asset->url,
    "siteLogoAlt": siteLogo.alt,
    showFeaturedStory,
    showTopStories,
    showSectionSpotlight,
    showLatestStories,
    showAbout,
    showEditorNote,
    showNewsCrew,
    showContacts,
    "featuredStoryId": featuredStory._ref,
    noStoriesKicker,
    noStoriesTitle,
    noStoriesDescription,
    featuredLabel,
    featuredAsideLabel,
    featuredAsideTitle,
    featuredAsideDescription,
    topStoriesLabel,
    topStoriesTitle,
    topStoriesDescription,
    topStoriesCount,
    sectionSpotlightLabel,
    sectionSpotlightTitle,
    sectionSpotlightDescription,
    newsSectionDescription,
    sportsSectionDescription,
    clubsSectionDescription,
    latestStoriesLabel,
    latestStoriesTitle,
    latestStoriesDescription,
    aboutLabel,
    aboutTitle,
    aboutDescription,
    aboutSideLabel,
    aboutSideText,
    editorNoteLabel,
    editorNoteTitle,
    editorNoteText,
    crewLabel,
    crewTitle,
    crewDescription,
    "crewPhoto": crewPhoto.asset->url,
    "crewPhotoAlt": crewPhoto.alt,
    "crewPhotoCaption": crewPhoto.caption,
    contactsTitle,
    contactsDescription,
    contacts[] {
      _key,
      name,
      purpose,
      email,
      website,
      websiteLabel
    }
  }
`);

const staffProfilesQuery = defineQuery(`
  *[_type == "staffProfile" && showOnHomepage == true] | order(displayOrder asc, name asc) {
    "id": _id,
    name,
    "slug": slug.current,
    role,
    club,
    bio,
    "photo": photo.asset->url,
    "photoAlt": photo.alt
  }
`);

const staffProfileBySlugQuery = defineQuery(`
  *[_type == "staffProfile" && slug.current == $slug][0] {
    "id": _id,
    name,
    "slug": slug.current,
    role,
    club,
    bio,
    "photo": photo.asset->url,
    "photoAlt": photo.alt
  }
`);

function stringField(value: Record<string, unknown>, key: string, fallback: string) {
  return typeof value[key] === "string" ? value[key] : fallback;
}

function booleanField(value: Record<string, unknown>, key: string, fallback: boolean) {
  return typeof value[key] === "boolean" ? value[key] : fallback;
}

function toNewsroomContacts(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item): HomepageSettings["contacts"][number][] => {
    if (typeof item !== "object" || item === null) return [];
    const contact = item as Record<string, unknown>;
    if (typeof contact.name !== "string" || !contact.name.trim()) return [];

    const email =
      typeof contact.email === "string" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
        ? contact.email
        : undefined;
    const website =
      typeof contact.website === "string" &&
      /^https?:\/\//i.test(contact.website)
        ? contact.website
        : undefined;

    return [{
      key: typeof contact._key === "string" ? contact._key : contact.name,
      name: contact.name,
      purpose: typeof contact.purpose === "string" ? contact.purpose : undefined,
      email,
      website,
      websiteLabel:
        typeof contact.websiteLabel === "string" ? contact.websiteLabel : undefined,
    }];
  });
}

function toHomepageSettings(value: Record<string, unknown> | null): HomepageSettings {
  if (!value) return defaultHomepageSettings;

  return {
    siteLogo: typeof value.siteLogo === "string" ? value.siteLogo : undefined,
    siteLogoAlt: typeof value.siteLogoAlt === "string" ? value.siteLogoAlt : undefined,
    showFeaturedStory: booleanField(value, "showFeaturedStory", defaultHomepageSettings.showFeaturedStory),
    showTopStories: booleanField(value, "showTopStories", defaultHomepageSettings.showTopStories),
    showSectionSpotlight: booleanField(value, "showSectionSpotlight", defaultHomepageSettings.showSectionSpotlight),
    showLatestStories: booleanField(value, "showLatestStories", defaultHomepageSettings.showLatestStories),
    showAbout: booleanField(value, "showAbout", defaultHomepageSettings.showAbout),
    showEditorNote: booleanField(value, "showEditorNote", defaultHomepageSettings.showEditorNote),
    showNewsCrew: booleanField(value, "showNewsCrew", defaultHomepageSettings.showNewsCrew),
    showContacts: booleanField(value, "showContacts", defaultHomepageSettings.showContacts),
    featuredStoryId: typeof value.featuredStoryId === "string" ? value.featuredStoryId : undefined,
    noStoriesKicker: stringField(value, "noStoriesKicker", defaultHomepageSettings.noStoriesKicker),
    noStoriesTitle: stringField(value, "noStoriesTitle", defaultHomepageSettings.noStoriesTitle),
    noStoriesDescription: stringField(value, "noStoriesDescription", defaultHomepageSettings.noStoriesDescription),
    featuredLabel: stringField(value, "featuredLabel", defaultHomepageSettings.featuredLabel),
    featuredAsideLabel: stringField(value, "featuredAsideLabel", defaultHomepageSettings.featuredAsideLabel),
    featuredAsideTitle: stringField(value, "featuredAsideTitle", defaultHomepageSettings.featuredAsideTitle),
    featuredAsideDescription: stringField(value, "featuredAsideDescription", defaultHomepageSettings.featuredAsideDescription),
    topStoriesLabel: stringField(value, "topStoriesLabel", defaultHomepageSettings.topStoriesLabel),
    topStoriesTitle: stringField(value, "topStoriesTitle", defaultHomepageSettings.topStoriesTitle),
    topStoriesDescription: stringField(value, "topStoriesDescription", defaultHomepageSettings.topStoriesDescription),
    topStoriesCount: typeof value.topStoriesCount === "number"
      ? Math.max(1, Math.min(6, Math.floor(value.topStoriesCount)))
      : defaultHomepageSettings.topStoriesCount,
    sectionSpotlightLabel: stringField(value, "sectionSpotlightLabel", defaultHomepageSettings.sectionSpotlightLabel),
    sectionSpotlightTitle: stringField(value, "sectionSpotlightTitle", defaultHomepageSettings.sectionSpotlightTitle),
    sectionSpotlightDescription: stringField(value, "sectionSpotlightDescription", defaultHomepageSettings.sectionSpotlightDescription),
    newsSectionDescription: stringField(value, "newsSectionDescription", defaultHomepageSettings.newsSectionDescription),
    sportsSectionDescription: stringField(value, "sportsSectionDescription", defaultHomepageSettings.sportsSectionDescription),
    clubsSectionDescription: stringField(value, "clubsSectionDescription", defaultHomepageSettings.clubsSectionDescription),
    latestStoriesLabel: stringField(value, "latestStoriesLabel", defaultHomepageSettings.latestStoriesLabel),
    latestStoriesTitle: stringField(value, "latestStoriesTitle", defaultHomepageSettings.latestStoriesTitle),
    latestStoriesDescription: stringField(value, "latestStoriesDescription", defaultHomepageSettings.latestStoriesDescription),
    aboutLabel: stringField(value, "aboutLabel", defaultHomepageSettings.aboutLabel),
    aboutTitle: stringField(value, "aboutTitle", defaultHomepageSettings.aboutTitle),
    aboutDescription: stringField(value, "aboutDescription", defaultHomepageSettings.aboutDescription),
    aboutSideLabel: stringField(value, "aboutSideLabel", defaultHomepageSettings.aboutSideLabel),
    aboutSideText: stringField(value, "aboutSideText", defaultHomepageSettings.aboutSideText),
    editorNoteLabel: stringField(value, "editorNoteLabel", defaultHomepageSettings.editorNoteLabel),
    editorNoteTitle: stringField(value, "editorNoteTitle", defaultHomepageSettings.editorNoteTitle),
    editorNoteText: stringField(value, "editorNoteText", defaultHomepageSettings.editorNoteText),
    crewLabel: stringField(value, "crewLabel", defaultHomepageSettings.crewLabel),
    crewTitle: stringField(value, "crewTitle", defaultHomepageSettings.crewTitle),
    crewDescription: stringField(value, "crewDescription", defaultHomepageSettings.crewDescription),
    crewPhoto: typeof value.crewPhoto === "string" ? value.crewPhoto : undefined,
    crewPhotoAlt: typeof value.crewPhotoAlt === "string" ? value.crewPhotoAlt : undefined,
    crewPhotoCaption: typeof value.crewPhotoCaption === "string" ? value.crewPhotoCaption : undefined,
    contactsTitle: stringField(value, "contactsTitle", defaultHomepageSettings.contactsTitle),
    contactsDescription: stringField(value, "contactsDescription", defaultHomepageSettings.contactsDescription),
    contacts: toNewsroomContacts(value.contacts),
  };
}

function toStaffProfile(value: Record<string, unknown> | null): StaffProfile | null {
  if (!value || typeof value.id !== "string" || typeof value.name !== "string" ||
    typeof value.slug !== "string" || typeof value.role !== "string") {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    slug: value.slug,
    role: value.role,
    club: typeof value.club === "string" ? value.club : undefined,
    bio: typeof value.bio === "string" ? value.bio : undefined,
    photo: typeof value.photo === "string" ? value.photo : undefined,
    photoAlt: typeof value.photoAlt === "string" ? value.photoAlt : undefined,
  };
}

function toArticle(value: Record<string, unknown>): Article {
  const publishedAt = typeof value.date === "string" ? value.date : "";
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const content = typeof value.content === "string" ? value.content : "";
  const storyBlocks = Array.isArray(value.storyBlocks)
    ? value.storyBlocks as PortableTextBlock[]
    : undefined;
  const storyText = storyBlocks
    ? storyBlocks
        .filter((block) => block._type === "block")
        .flatMap((block) => block.children ?? [])
        .map((child) => "text" in child && typeof child.text === "string" ? child.text : "")
        .join(" ")
    : content;
  const words = storyText.trim().split(/\s+/).filter(Boolean).length;
  const calculatedReadingTime = `${Math.max(1, Math.ceil(words / 200))} min read`;

  return {
    id: typeof value.id === "string" ? value.id : "",
    slug: typeof value.slug === "string" ? value.slug : "",
    authorProfileId: typeof value.authorProfileId === "string" ? value.authorProfileId : undefined,
    authorProfileSlug: typeof value.authorProfileSlug === "string" ? value.authorProfileSlug : undefined,
    category: typeof value.category === "string" ? value.category : "News",
    title: typeof value.title === "string" ? value.title : "Untitled story",
    subtitle: typeof value.subtitle === "string" ? value.subtitle : undefined,
    summary: typeof value.summary === "string" ? value.summary : "",
    author: typeof value.author === "string" ? value.author : "Kau High News",
    date,
    updatedDate: typeof value.updatedDate === "string" ? value.updatedDate : undefined,
    readingTime: typeof value.readingTime === "string" ? value.readingTime : calculatedReadingTime,
    image: typeof value.image === "string" ? value.image : "",
    imageAlt: typeof value.imageAlt === "string" ? value.imageAlt : undefined,
    imageCaption: typeof value.imageCaption === "string" ? value.imageCaption : undefined,
    tags: Array.isArray(value.tags)
      ? value.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    content,
    storyBlocks,
  };
}

export async function listPublishedArticles(): Promise<Article[]> {
  if (!client) return [];
  const articles = await client.fetch<Record<string, unknown>[]>(
    publishedArticlesQuery,
    {},
    { next: { revalidate: publishedContentRevalidateSeconds } },
  );
  return articles.map(toArticle);
}

export async function getPublishedArticle(slug: string): Promise<Article | null> {
  if (!client) return null;
  const article = await client.fetch<Record<string, unknown> | null>(
    publishedArticleBySlugQuery,
    { slug },
    { next: { revalidate: publishedContentRevalidateSeconds } },
  );
  return article ? toArticle(article) : null;
}

export async function getHomepageSettings(): Promise<HomepageSettings> {
  if (!client) return defaultHomepageSettings;
  const settings = await client.fetch<Record<string, unknown> | null>(
    homepageSettingsQuery,
    {},
    { next: { revalidate: publishedContentRevalidateSeconds } },
  );
  return toHomepageSettings(settings);
}

export async function listHomepageStaffProfiles(): Promise<StaffProfile[]> {
  if (!client) return [];
  const profiles = await client.fetch<Record<string, unknown>[]>(staffProfilesQuery, {}, {
    next: { revalidate: publishedContentRevalidateSeconds },
  });
  return profiles.map(toStaffProfile).filter((profile): profile is StaffProfile => profile !== null);
}

export async function getStaffProfile(slug: string): Promise<StaffProfile | null> {
  if (!client) return null;
  const profile = await client.fetch<Record<string, unknown> | null>(
    staffProfileBySlugQuery,
    { slug },
    { next: { revalidate: publishedContentRevalidateSeconds } },
  );
  return toStaffProfile(profile);
}
