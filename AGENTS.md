# CURRENT DEVELOPMENT MISSION

## Supabase Staff Authentication, Roles, and Newsroom System

You are working on **Kau High News**, the digital student newspaper for Kau High School.

The project already has:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Supabase
* Supabase Authentication
* A staff/dashboard system
* An articles system
* Database migrations
* Public article pages
* A GitHub repository
* A deployed production site

The goal of this phase is **NOT to rebuild the application**.

The goal is to understand, verify, and then expand the existing Supabase-powered staff/newsroom system into a proper editorial platform.

---

# 1. IMPORTANT: AUDIT BEFORE CHANGING ANYTHING

Before writing, deleting, refactoring, or installing code, perform a complete audit of the existing implementation.

Do NOT assume that something is broken simply because it looks incomplete.

Do NOT replace existing working systems with a new implementation until you understand how the current system works.

Do NOT create duplicate authentication, database, article, or dashboard systems.

First inspect the repository and determine exactly what already exists.

Inspect at minimum:

* `package.json`
* `src/`
* `src/app/`
* `src/components/`
* `src/lib/`
* `src/data/`
* `src/types/`
* `db/`
* all Supabase-related files
* authentication-related components
* dashboard routes
* article creation/editing routes
* article display routes
* middleware/proxy if present
* environment variable usage
* database migrations
* SQL policies/RLS
* TypeScript types
* any existing role/permission logic

Search the entire repository for:

* `supabase`
* `createClient`
* `createBrowserClient`
* `createServerClient`
* `auth`
* `getUser`
* `getSession`
* `signIn`
* `signOut`
* `session`
* `user`
* `role`
* `admin`
* `editor`
* `staff`
* `dashboard`
* `articles`
* `status`
* `published`
* `draft`
* `RLS`
* `policy`

Also inspect the Git history when useful to understand why existing systems were implemented a certain way.

---

# 2. DO NOT GUESS ABOUT SUPABASE

The project already has Supabase connected.

Your first job is to determine:

### Authentication

Verify:

* How users sign in
* How users sign out
* Whether authentication persists after refresh
* How the current user is retrieved
* Whether authentication works on server components
* Whether authentication works on client components
* Whether protected routes are actually protected
* Whether unauthenticated users can access dashboard URLs directly
* Whether authenticated users can access resources they should not have permission to access

### Database

Determine:

* What tables currently exist
* What columns they contain
* What relationships exist
* Which fields are currently used by the application
* Which fields exist but are not being used
* Which tables are mock/demo/local-data replacements
* Which data actually comes from Supabase
* Which data still comes from files under `src/data/`

### Security

Determine:

* Whether Row Level Security is enabled
* Which RLS policies exist
* What those policies allow
* Whether users can read/write data they should not be able to access
* Whether roles are trusted from the client
* Whether privileged operations are protected server-side
* Whether any service-role key is exposed to the browser
* Whether environment variables are being used correctly

NEVER expose a Supabase service-role key to client-side code.

NEVER solve authorization by simply hiding buttons.

Authorization must be enforced on the server/database where appropriate.

---

# 3. CREATE AN AUDIT REPORT BEFORE IMPLEMENTING MAJOR CHANGES

After inspecting the project, produce a concise internal report containing:

## Current Authentication

Explain:

* What currently works
* What does not work
* How authentication is implemented
* Where authentication is handled
* How sessions are managed

## Current Database

List the relevant tables and explain their purpose.

Example:

```text
articles
- id
- title
- slug
- status
- author
- content
...

settings
- ...
```

Use the ACTUAL schema found in the repository.

Do not invent fields.

## Current Dashboard

Explain:

* What routes exist
* What each route does
* Which routes are protected
* Which routes currently use mock data
* Which routes communicate with Supabase

## Current Roles

Determine whether roles already exist.

If roles do not exist, explicitly state that.

Do not silently invent a role system without first documenting the current state.

## Current Article Workflow

Determine the actual current workflow.

For example:

```text
Draft
  ↓
?
  ↓
Published
```

Do not assume the workflow above exists.

Document what the application currently does.

---

# 4. THEN DESIGN THE NEWSROOM SYSTEM

Once the audit is complete, design the next version around this editorial workflow:

```text
Draft
  ↓
Submitted
  ↓
In Review
  ↓
 ┌───────────────┐
 │               │
 ▼               ▼
Approved     Changes Requested
  │               │
  ▼               │
Scheduled         │
  │               │
  ▼               │
Published ◄───────┘
  │
  ▼
Archived
```

However, only implement states that make sense for the existing application.

Do not add unnecessary complexity.

---

# 5. STAFF ROLES

The long-term role model should support:

## Reporter

Can:

* Create articles
* Save drafts
* Edit their own drafts
* Submit articles for review
* View their own submissions
* Upload/use appropriate article media

