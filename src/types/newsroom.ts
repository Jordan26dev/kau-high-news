export type HomepageSettings = {
  siteLogo?: string;
  siteLogoAlt?: string;
  showFeaturedStory: boolean;
  showTopStories: boolean;
  showSectionSpotlight: boolean;
  showLatestStories: boolean;
  showAbout: boolean;
  showEditorNote: boolean;
  showNewsCrew: boolean;
  showContacts: boolean;
  featuredStoryId?: string;
  noStoriesKicker: string;
  noStoriesTitle: string;
  noStoriesDescription: string;
  featuredLabel: string;
  featuredAsideLabel: string;
  featuredAsideTitle: string;
  featuredAsideDescription: string;
  topStoriesLabel: string;
  topStoriesTitle: string;
  topStoriesDescription: string;
  topStoriesCount: number;
  sectionSpotlightLabel: string;
  sectionSpotlightTitle: string;
  sectionSpotlightDescription: string;
  newsSectionDescription: string;
  sportsSectionDescription: string;
  clubsSectionDescription: string;
  latestStoriesLabel: string;
  latestStoriesTitle: string;
  latestStoriesDescription: string;
  aboutLabel: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutSideLabel: string;
  aboutSideText: string;
  editorNoteLabel: string;
  editorNoteTitle: string;
  editorNoteText: string;
  crewLabel: string;
  crewTitle: string;
  crewDescription: string;
  crewPhoto?: string;
  crewPhotoAlt?: string;
  crewPhotoCaption?: string;
  contactsTitle: string;
  contactsDescription: string;
  contacts: NewsroomContact[];
};

export type NewsroomContact = {
  key: string;
  name: string;
  purpose?: string;
  email?: string;
  website?: string;
  websiteLabel?: string;
};

export type StaffProfile = {
  id: string;
  name: string;
  slug: string;
  role: string;
  club?: string;
  bio?: string;
  photo?: string;
  photoAlt?: string;
};

export const defaultHomepageSettings: HomepageSettings = {
  siteLogo: undefined,
  siteLogoAlt: undefined,
  showFeaturedStory: true,
  showTopStories: true,
  showSectionSpotlight: true,
  showLatestStories: true,
  showAbout: true,
  showEditorNote: true,
  showNewsCrew: true,
  showContacts: false,
  noStoriesKicker: "The front page",
  noStoriesTitle: "The next story starts here.",
  noStoriesDescription: "Check back soon for reporting from Kau High.",
  featuredLabel: "Featured Story",
  featuredAsideLabel: "Editor's pick",
  featuredAsideTitle: "A closer look at the stories shaping campus this week.",
  featuredAsideDescription: "Student voices, school events, and reporting from across the community.",
  topStoriesLabel: "Top stories",
  topStoriesTitle: "More from the newsroom",
  topStoriesDescription: "Recent stories from the Kau High community.",
  topStoriesCount: 3,
  sectionSpotlightLabel: "In the newsroom",
  sectionSpotlightTitle: "Browse by section",
  sectionSpotlightDescription: "Browse published stories by section.",
  newsSectionDescription: "Campus news and community updates",
  sportsSectionDescription: "Teams, games, and student athletes",
  clubsSectionDescription: "Clubs, activities, and student life",
  latestStoriesLabel: "From the newsroom",
  latestStoriesTitle: "Latest stories",
  latestStoriesDescription: "New reporting from across Kau High.",
  aboutLabel: "About the paper",
  aboutTitle: "Reporting the stories that shape school life.",
  aboutDescription: "Kau High News brings together student reporting, school updates, and club highlights in one clear, modern publication.",
  aboutSideLabel: "From the newsroom",
  aboutSideText: "News, sports, and stories from the Kau High School community.",
  editorNoteLabel: "Editor's note",
  editorNoteTitle: "Keeping the school community informed.",
  editorNoteText: "Kau High News is built to share student stories, school updates, and events in a clear and welcoming format for readers of all ages.",
  crewLabel: "Meet the news crew",
  crewTitle: "The voices behind Kau High News",
  crewDescription: "Meet the students and staff who bring our stories to life.",
  contactsTitle: "Contact the newsroom",
  contactsDescription: "Send a news tip, ask a question, or reach the Kau High News team.",
  contacts: [],
};
