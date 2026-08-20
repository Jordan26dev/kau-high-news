Database setup
----------------

This project uses Supabase (Postgres) for long-term storage of site settings and articles. The `db/migrations/001_create_tables.sql` file contains the initial schema for:

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

After the tables exist, the app can use `src/lib/siteSettings.ts` to read/write settings.
