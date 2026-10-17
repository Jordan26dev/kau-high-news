"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import StudioNavbar from "./src/sanity/components/StudioNavbar";
import { schemaTypes } from "./src/sanity/schemaTypes";

export default defineConfig({
  name: "kau-high-news",
  title: "Kau High News",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "abcdefgh",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Newsroom")
          .items([
            S.documentTypeListItem("article").title("Stories"),
            S.documentTypeListItem("staffProfile").title("News crew"),
            S.listItem()
              .title("Homepage & site settings")
              .child(
                S.document()
                  .schemaType("homepageSettings")
                  .documentId("homepageSettings"),
              ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
  studio: {
    components: {
      navbar: StudioNavbar,
    },
  },
});
