"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/list-space", label: "Create Listing" },
    { href: "/dashboard/messages", label: "Messages" },
    { href: "/campaigns", label: "Campaigns" },
    { href: "/analytics", label: "Analytics" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <aside className="h-screen w-64 bg-[#050816] border-r border-white/10 flex flex-col">

      {/* =========================
         BRAND
      ========================= */}
      <div className="px-5 py-6 border-b border-white/10">
        <h1 className="text-lg font-semibold text-blue-400 tracking-wide">
          AdSphere
        </h1>

        <p className="text-xs text-white/30 mt-1">
          Visibility OS
        </p>
      </div>

      {/* =========================
         NAVIGATION
      ========================= */}
      <nav className="flex-1 px-3 py-5 space-y-1">

        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center px-3 py-2 rounded-lg text-sm transition
                ${
                  active
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* =========================
         FOOTER SECTION
      ========================= */}
      <div className="px-5 py-4 border-t border-white/10 text-xs text-white/30">
        © {new Date().getFullYear()} AdSphere
      </div>

    </aside>
  );
}