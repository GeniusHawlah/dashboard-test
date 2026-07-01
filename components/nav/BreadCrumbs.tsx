"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  mentee: "Dashboard",
  mentor: "Dashboard",
};

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function BreadCrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const decoded = decodeURIComponent(segment).replace(/-/g, " ");

    return {
      href,
      label: LABELS[segment] ?? toTitleCase(decoded),
      isLast: index === segments.length - 1,
    };
  });

  if (!crumbs.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
      {crumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          {index > 0 && <span className="text-slate-300">/</span>}

          {crumb.isLast ? (
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 transition hover:text-slate-600"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
