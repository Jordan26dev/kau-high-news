import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import { getHomepageSettings } from "@/lib/articleRepository";
import { defaultHomepageSettings } from "@/types/newsroom";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kau High News",
  description: "A modern student newspaper for Kau High School.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let siteLogo = defaultHomepageSettings.siteLogo;
  let siteLogoAlt = defaultHomepageSettings.siteLogoAlt;
  try {
    const settings = await getHomepageSettings();
    siteLogo = settings.siteLogo;
    siteLogoAlt = settings.siteLogoAlt;
  } catch (error) {
    console.error("Unable to load site logo from Sanity.", error);
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex min-h-screen flex-col">
        <PageTransition logo={siteLogo} logoAlt={siteLogoAlt} />
        <Navbar logo={siteLogo} logoAlt={siteLogoAlt} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
