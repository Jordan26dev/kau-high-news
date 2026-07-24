type ArticleBodyProps = {
  content: string;
};

export default function ArticleBody({ content }: ArticleBodyProps) {
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
