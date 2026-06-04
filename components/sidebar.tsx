"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  BarChart3,
  Store,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Marketplace", href: "/dashboard/marketplace", icon: Store },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-white/10 bg-[#0A0A0F] p-6">

      {/* LOGO */}
      <div className="text-xl font-bold mb-10">
        <span className="text-blue-500">Ad</span>Sphere
      </div>

      {/* LINKS */}
      <nav className="flex flex-col gap-2 text-sm">

        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          );
        })}

      </nav>
    </aside>
  );
}
