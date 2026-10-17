import type { NavbarProps } from "sanity";

export default function StudioNavbar(props: NavbarProps) {
  return (
    <div className="relative">
      {props.renderDefault(props)}
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="absolute right-28 top-1/2 -translate-y-1/2 rounded border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        View public site
      </a>
    </div>
  );
}
