import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";

type ArticleBodyProps = {
  content: string;
  storyBlocks?: PortableTextBlock[];
};

type StoryImage = {
  assetUrl?: string;
  alt?: string;
  caption?: string;
  credit?: string;
};

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="max-w-3xl pt-3 font-serif text-2xl font-bold text-[#3b0a0a]">{children}</h2>,
    h3: ({ children }) => <h3 className="max-w-3xl pt-2 font-serif text-xl font-bold text-[#3b0a0a]">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="max-w-3xl border-l-4 border-[#7f1919] pl-5 italic text-slate-600">{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      if (!/^https?:\/\//i.test(href)) return <>{children}</>;
      return <a href={href} className="text-[#7f1919] underline underline-offset-2" rel="noreferrer">{children}</a>;
    },
  },
  types: {
    image: ({ value }) => {
      const image = value as StoryImage;
      if (!image.assetUrl) return null;
      return (
        <figure className="max-w-4xl py-3">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
            <Image src={image.assetUrl} alt={image.alt || ""} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" unoptimized />
          </div>
          {image.caption || image.credit ? (
            <figcaption className="mt-2 text-sm text-slate-500">
              {image.caption}{image.caption && image.credit ? " " : ""}{image.credit ? `Photo: ${image.credit}` : ""}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export default function ArticleBody({ content, storyBlocks }: ArticleBodyProps) {
  if (storyBlocks?.length) {
    return (
      <div className="mt-8 space-y-5 text-lg leading-8 text-slate-700">
        <PortableText value={storyBlocks} components={components} />
      </div>
    );
  }

  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="mt-8 space-y-5 text-lg leading-8 text-slate-700">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="max-w-3xl">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
