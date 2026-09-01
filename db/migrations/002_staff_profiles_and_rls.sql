-- Staff profiles, article ownership, workflow metadata, and baseline RLS.
-- Apply 001_create_tables.sql before this migration.

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'Writer' CHECK (role IN ('Writer', 'Teacher', 'Editor', 'Managing Editor', 'Advisor', 'Administrator')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending')),
  avatar_url text,
  bio text,
  class_year text,
  staff_position text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_status_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_status_check
  CHECK (status IN ('active', 'pending'));

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS image_caption text,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.articles
  DROP CONSTRAINT IF EXISTS articles_status_check;

ALTER TABLE public.articles
  ADD CONSTRAINT articles_status_check
  CHECK (status IN ('draft', 'submitted', 'in_review', 'approved', 'changes_requested', 'scheduled', 'published', 'archived'));

CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS articles_set_updated_at ON public.articles;
CREATE TRIGGER articles_set_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.create_staff_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    'Writer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_staff_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_staff_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_staff_profile();

CREATE OR REPLACE FUNCTION public.has_newsroom_role(required_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = ANY(required_roles)
  );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_read_self_or_admin ON public.profiles;
CREATE POLICY profiles_read_self_or_admin
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.has_newsroom_role(ARRAY['Administrator', 'Advisor']));

DROP POLICY IF EXISTS profiles_update_admin ON public.profiles;
CREATE POLICY profiles_update_admin
  ON public.profiles FOR UPDATE
  USING (public.has_newsroom_role(ARRAY['Administrator', 'Advisor']))
  WITH CHECK (public.has_newsroom_role(ARRAY['Administrator', 'Advisor']));

DROP POLICY IF EXISTS settings_public_read ON public.settings;
CREATE POLICY settings_public_read
  ON public.settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS settings_admin_write ON public.settings;
CREATE POLICY settings_admin_write
  ON public.settings FOR ALL
  USING (public.has_newsroom_role(ARRAY['Administrator', 'Advisor']))
  WITH CHECK (public.has_newsroom_role(ARRAY['Administrator', 'Advisor']));

DROP POLICY IF EXISTS articles_public_published_read ON public.articles;
CREATE POLICY articles_public_published_read
  ON public.articles FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS articles_staff_read ON public.articles;
CREATE POLICY articles_staff_read
  ON public.articles FOR SELECT
  USING (
    author_id = auth.uid()
    OR public.has_newsroom_role(ARRAY['Teacher', 'Editor', 'Managing Editor', 'Advisor', 'Administrator'])
  );

DROP POLICY IF EXISTS articles_reporter_insert ON public.articles;
CREATE POLICY articles_reporter_insert
  ON public.articles FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND status IN ('draft', 'submitted')
  );

DROP POLICY IF EXISTS articles_reporter_update_own ON public.articles;
CREATE POLICY articles_reporter_update_own
  ON public.articles FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (
    author_id = auth.uid()
    AND status IN ('draft', 'submitted', 'changes_requested')
  );

DROP POLICY IF EXISTS articles_editor_update ON public.articles;
CREATE POLICY articles_editor_update
  ON public.articles FOR UPDATE
  USING (public.has_newsroom_role(ARRAY['Teacher', 'Editor', 'Managing Editor', 'Advisor', 'Administrator']))
  WITH CHECK (public.has_newsroom_role(ARRAY['Teacher', 'Editor', 'Managing Editor', 'Advisor', 'Administrator']));

DROP POLICY IF EXISTS articles_admin_delete ON public.articles;
CREATE POLICY articles_admin_delete
  ON public.articles FOR DELETE
  USING (public.has_newsroom_role(ARRAY['Advisor', 'Administrator']));

REVOKE UPDATE (role) ON public.profiles FROM authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
