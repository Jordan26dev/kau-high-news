import { defineField, defineType } from "sanity";
import { webpImageValidation } from "./imageValidation";

export const staffProfile = defineType({
  name: "staffProfile",
  title: "News crew profile",
  type: "document",
  orderings: [
    {
      title: "Crew display order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Profile URL",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "News crew role",
      type: "string",
      description: "For example, Reporter, Photographer, or Editor.",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "club",
      title: "Club or group",
      type: "string",
      description: "Optional club or group name.",
    }),
    defineField({
      name: "bio",
      title: "Profile bio",
      type: "text",
      rows: 4,
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: "photo",
      title: "Profile photo",
      type: "image",
      options: { hotspot: true },
      validation: webpImageValidation,
      fields: [
        defineField({
          name: "alt",
          title: "Photo description",
          type: "string",
          description: "Describe the photo for readers using screen readers.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first in the News Crew section.",
    }),
    defineField({
      name: "showOnHomepage",
      title: "Show in Meet the News Crew",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "photo",
    },
  },
});
