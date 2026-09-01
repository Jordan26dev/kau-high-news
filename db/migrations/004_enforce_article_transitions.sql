-- Enforce article workflow transitions independently of the client UI.
-- Apply after 003_editorial_history_and_notes.sql.

CREATE OR REPLACE FUNCTION public.enforce_article_status_transition()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_role text;
  reviewer boolean;
BEGIN
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  SELECT role INTO current_role
  FROM public.profiles
  WHERE id = auth.uid();

  reviewer := current_role IN ('Teacher', 'Editor', 'Managing Editor', 'Advisor', 'Administrator');

  IF reviewer THEN
    RETURN NEW;
  END IF;

  IF current_role = 'Writer'
    AND OLD.author_id = auth.uid()
    AND OLD.status IN ('draft', 'changes_requested')
    AND NEW.status IN ('draft', 'submitted') THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'This role cannot make that article status change';
END;
$$;

DROP TRIGGER IF EXISTS enforce_article_status_transition_trigger ON public.articles;
CREATE TRIGGER enforce_article_status_transition_trigger
  BEFORE UPDATE OF status ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_article_status_transition();
