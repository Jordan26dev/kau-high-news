# Kau High News editor setup

The site keeps its current newspaper design. Sanity provides the sign-in, story editor, and image library; Next.js displays the published content. You don't need a Supabase account, database query, or service key to publish new stories.

## One-time setup

### 1. Create your publishing account and project

1. Go to [sanity.io/manage](https://www.sanity.io/manage) and create a Sanity account.
2. Create a project named **Kau High News**. Use the default dataset name `production` and make the dataset public so the website can read published stories.
3. Copy the project ID from the project settings. The project creator is the first project administrator.

### 2. Connect the site locally

1. Copy `.env.local.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` to your project ID. The dataset name can stay `production`.
3. In the Sanity project settings under **API → CORS origins**, add `http://localhost:3000` and allow credentials.
4. Run `npm run dev`, open `http://localhost:3000/studio`, and sign in with the Sanity account you created.

### 3. Connect the deployed site

1. Add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET=production` to the hosting project's environment variables.
2. Add your deployed website origin (for example, `https://your-site.example`) to Sanity's CORS origins and allow credentials.
3. Deploy the site. Open `/studio` on the deployed site and sign in.

No Sanity API write token belongs in `.env.local` or browser code. Sanity Studio handles editor authentication directly.

## Publish a story

1. Open `/studio` and sign in.
2. Choose **Story** → **Create**.
3. Enter the headline, URL slug (generate it from the headline), section, short summary, and byline.
4. Add a story photo if you have one. Fill out the photo description for accessibility and add a caption/credit when appropriate.
5. Write the story in the **Story** field. Use a blank line between paragraphs.
6. Select **Publish** when ready. To keep it private, leave it as a draft.

Published stories appear on the front page, section pages, and their own story page. The homepage usually refreshes published content within about 10 seconds. Drafts stay private in Sanity. Edit or unpublish stories from the same studio.

## Change the homepage

1. Open **Homepage & site settings** in the Studio.
2. Use **Homepage sections** to show or hide the featured story, story lists, section links, About, editor's note, and News Crew blocks. Turning off **Show featured story on homepage** hides that featured article from all homepage story lists; it remains published on its story page and section page.
3. Use **Featured story** to edit the empty-front-page message and featured-story text. You can select a published story to feature; leave the selection empty to use the newest published story.
4. Use **Story lists** and **About the paper** to update section introductions and homepage text. You can also choose how many additional stories to show.
5. Click **Publish** on the settings document. Published changes appear on the site within about 10 seconds. Saving as a draft does not change the public site.

The existing layout and style are intentionally kept consistent. Editors can change the text, photos, featured story, and visibility of the built-in homepage sections. Creating a new kind of section or changing the page layout requires a code change and redeployment.

## Add public newsroom contacts

1. Open **Homepage & site settings** and select **Newsroom contacts**.
2. Add a contact with a short name such as **News tips**, **Corrections**, or **Faculty adviser**. Add a short purpose, a public email, and/or a public website URL.
3. Add more entries as needed. Reorder the contacts by dragging them in the list.
4. In **Homepage sections**, turn on **Show newsroom contacts**, then publish the settings document.

The contact section appears near the bottom of the homepage when enabled. Only use contact details explicitly approved for public use by the school. Prefer a shared newsroom or school address; do not publish a student's personal email, phone number, or other private contact information.

## Manage the News Crew

1. Open **News crew** and create a **News crew profile** for each person.
2. Enter their name, generate a profile URL, add their role, club/group if applicable, and a short bio.
3. Optionally upload a profile photo and provide its required photo description.
4. Adjust **Display order** to choose the order on the homepage. Turn off **Show in Meet the News Crew** to keep a profile off the homepage without deleting it.
5. Publish the profile. The public homepage will show it, and the profile page will list stories connected to that person.
6. Open **Homepage & site settings** → **Meet the news crew** to add the group photo, its required description, and an optional caption/credit. Publish the settings when ready.

When editing a story, choose a **Crew profile** to connect it to a profile. The selected profile's name is used as the public byline, and readers can open the profile and its published stories. For a guest or outside writer, leave **Crew profile** empty and enter their name in **Byline** instead.

The Studio has a **View public site** button in its top bar. It opens the newspaper in another tab so you can check published changes; return to the Studio tab to keep editing.

## Existing Supabase information

This change does **not** delete Supabase users, stories, settings, or uploaded files. The site no longer uses Supabase for its publishing workflow, so old records won't automatically show up in Sanity. Keep the Supabase project and its data until you have checked the new editor and copied/exported anything you still need. Do not delete the old accounts or database as part of initial Sanity setup.
