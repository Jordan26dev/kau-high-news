# Kau High News

Kau High News is a Next.js student newspaper website. It uses Sanity for its private editor, story drafts, publishing, and photo uploads. The public site reads published stories and keeps its current newspaper design.

## Get started

Follow [EDITOR_GUIDE.md](./EDITOR_GUIDE.md) to create the Sanity project, connect the site, sign in at `/studio`, and publish stories. Existing Supabase data is preserved and is not automatically imported.

For local development:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site or [http://localhost:3000/studio](http://localhost:3000/studio) for the editor.

## Verify

```bash
npm run lint
npm run build
```

## Content model

Sanity's `Story` type contains the headline, URL, section, subtitle, summary, byline, publication date, photo with alt text/caption, tags, and story text. Sanity drafts are private; published documents appear on the public site.

The old Supabase migrations are retained as database history. This app no longer uses Supabase for sign-in or publishing.