Cannot:

* Publish articles
* Manage users
* Change other users' roles
* Modify site-wide settings
* Bypass editorial review

## Editor

Can:

* Everything a Reporter can do
* View submitted articles
* Review articles
* Edit articles
* Request changes
* Approve articles
* Publish articles if authorized
* Manage editorial content

## Managing Editor

Can:

* Everything an Editor can do
* Manage authors
* Manage sections/categories
* Manage featured stories
* Manage homepage editorial placement
* Manage additional newsroom settings

## Advisor/Admin

Can:

* Manage staff
* Manage roles
* Manage site settings
* Manage content
* Manage editorial permissions
* Perform administrative actions

These are the TARGET roles.

If the current application already has different roles, preserve existing functionality and determine whether those roles should be mapped into this model rather than blindly replacing them.

---

# 6. ROLE SECURITY

Roles must NOT be trusted solely from React state.

Bad:

```tsx
if (user.role === "admin") {
  showAdminButton();
}
```

This is useful for UI visibility but is NOT authorization.

Authorization must also be enforced through appropriate server-side checks and/or Supabase RLS policies.

A user should not be able to become an editor by modifying browser JavaScript.

A reporter should not be able to send a request that directly publishes an article simply because the frontend hides the Publish button.

---

# 7. STAFF PROFILE SYSTEM

Design the staff system so that authenticated users can eventually have profiles containing information such as:

* user ID
* display name
* email
* role
* avatar
* bio
* graduation/class year if appropriate
* staff position
* created date
* updated date

Do not duplicate authentication identity unnecessarily.

Supabase Auth should remain responsible for authentication.

Application-level profile information should live in an appropriate database table.

Use foreign keys where appropriate.

---

# 8. ARTICLE OWNERSHIP

Articles should eventually have a real relationship to the staff member who created them.

Do not rely exclusively on a plain text author name.

Prefer a proper author/user relationship where practical.

For example:

```text
articles
    ↓
author_id
    ↓
profiles/users
```

The public-facing article can still display the author's name.

This allows the newsroom to answer questions such as:

* Who wrote this?
* Which articles belong to this reporter?
* Which drafts are waiting for this editor?
* Which stories has a staff member published?
* Who last edited an article?

Do not implement this blindly if the existing schema has a different but valid architecture. First understand the current system.

---

# 9. EDITORIAL HISTORY

The long-term system should preserve important editorial history.

Consider an article revision/history system that can track:

* who changed an article
* when it was changed
* what action occurred
* previous status
* new status
* optional editorial note

Example:

```text
Jordan created draft
↓
Editor submitted for review
↓
Editor requested changes
↓
Jordan updated article
↓
Editor approved
↓
Managing Editor published
```

Do not build an unnecessarily complicated version-control system yet.

Start with a simple, reliable audit/history model.

---

# 10. EDITORIAL NOTES

Editors should eventually be able to leave internal notes on submissions.

Important:

Editorial notes should NOT automatically appear publicly on the article.

They are newsroom/private information.

Possible structure:

```text
article_editorial_notes
- id
- article_id
- author_id
- note
- created_at
- updated_at
```

Use appropriate RLS so only authorized staff can read these notes.

---

# 11. DASHBOARD DESIGN

The dashboard should eventually become the newsroom control center.

The main dashboard should communicate:

### At a glance

* Drafts
* Submitted articles
* Articles needing review
* Changes requested
* Scheduled articles
* Published articles

### Quick actions

* New Article
* My Drafts
* Review Queue
* Published Articles

### Recent activity

Show meaningful newsroom activity rather than decorative statistics.

Example:

```text
RECENT ACTIVITY

Jordan submitted "Robotics Team Advances"
12 minutes ago

Alex requested changes to "Football Season Preview"
1 hour ago

Maya published "Spirit Week Begins Monday"
Yesterday
```

Do not add fake statistics.

Everything displayed as real data should come from the actual application/database.

---

# 12. REVIEW QUEUE

Editors should eventually have a dedicated review queue.

It should show:

* Article title
* Author
* Category
* Submitted date
* Current status
* Last updated
* Priority if implemented later

Editors should be able to open an article and:

* Preview
* Edit
* Request changes
* Approve
* Publish if authorized

The review interface should feel like a newsroom tool, not an ordinary admin CRUD page.

---

# 13. ARTICLE CREATION

The article editor should eventually support:

* Title
* Subtitle/dek
* Summary
* Category
* Tags
* Author
* Hero image
* Image caption
* Content
* Status
* Save Draft
* Submit for Review

Later:

* Rich text editing
* Inline images
* Pull quotes
* Scheduled publishing
* SEO metadata
* Preview mode

Do NOT implement all of these at once.

Build the smallest useful version first.

---

