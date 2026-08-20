-- Create a simple settings table for key/value site settings
CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value jsonb
);

-- Articles table (can be used for published content, drafts, and demo items)
CREATE TABLE IF NOT EXISTS public.articles (
  id bigserial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  category text,
  title text,
  subtitle text,
  summary text,
  author text,
  date text,
  updated_date text,
  reading_time text,
  image text,
  tags text[],
  content text,
  is_demo boolean DEFAULT true,
  status text DEFAULT 'draft'
);

-- Index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
