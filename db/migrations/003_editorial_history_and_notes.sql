-- Editorial history and private notes for newsroom review.
-- Apply after 002_staff_profiles_and_rls.sql.

CREATE TABLE IF NOT EXISTS public.article_history (
  id bigserial PRIMARY KEY,
  article_id bigint NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  previous_status text,
  new_status text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.article_editorial_notes (
  id bigserial PRIMARY KEY,
  article_id bigint NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  note text NOT NULL CHECK (length(trim(note)) > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_article_history_article_id ON public.article_history(article_id);
CREATE INDEX IF NOT EXISTS idx_article_history_created_at ON public.article_history(created_at);
CREATE INDEX IF NOT EXISTS idx_editorial_notes_article_id ON public.article_editorial_notes(article_id);

DROP TRIGGER IF EXISTS article_editorial_history_trigger ON public.articles;

CREATE OR REPLACE FUNCTION public.record_article_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.article_history (
      article_id,
      actor_id,
      action,
      previous_status,
      new_status
    )
    VALUES (
      NEW.id,
      auth.uid(),
      'status_changed',
      OLD.status,
      NEW.status
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER article_editorial_history_trigger
  AFTER UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.record_article_status_change();

ALTER TABLE public.article_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_editorial_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS article_history_staff_read ON public.article_history;
CREATE POLICY article_history_staff_read
  ON public.article_history FOR SELECT
  USING (
    public.has_newsroom_role(ARRAY['Teacher', 'Editor', 'Managing Editor', 'Advisor', 'Administrator'])
    OR EXISTS (
      SELECT 1
      FROM public.articles
      WHERE public.articles.id = article_history.article_id
        AND public.articles.author_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS editorial_notes_staff_read ON public.article_editorial_notes;
CREATE POLICY editorial_notes_staff_read
  ON public.article_editorial_notes FOR SELECT
  USING (public.has_newsroom_role(ARRAY['Teacher', 'Editor', 'Managing Editor', 'Advisor', 'Administrator']));

DROP POLICY IF EXISTS editorial_notes_staff_insert ON public.article_editorial_notes;
CREATE POLICY editorial_notes_staff_insert
  ON public.article_editorial_notes FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND public.has_newsroom_role(ARRAY['Teacher', 'Editor', 'Managing Editor', 'Advisor', 'Administrator'])
  );

DROP POLICY IF EXISTS editorial_notes_author_update ON public.article_editorial_notes;
CREATE POLICY editorial_notes_author_update
  ON public.article_editorial_notes FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS editorial_notes_author_delete ON public.article_editorial_notes;
CREATE POLICY editorial_notes_author_delete
  ON public.article_editorial_notes FOR DELETE
  USING (author_id = auth.uid());

GRANT SELECT ON public.article_history TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.article_editorial_notes TO authenticated;
