# Kau High News - Platform Verification Checklist

> **Historical checklist:** The Supabase database, authentication, and dashboard checks below are for an earlier architecture and do not apply to the current Sanity-based site. For current setup and publishing checks, see [EDITOR_GUIDE.md](./EDITOR_GUIDE.md).

## ✅ Pre-Launch Verification

This checklist verifies that all platform components are working correctly before considering the project complete.

---

## 1. DATABASE VERIFICATION ✅

Confirm all migrations have been applied to Supabase SQL Editor.

**Tables that should exist:**
- [ ] `public.articles` - Main article storage
- [ ] `public.profiles` - User profiles linked to auth.users
- [ ] `public.article_history` - Status change tracking
- [ ] `public.article_editorial_notes` - Private staff notes
- [ ] `public.settings` - Site configuration

**To verify in Supabase:**
```sql
-- Run this in Supabase SQL Editor
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

Expected output: Should show articles, profiles, article_history, article_editorial_notes, settings

---

## 2. AUTHENTICATION & SESSION ✅

Test that authentication works end-to-end.

### A. Local Testing
```bash
# 1. Start the dev server
npm run dev

# 2. Open browser to http://localhost:3000
# 3. Sign up with a new email
# 4. Verify you're logged in
# 5. Refresh the page - session should persist
# 6. Click sign out
# 7. Verify you're logged out
```

**Checklist:**
- [ ] Can sign up with email/password
- [ ] Session persists after page refresh
- [ ] Sign out clears session
- [ ] Redirected to login on protected routes when logged out

### B. Protected Routes
```bash
# Test that /dashboard redirects unauthenticated users
curl -I http://localhost:3000/dashboard

# Expected: 307 Temporary Redirect (without session cookie)
```

**Checklist:**
- [ ] `/dashboard` redirects to home when not logged in (307)
- [ ] `/dashboard` shows dashboard when logged in (200)
- [ ] Direct URL access works (not just browser navigation)

---

## 3. ARTICLE WORKFLOW ✅

Test the complete article creation and review process.

### Phase 1: Writer Workflow
```
1. Log in as Writer user
2. Go to /dashboard
3. Click "New article"
4. Fill form:
   - Title: "Test Article"
   - Subtitle: "This is a test"
   - Summary: "A test article for verification"
   - Category: "News"
   - Tags: "test, verification"
   - Content: "This is test content"
   - Hero image: (optional URL)
5. Click "Save draft"
6. Verify draft appears in "Draft queue"
```

**Checklist:**
- [ ] Can create draft article
- [ ] Draft appears in dashboard
- [ ] Can edit draft
- [ ] Can submit for review

### Phase 2: Editor Workflow
```
1. Log in as Editor user
2. Go to /dashboard/review
3. Should see submitted article
4. Click "Open article"
5. Review content and editorial notes
6. Click "Approve" or "Request changes"
7. If approved, article should move to review queue
```

**Checklist:**
- [ ] Can access review queue
- [ ] Can see submitted articles
- [ ] Can approve articles
- [ ] Can request changes
- [ ] Approved articles are marked published

### Phase 3: Public View
```
1. Log out (or use incognito browser)
2. Go to http://localhost:3000
3. Should see published articles
4. Click article to view full story
5. Should see author, date, content
```

**Checklist:**
- [ ] Published articles appear on homepage
- [ ] Can view article details page
- [ ] Author info is correct
- [ ] Draft/submitted articles NOT visible to public

---

## 4. ROLE-BASED ACCESS CONTROL ✅

Verify each role can only access what they should.

### Test Matrix
Create test users with each role and verify access:

| Role | Can Access | Cannot Access |
|------|-----------|--------------|
| Writer | /dashboard, /dashboard/new | /dashboard/review, /dashboard/staff |
| Editor | /dashboard, /dashboard/review | /dashboard/staff |
| Administrator | /dashboard, /dashboard/review, /dashboard/staff, /dashboard/newsletter | (none) |

**Test procedure:**
```bash
# 1. Create test user as Writer
# 2. Sign in and try to access /dashboard/staff
#    Expected: Access denied message
# 3. Switch to Editor test user
# 4. Verify can access /dashboard/review
# 5. Switch to Admin test user
# 6. Verify can access all routes
```

**Checklist:**
- [ ] Writer cannot access editor functions
- [ ] Editor cannot access admin functions
- [ ] Admin can access all functions
- [ ] Unauthorized access shows clear error message
- [ ] UI hides buttons for unauthorized actions

---

## 5. SECURITY VERIFICATION ✅

Confirm security policies are enforced.

### A. RLS Policy Check
```sql
-- Run in Supabase SQL Editor as authenticated user
SELECT * FROM articles WHERE status = 'draft';

-- Expected: Only returns articles where author_id = current_user_id
-- or articles that are published
```

**Checklist:**
- [ ] Non-author cannot read draft articles of others
- [ ] Anyone can read published articles
- [ ] Editorial notes are staff-only
- [ ] Status changes respect role requirements

### B. Session Security
```bash
# 1. Sign in to get a session
# 2. Copy the authentication cookie
# 3. In another browser/incognito: paste cookie
# 4. Verify session works (user is recognized)
# 5. Clear cookie
# 6. Verify access denied
```

**Checklist:**
- [ ] Session cookies are httpOnly (secure)
- [ ] Session persists across page reloads
- [ ] Clearing cookies requires re-login
- [ ] No secrets exposed in browser storage

### C. Authorization Bypass Attempts
```bash
# Try these from browser console (should all fail):

