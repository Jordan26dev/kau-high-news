import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-sm text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-900">Kau High News</p>
          <p className="mt-1">Student journalism for the school community.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="#latest-stories" className="font-semibold text-slate-900 hover:text-blue-700">
            Latest stories
          </Link>
          <Link href="/dashboard" className="font-semibold text-slate-900 hover:text-blue-700">
            Dashboard
          </Link>
          <Link href="/authors/jordan-virgo" className="font-semibold text-slate-900 hover:text-blue-700">
            Staff
          </Link>
        </div>
      </div>
    </footer>
  );
}
