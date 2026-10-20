# Kau High News

Kau High News is a Next.js student newspaper website. Sanity manages public stories, newsroom profiles, homepage settings, and images. The public site keeps its current newspaper design.

## Get started

Follow [EDITOR_GUIDE.md](./EDITOR_GUIDE.md) to connect and use the Sanity publishing studio.

For local development:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/studio](http://localhost:3000/studio) to manage content in Sanity.

## Verify

```bash
npm run lint
npm run build
```

## Content model

Sanity's `Story` type contains the headline, URL, section, subtitle, summary, byline, publication date, photo with alt text/caption, tags, and story text. Sanity drafts are private; published documents appear on the public site.

Sanity is the content source for public articles. Drafts remain private in Sanity until an editor publishes them.
