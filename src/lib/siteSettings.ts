import supabase from "./supabaseClient";

const hasSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function hasWindow() {
  return typeof window !== "undefined";
}

export async function getSetting(key: string): Promise<unknown> {
  if (hasSupabase) {
    const { data, error } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
    if (error) {
      console.warn("Supabase getSetting error:", error.message);
      return null;
    }
    return data?.value ?? null;
  }

  if (hasWindow()) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  return null;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  if (hasSupabase) {
    const payload = { key, value };
    const { error } = await supabase.from("settings").upsert(payload, { onConflict: "key" });
    if (error) console.warn("Supabase setSetting error:", error.message);
    return;
  }

  if (hasWindow()) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore
    }
  }
}

export async function getFeatured(): Promise<{ slug?: string; image?: string } | null> {
  const slug = await getSetting("featuredSlug");
  const image = await getSetting("featuredImage");
  if (!slug && !image) return null;
  return {
    slug: typeof slug === "string" ? slug : undefined,
    image: typeof image === "string" ? image : undefined,
  };
}

export async function setFeatured(slug?: string, image?: string): Promise<void> {
  if (slug !== undefined) await setSetting("featuredSlug", slug);
  if (image !== undefined) await setSetting("featuredImage", image);
}

export async function getUnderDevelopment(): Promise<boolean> {
  const val = await getSetting("underDevelopment");
  return Boolean(val === true || val === "true");
}

export async function setUnderDevelopment(value: boolean): Promise<void> {
  await setSetting("underDevelopment", value === true);
}

export async function clearDemoData(): Promise<void> {
  if (hasSupabase) {
    // remove demo articles and drafts if they are flagged as is_demo
    const { error } = await supabase.from("articles").delete().eq("is_demo", true);
    if (error) console.warn("Supabase clearDemoData error:", error.message);
    return;
  }

  if (hasWindow()) {
    try {
      window.sessionStorage.removeItem("kau-high-drafts");
      window.sessionStorage.removeItem("kau-high-pending-articles");
      window.sessionStorage.removeItem("kau-high-published-articles");
      window.localStorage.removeItem("kau-high-accounts");
      window.localStorage.removeItem("kau-high-featured-slug");
      window.localStorage.removeItem("kau-high-featured-image");
      window.localStorage.removeItem("kau-high-under-development");
    } catch (e) {
      // ignore
    }
  }
}

const siteSettings = {
  getSetting,
  setSetting,
  getFeatured,
  setFeatured,
  getUnderDevelopment,
  setUnderDevelopment,
  clearDemoData,
};

export default siteSettings;
