Database setup
----------------

This project uses Supabase (Postgres) for long-term storage of site settings and articles. Apply the migrations in order. `001_create_tables.sql` creates the initial storage tables; `002_staff_profiles_and_rls.sql` adds staff profiles, article workflow metadata, ownership, and Row Level Security policies; `003_editorial_history_and_notes.sql` adds private editorial notes and automatic status history; `004_enforce_article_transitions.sql` enforces role-aware status transitions at the database layer.

`001_create_tables.sql` contains:

- `settings` — key/value JSON storage used for site-wide settings like `featuredSlug`, `featuredImage`, and `underDevelopment`.
- `articles` — a simple articles table that can hold published content and demo items (flagged with `is_demo`).

To apply the migration using psql against a Postgres database:

```bash
# replace with your database connection string
psql "$DATABASE_URL" -f db/migrations/001_create_tables.sql
```

To apply with the Supabase CLI (recommended if using Supabase):

```bash
supabase db remote set <YOUR_DB_URL>
supabase db push
```

After the tables exist, apply migration 002 as well:

```bash
psql "$DATABASE_URL" -f db/migrations/002_staff_profiles_and_rls.sql
```

Migration 002 creates new Supabase Auth profiles as `Writer` by default. Do not use a client-side invite code to grant privileged roles. After your first trusted account exists, promote it from the Supabase SQL editor with:

```sql
update public.profiles
set role = 'Administrator'
where id = '<AUTH_USER_UUID>';
```

If migration 002 was partially applied before the latest version, rerun the complete file. It is written with `IF NOT EXISTS` and will add the profile approval `status` column safely.

Replace `<AUTH_USER_UUID>` with the user ID shown in Supabase Authentication. The app can continue using `src/lib/siteSettings.ts` for settings, but writes will only succeed for roles allowed by the RLS policies.
