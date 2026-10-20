import type { PortableTextBlock } from "@portabletext/react";

export type Article = {
  id: string | number;
  slug: string;
  authorProfileId?: string;
  authorProfileSlug?: string;
  category: string;
  title: string;
  subtitle?: string;
  summary: string;
  author: string;
  date: string;
  updatedDate?: string;
  readingTime: string;
  image: string;
  imageAlt?: string;
  imageCaption?: string;
  tags: string[];
  content: string;
  storyBlocks?: PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
};
