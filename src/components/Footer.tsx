"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;

  return (
    <footer className="border-t-4 border-[#7f1919] bg-[#fffdf7] py-10 text-sm text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-900">Kau High News</p>
          <p className="mt-1">Student journalism for the school community.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="#latest-stories" className="font-semibold text-slate-900 hover:text-blue-700">
            Latest stories
          </Link>
          <div className="flex flex-col gap-1 border-l-2 border-[#d9c7ae] pl-4">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500">
              For editors
            </span>
            <Link
              href="/studio"
              className="inline-flex min-h-10 items-center border border-[#7f1919] bg-[#7f1919] px-4 py-2 font-semibold text-white transition hover:bg-[#5b1212] focus:outline-none focus:ring-2 focus:ring-[#7f1919] focus:ring-offset-2"
            >
              Editor sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
