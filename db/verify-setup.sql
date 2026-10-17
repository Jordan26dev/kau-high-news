-- Kau High News Database Verification
-- Run this in Supabase SQL Editor to verify all components are in place

-- =====================================================
-- 1. TABLE VERIFICATION
-- =====================================================
SELECT 'TABLE VERIFICATION' as section;

SELECT 
  tablename,
  CASE 
    WHEN tablename = 'articles' THEN '✓ Articles table'
    WHEN tablename = 'profiles' THEN '✓ Profiles table'
    WHEN tablename = 'article_history' THEN '✓ Article history table'
    WHEN tablename = 'article_editorial_notes' THEN '✓ Editorial notes table'
    WHEN tablename = 'settings' THEN '✓ Settings table'
    ELSE tablename
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- =====================================================
-- 2. COLUMN VERIFICATION
-- =====================================================
SELECT 'ARTICLE TABLE COLUMNS' as section;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'articles'
ORDER BY ordinal_position;

SELECT 'PROFILES TABLE COLUMNS' as section;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- =====================================================
-- 3. RLS POLICY VERIFICATION
-- =====================================================
SELECT 'RLS POLICIES' as section;

SELECT 
  schemaname,
  tablename,
  policyname,
  qual as condition
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- 4. TRIGGERS VERIFICATION
-- =====================================================
SELECT 'TRIGGERS' as section;

SELECT 
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- 5. DATA SAMPLE CHECK
-- =====================================================
SELECT 'SAMPLE DATA' as section;

SELECT COUNT(*) as total_articles FROM articles;
SELECT COUNT(*) as total_profiles FROM profiles;
SELECT COUNT(*) as total_history FROM article_history;
SELECT COUNT(*) as total_notes FROM article_editorial_notes;

-- =====================================================
-- 6. PUBLISHED ARTICLES (PUBLIC VIEW)
-- =====================================================
SELECT 'PUBLISHED ARTICLES' as section;

SELECT 
  id,
  title,
  author,
  status,
  created_at
FROM articles
WHERE status = 'published'
LIMIT 5;

-- =====================================================
-- 7. DRAFT ARTICLES (STAFF ONLY)
-- =====================================================
SELECT 'DRAFT ARTICLES (staff-only)' as section;

SELECT 
  id,
  title,
  author_id,
  author,
  status,
  created_at
FROM articles
WHERE status = 'draft'
LIMIT 5;

-- =====================================================
-- 8. ACTIVE STAFF MEMBERS
-- =====================================================
SELECT 'ACTIVE STAFF' as section;

SELECT 
  id,
  display_name,
  role,
  status,
  created_at
FROM profiles
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- VERIFICATION COMPLETE
-- =====================================================
SELECT 'All checks complete. Review results above.' as status;
