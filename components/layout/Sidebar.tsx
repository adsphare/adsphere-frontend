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
    <aside className="w-64 min-h-screen bg-white/5 border-r border-white/10 p-5">

      {/* BRAND */}
      <h1 className="text-xl font-bold text-blue-400 mb-8">
        AdSphere
      </h1>

      {/* NAV */}
      <nav className="space-y-2 text-sm">

        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                block px-3 py-2 rounded-lg transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}

      </nav>

    </aside>
  );
}