# 14. PUBLIC ARTICLE SYSTEM

The public article pages must remain separate from the staff editing interface.

Public readers should see:

* Category
* Headline
* Subtitle
* Author
* Date
* Reading time
* Hero image
* Caption
* Article content
* Tags
* Related articles

Staff should have separate editing/review interfaces.

Do not mix internal editorial controls into public article components unless there is a clear reason.

---

# 15. DATABASE-FIRST THINKING

Before creating a new table:

1. Check whether an existing table already serves the purpose.
2. Check whether the feature can be implemented with existing relationships.
3. Check existing migrations.
4. Check existing TypeScript types.
5. Check current queries.
6. Only then create a migration if necessary.

Never create duplicate tables such as:

```text
users
staff_users
authors
staff
profiles
```

without understanding why each is needed.

Prefer a clean relational model.

---

# 16. MIGRATIONS

All database schema changes must be represented by migration files.

Never rely on manually changing the production database without recording the change in the repository.

Migration files should:

* Have clear names
* Be incremental
* Avoid destructive changes unless necessary
* Include appropriate RLS policies
* Include indexes where appropriate
* Include foreign keys where appropriate

Never casually delete production data.

---

# 17. EXISTING DATA MUST BE PRESERVED

Before changing the schema:

* Understand existing article data
* Understand demo data
* Understand existing users
* Understand existing settings
* Determine whether migration/backfill is necessary

Do not destroy existing functionality simply to create a cleaner architecture.

If a migration could break existing articles, explain the migration strategy first.

---

# 18. DO NOT BUILD EVERYTHING AT ONCE

Work incrementally.

The preferred order is:

### Step 1

Audit the current Supabase/auth/dashboard implementation.

### Step 2

Fix authentication/session/protection problems.

### Step 3

Establish the profile/role architecture.

### Step 4

Connect articles to authenticated authors.

### Step 5

Implement reliable article statuses.

### Step 6

Build the reporter workflow.

### Step 7

Build the editor review queue.

### Step 8

Add editorial notes/history.

### Step 9

Improve the dashboard UI.

### Step 10

Add scheduling/publishing features.

### Step 11

Only then consider more advanced newsroom features.

Do not skip directly to Step 10.

---

# 19. UI/UX DIRECTION

The staff dashboard should feel like a professional newsroom.

It should NOT look like:

* a generic Bootstrap admin panel
* a random SaaS dashboard
* a template full of colorful cards
* a developer control panel

The design language should match the public Kau High News site.

Use:

* strong typography
* restrained color
* clear hierarchy
* generous whitespace
* subtle borders
* subtle shadows
* excellent mobile behavior
* accessible controls
* clear status badges
* consistent buttons
* consistent spacing

The dashboard should feel like the private working side of the same publication.

---

# 20. RESPONSIVE DESIGN

Staff may use:

* desktop computers
* laptops
* tablets
* phones

Do not design only for desktop.

The dashboard should remain usable on smaller screens.

Tables should become cards or horizontally scroll when appropriate.

Large editorial forms should remain comfortable to use on mobile.

---

# 21. ACCESSIBILITY

All staff interfaces must:

* use semantic HTML
* have visible focus states
* have accessible labels
* support keyboard navigation
* maintain sufficient color contrast
* not rely solely on color to communicate status
* provide meaningful button labels
* provide useful error messages

Example:

Do not use only:

```text
🔴
```

Use:

```text
Needs Changes
```

with appropriate visual styling.

---

# 22. ERROR HANDLING

Never silently fail.

If Supabase returns an error:

* log useful diagnostic information during development
* show the user a useful message
* do not expose sensitive database information
* provide a reasonable recovery path

Examples:

```text
Unable to save your article.
Please try again.
```

rather than:

```text
Error: relation public.articles violates policy...
```

---

# 23. LOADING STATES

Database-backed interfaces need proper loading states.

Use:

* skeletons
* loading indicators
* disabled submit buttons
* optimistic updates only when safe

Never leave users wondering whether a button worked.

---

# 24. EMPTY STATES

Every database list should have a useful empty state.

Examples:

```text
No drafts yet.

Start writing your first story.
[ New Article ]
```

or:

```text
No articles are waiting for review.

You're all caught up.
```

Do not leave blank white space where data should appear.

---

# 25. TESTING REQUIREMENTS

Before considering a staff feature complete, test:

### Authentication

* Sign in
* Sign out
* Refresh page
* Open protected URL while logged out
* Open protected URL while logged in
* Session expiration behavior

### Roles

Test every role against every protected action.

At minimum:

* Reporter
* Editor
* Managing Editor
* Admin/Advisor

### Articles

Test:

* Create draft
* Save draft
* Edit draft
* Submit
* Review
* Request changes
* Resubmit
* Approve
* Publish
* View publicly

