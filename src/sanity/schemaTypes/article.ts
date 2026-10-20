import { defineArrayMember, defineField, defineType } from "sanity";
import { webpImageValidation } from "./imageValidation";

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
      validation: webpImageValidation,
      description: "WebP is recommended to keep pages quick to load.",
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
      name: "storyBlocks",
      title: "Story text and inline photos",
      type: "array",
      description: "Write the story here. Use the plus button to add paragraphs, headings, links, and photos between paragraphs.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              defineField({
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          title: "Story photo",
          options: { hotspot: true },
          validation: webpImageValidation,
          fields: [
            defineField({
              name: "alt",
              title: "Photo description",
              type: "string",
              description: "Describe what is visible for readers using screen readers.",
              validation: (rule) => rule.required().max(200),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              validation: (rule) => rule.max(300),
            }),
            defineField({
              name: "credit",
              title: "Photo credit",
              type: "string",
              validation: (rule) => rule.max(120),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.custom((value, context) => {
        if (Array.isArray(value) && value.length > 0) return true;
        const legacyContent = context.document?.content;
        return typeof legacyContent === "string" && legacyContent.trim().length > 0
          ? true
          : "Add story text before publishing.";
      }),
    }),
    defineField({
      name: "content",
      title: "Older story text (legacy)",
      type: "text",
      rows: 20,
      description: "This field keeps older stories working. Write new stories in Story text and inline photos above.",
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
