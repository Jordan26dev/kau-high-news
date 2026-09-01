import type { Article } from "@/types/article";
import supabase from "@/lib/supabaseClient";

const hasSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

type CreateArticleInput = {
  title: string;
  subtitle?: string;
  summary: string;
  category: string;
  tags?: string[];
  content: string;
  heroImage?: string;
  imageCaption?: string;
  authorId: string;
  authorName: string;
  status: "draft" | "submitted";
};

type ArticleRow = {
  id: number;
  slug: string;
  category: string | null;
  title: string | null;
  subtitle: string | null;
  summary: string | null;
  author: string | null;
  date: string | null;
  updated_date: string | null;
  reading_time: string | null;
  image: string | null;
  tags: string[] | null;
  content: string | null;
  status: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  published_at?: string | null;
  author_id?: string | null;
};

export type DashboardArticleRow = {
  id: number;
  title: string | null;
  summary: string | null;
  author: string | null;
  category: string | null;
  status: string | null;
  updated_at: string | null;
  created_at: string | null;
  published_at: string | null;
};

export type EditorialNote = {
  id: number;
  note: string;
  author_id: string;
  created_at: string;
};

export type ArticleHistoryEntry = {
  id: number;
  action: string;
  previous_status: string | null;
  new_status: string | null;
  actor_id: string | null;
  created_at: string;
};

export type StaffProfileRow = {
  id: string;
  display_name: string;
  role: string;
  status: string;
};

function toArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category ?? "News",
    title: row.title ?? "Untitled story",
    subtitle: row.subtitle ?? undefined,
    summary: row.summary ?? "",
    author: row.author ?? "Kau High News Staff",
    date: row.date ?? "",
    updatedDate: row.updated_date ?? undefined,
    readingTime: row.reading_time ?? "1 min read",
    image: row.image ?? "",
    tags: row.tags ?? [],
    content: row.content ?? "",
  };
}

function makeSlug(title: string) {
  return `${title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now()}`;
}

export async function createArticle(input: CreateArticleInput): Promise<Article> {
  const date = new Date().toISOString();
  const slug = makeSlug(input.title);

  if (!hasSupabase) {
    return {
      id: Date.now(),
      slug,
      category: input.category,
      title: input.title,
      subtitle: input.subtitle,
      summary: input.summary,
      author: input.authorName,
      date,
      readingTime: "1 min read",
      image: input.heroImage || "",
      tags: input.tags || [],
      content: input.content,
    };
  }

  const { data, error } = await supabase
    .from("articles")
    .insert({
      slug,
      category: input.category,
      title: input.title,
      subtitle: input.subtitle || null,
      summary: input.summary,
      author: input.authorName,
      author_id: input.authorId,
      date,
      updated_date: date,
      reading_time: "1 min read",
      image: input.heroImage || "",
      tags: input.tags || [],
      content: input.content,
      status: input.status,
      is_demo: false,
    })
    .select("id, slug, category, title, subtitle, summary, author, date, updated_date, reading_time, image, tags, content, status")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Unable to save the article.");
  }

  return toArticle(data as ArticleRow);
}

export async function publishArticle(articleId: number) {
  if (!hasSupabase) return;

  const { error } = await supabase
    .from("articles")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", articleId);

  if (error) {
    throw new Error(error.message || "Unable to publish the article.");
  }
}

export async function updateArticleStatus(articleId: number, status: string) {
  if (!hasSupabase) return;

  const payload: Record<string, string | null> = { status };

  if (status === "published") {
    payload.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("articles")
    .update(payload)
    .eq("id", articleId);

  if (error) {
    throw new Error(error.message || "Unable to update the article status.");
  }
}

export async function listDashboardArticles(): Promise<DashboardArticleRow[]> {
  if (!hasSupabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("id, title, summary, author, category, status, created_at, updated_at, published_at")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Unable to load the newsroom dashboard.");
  }

  return (data ?? []) as DashboardArticleRow[];
}

export async function getPublishedArticle(slug: string): Promise<Article | null> {
  if (!hasSupabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, category, title, subtitle, summary, author, date, updated_date, reading_time, image, tags, content, status")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Unable to load the published article.");
  }

  return data ? toArticle(data as ArticleRow) : null;
}

export async function listPublishedArticles(): Promise<Article[]> {
  if (!hasSupabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, category, title, subtitle, summary, author, date, updated_date, reading_time, image, tags, content, status")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Unable to load published articles.");
  }

  return (data ?? []).map((row) => toArticle(row as ArticleRow));
}

export async function listStaffProfiles(): Promise<StaffProfileRow[]> {
  if (!hasSupabase) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, role, status")
    .order("display_name", { ascending: true });

  if (error) {
    throw new Error(error.message || "Unable to load staff profiles.");
  }

  return (data ?? []) as StaffProfileRow[];
}

export async function updateStaffProfile(
  profileId: string,
  updates: { role?: string; status?: string }
) {
  if (!hasSupabase) return;

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", profileId);

  if (error) {
    throw new Error(error.message || "Unable to update the staff profile.");
  }
}

export async function listEditorialNotes(articleId: number): Promise<EditorialNote[]> {
  if (!hasSupabase) return [];

  const { data, error } = await supabase
    .from("article_editorial_notes")
    .select("id, note, author_id, created_at")
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Unable to load editorial notes.");
  }

  return (data ?? []) as EditorialNote[];
}

export async function addEditorialNote(articleId: number, authorId: string, note: string) {
  if (!hasSupabase) return;

  const { error } = await supabase.from("article_editorial_notes").insert({
    article_id: articleId,
    author_id: authorId,
    note: note.trim(),
  });

  if (error) {
    throw new Error(error.message || "Unable to save the editorial note.");
  }
}

export async function listArticleHistory(articleId: number): Promise<ArticleHistoryEntry[]> {
  if (!hasSupabase) return [];

  const { data, error } = await supabase
    .from("article_history")
    .select("id, action, previous_status, new_status, actor_id, created_at")
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Unable to load article history.");
  }

  return (data ?? []) as ArticleHistoryEntry[];
}
