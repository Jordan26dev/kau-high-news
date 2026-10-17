import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Story",
  type: "document",
  orderings: [
    {
      title: "Newest published",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "slug",
      title: "Story URL",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Section",
      type: "string",
      options: {
        list: [
          { title: "News", value: "News" },
          { title: "Sports", value: "Sports" },
          { title: "Clubs", value: "Clubs" },
        ],
        layout: "radio",
      },
      initialValue: "News",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "Optional short line underneath the headline.",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "author",
      title: "Byline",
      type: "string",
      initialValue: "Kau High News",
      description: "Used for guest writers who do not have a crew profile.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorProfile",
      title: "Crew profile",
      type: "reference",
      to: [{ type: "staffProfile" }],
      description: "Optional. Select a crew member to link this story to their profile.",
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Reading time",
      type: "string",
      initialValue: "1 min read",
    }),
    defineField({
      name: "heroImage",
      title: "Story photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Photo description",
          type: "string",
          description: "Describe the photo for readers using screen readers.",
        }),
        defineField({
          name: "caption",
          title: "Caption / photo credit",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "content",
      title: "Story",
      type: "text",
      rows: 20,
      description: "Leave a blank line between paragraphs.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "heroImage",
    },
  },
});
