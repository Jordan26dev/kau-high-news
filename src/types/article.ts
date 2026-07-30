export type Article = {
  id: number;
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
  summary: string;
  author: string;
  date: string;
  updatedDate?: string;
  readingTime: string;
  image: string;
  tags: string[];
  content: string;
  seoTitle?: string;
  seoDescription?: string;
};
