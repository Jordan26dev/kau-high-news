import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="border-y-2 border-[#5b1212] bg-white p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">One-time setup</p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#3b0a0a]">Connect your editor</h1>
          <p className="mt-4 leading-7 text-slate-600">
            Create a Sanity project, add its project ID as <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>,
            and deploy again. Follow the Editor Setup Guide for the short steps.
          </p>
          <a href="https://www.sanity.io/manage" className="mt-6 inline-flex min-h-11 items-center bg-[#7f1919] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5b1212]">
            Open Sanity
          </a>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