### Security

Attempt to perform restricted actions from:

* browser UI
* direct URL
* direct API/database request where practical

The application must not depend only on frontend restrictions.

---

# 26. DO NOT EXPOSE SECRETS

Never commit:

* `.env.local`
* Supabase service-role keys
* API secrets
* private tokens
* credentials

Only public client configuration may be exposed to browser code.

If a secret appears in tracked files, stop and report it before proceeding.

---

# 27. CODE QUALITY

Use:

* TypeScript
* clear component boundaries
* reusable components
* server components where appropriate
* client components only where interactivity requires them
* shared types
* shared utilities
* clear naming

Avoid:

* giant components
* duplicated Supabase queries
* duplicated permission logic
* `any` unless genuinely necessary
* unnecessary `useEffect`
* unnecessary client-side rendering
* hardcoded user roles
* fake database data presented as real data

---

# 28. NEXT.JS ARCHITECTURE

Prefer:

```text
Server Component
      ↓
Server-side data access
      ↓
Client Component only where interaction is needed
```

Do not make an entire page `"use client"` merely because one small component requires state.

If practical, extract interactive functionality into a dedicated client component.

However, do not perform a giant refactor solely to follow this rule.

Stability comes first.

---

# 29. CURRENT DATA SOURCES

The project may currently contain both:

* Supabase-backed data
* local/demo data under `src/data`

Do not immediately delete the local data.

Determine where each is used.

Gradually transition production functionality to the database when appropriate.

Clearly distinguish:

```text
demo data
```

from:

```text
production data
```

Never accidentally display fake demo content as if it were real school journalism.

---

# 30. COPILOT AGENT BEHAVIOR

You are an engineering agent working with the developer.

Do not blindly execute large changes.

For every significant feature:

1. Inspect the existing implementation.
2. Explain what you found.
3. Explain what needs to change.
4. Explain why.
5. Identify files that will be affected.
6. Implement the smallest reasonable change.
7. Run appropriate checks.
8. Fix errors.
9. Verify behavior.
10. Summarize the changes.
11. Suggest a concise Git commit message.

Do not modify unrelated files.

Do not rewrite working components unnecessarily.

Do not introduce new libraries unless there is a real reason.

Do not create duplicate systems.

---

# 31. COMMANDS AND VERIFICATION

Use the project's existing package manager and scripts.

Before major changes, inspect:

```bash
git status
```

After changes, run appropriate checks such as:

```bash
npm run lint
npm run build
```

and any available tests.

If a command fails:

1. Determine why.
2. Fix the underlying problem.
3. Run the command again.

Do not simply suppress errors.

---

# 32. GIT SAFETY

Do not:

* force push
* reset/delete user work
* rewrite history
* delete migrations
* remove production data

without explicit instruction.

Keep commits focused.

Good examples:

```text
feat(auth): protect staff dashboard routes
feat(newsroom): add article submission workflow
feat(roles): add staff role permissions
feat(editorial): add review queue
fix(auth): persist Supabase session correctly
fix(articles): enforce author ownership
```

---

# 33. DEFINITION OF DONE

A newsroom feature is NOT complete simply because the page renders.

It is complete when:

* The UI works
* The database works
* Authentication works
* Authorization works
* RLS/security is appropriate
* Loading states exist
* Error states exist
* Empty states exist
* Mobile behavior works
* Accessibility is reasonable
* Existing functionality still works
* The production build succeeds
* No secrets were introduced
* The feature is documented
* The code is maintainable

---

# 34. IMMEDIATE TASK

## DO NOT IMPLEMENT THE FULL NEWSROOM YET.

The immediate task is:

### AUDIT THE EXISTING SUPABASE STAFF SYSTEM.

Inspect the entire repository and answer:

1. How is Supabase currently initialized?
2. How is authentication implemented?
3. How does the application retrieve the current user?
4. How are protected routes implemented?
5. What dashboard routes currently exist?
6. What database tables currently exist?
7. What RLS policies currently exist?
8. How are articles currently stored?
9. How are articles currently created?
10. How are articles currently edited?
11. How are articles currently published?
12. Does the article system currently distinguish demo data from production data?
13. Does the application currently have user roles?
14. If so, where are those roles stored and enforced?
15. Can a normal authenticated user perform an action they should not be allowed to perform?
16. Which parts of the dashboard are currently mock/local-data based?
17. Which parts are genuinely connected to Supabase?
18. What is the smallest set of changes required to create a secure foundation for the newsroom workflow?

After completing the audit, provide a proposed implementation plan.

### IMPORTANT:

Do NOT start implementing the entire plan automatically.

First complete the audit and report your findings.

Then proceed one logical feature at a time.

The goal is to turn Kau High News into a real student newsroom platform while preserving the existing application and avoiding unnecessary rewrites.
