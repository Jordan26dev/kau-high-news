"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ArticleMetaProps = {
  author: string;
  authorSlug?: string;
  date: string;
  readingTime: string;
  title: string;
  slug: string;
};

export default function ArticleMeta({
  author,
  authorSlug,
  date,
  readingTime,
  title,
  slug,
}: ArticleMetaProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/news/${slug}`;
  }, [slug]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1800);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleShare = async () => {
    if (typeof navigator === "undefined" || !shareUrl) {
      return;
    }

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text: `Read ${title}`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fall back to copying the link when sharing is dismissed.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      // Ignore clipboard issues in unsupported browsers.
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-3 border-y border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p>
          By {authorSlug ? (
            <Link href={`/authors/${authorSlug}`} className="font-semibold text-[#7f1919] hover:underline">
              {author}
            </Link>
          ) : author} • {date}
        </p>
        <p className="mt-1 font-medium text-slate-700">{readingTime}</p>
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="rounded-full bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
      >
        {copied ? "Link copied" : "Share story"}
      </button>
    </div>
  );
}