# Attempt 1: Change user.role in localStorage
# Result: Should not grant access to restricted routes

# Attempt 2: Direct API call to publish article without permission
# Result: Should be rejected by RLS policy

# Attempt 3: Call updateArticleStatus with invalid status
# Result: Should be rejected by database trigger
```

**Checklist:**
- [ ] Cannot bypass auth by modifying localStorage
- [ ] Cannot make unauthorized DB calls
- [ ] RLS policies prevent privilege escalation
- [ ] Database triggers prevent invalid state transitions

---

## 6. MOBILE RESPONSIVENESS ✅

Test on various screen sizes.

**Device Tests:**
- [ ] iPhone 12 (390px) - dashboard readable
- [ ] iPad (768px) - tables show as cards
- [ ] Desktop (1920px) - full layout works
- [ ] Touch interactions work (buttons, links, forms)
- [ ] Navigation menu works on mobile
- [ ] Article form works on mobile
- [ ] Review queue works on mobile

**Manual Test:**
```bash
# 1. Open http://localhost:3000 in browser
# 2. Open DevTools (F12)
# 3. Toggle device toolbar
# 4. Test each breakpoint:
#    - iPhone SE (375px)
#    - iPad (768px)
#    - iPad Pro (1024px)
#    - Desktop (1440px)
```

---

## 7. BUILD & DEPLOYMENT READINESS ✅

Verify the production build is ready.

```bash
# 1. Run production build
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Routes generated (9 routes + middleware)
# ✓ No TypeScript errors
# ✓ No critical linting errors
```

**Checklist:**
- [ ] `npm run build` completes successfully (0 errors)
- [ ] `npm run lint` shows 0 errors
- [ ] All TypeScript types are correct
- [ ] Middleware is included in build
- [ ] No console errors in browser DevTools

---

## 8. ENVIRONMENT VARIABLES ✅

Confirm all required environment variables are set.

**In `.env.local` (local development):**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**In Vercel/production environment variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Checklist:**
- [ ] `.env.local` has SUPABASE_URL
- [ ] `.env.local` has SUPABASE_ANON_KEY
- [ ] `.env.local` is in `.gitignore` (NOT committed)
- [ ] Production env vars set in Vercel/hosting
- [ ] No service-role key exposed anywhere
- [ ] No hardcoded secrets in code

---

## 9. DATABASE BACKUP ✅

Before going live, backup your Supabase database.

```bash
# 1. Go to Supabase Dashboard
# 2. Navigate to: Backups > Automated Backups
# 3. Verify backups are enabled
# 4. Create manual backup:
#    - Click "Backup now"
#    - Name it: "pre-launch-backup"
```

**Checklist:**
- [ ] Automated backups enabled in Supabase
- [ ] Manual backup created and named
- [ ] Backup includes all tables
- [ ] Can restore from backup if needed

---

## 10. FINAL SIGN-OFF ✅

Complete final verification before deployment.

**Last Checks:**
- [ ] All database tables verified
- [ ] Authentication flows working
- [ ] Complete article workflow tested (draft → publish)
- [ ] All roles tested and working
- [ ] Security policies verified
- [ ] Mobile responsive
- [ ] Build succeeds with 0 errors
- [ ] Environment variables set
- [ ] Database backed up
- [ ] Team notified of changes
- [ ] Documentation updated (if needed)

**Sign-off:**
- [ ] Platform tested and verified
- [ ] Ready for production deployment
- [ ] Team approval obtained
- [ ] Launch checklist completed

---

## 🚀 DEPLOYMENT STEPS

### Local to Vercel
```bash
# 1. Ensure all changes are committed
git status  # should be clean

# 2. Push to main/production branch
git push origin main

# 3. Vercel auto-deploys on push
# 4. Verify deployment: https://your-domain.com
# 5. Monitor logs in Vercel dashboard
```

### Supabase Configuration
```bash
# 1. Verify RLS is enabled:
#    Supabase Dashboard → Authentication → Policies

# 2. Verify SSL is enabled:
#    Supabase Dashboard → Database → Settings

# 3. Set up monitoring:
#    Supabase Dashboard → Logs → Database Logs
```

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues

**Q: Can't sign in**
- A: Verify Supabase credentials in `.env.local`
- Check Supabase project settings
- Ensure user email is confirmed

**Q: Dashboard shows "Loading..." forever**
- A: Check browser console for errors
- Verify Supabase URL is correct
- Check CORS settings in Supabase

**Q: Articles can't be published**
- A: Verify RLS policies are correct
- Check user role in profiles table
- Verify database trigger is active

**Q: Session doesn't persist after refresh**
- A: Check browser cookies settings
- Verify createBrowserClient is used
- Clear browser cache and retry

---

**Last Updated:** 2026-09-01
**Status:** Ready for Testing & Deployment
