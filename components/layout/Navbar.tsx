"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();

  return (
    <header className="w-full border-b border-white/10 bg-[#050816]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* BRAND */}
        <Link href="/" className="font-bold text-white tracking-wide">
          AdSphere
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-6 text-sm text-white/60">

          <Link
            href="/"
            className={path === "/" ? "text-white" : "hover:text-white"}
          >
            Home
          </Link>

          <Link
            href="/marketplace"
            className={path === "/marketplace" ? "text-white" : "hover:text-white"}
          >
            Marketplace
          </Link>

          <Link
            href="/dashboard"
            className={path === "/dashboard" ? "text-white" : "hover:text-white"}
          >
            Dashboard
          </Link>

          <Link
            href="/campaigns"
            className={path === "/campaigns" ? "text-white" : "hover:text-white"}
          >
            Campaigns
          </Link>

          <Link
            href="/list-space"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
          >
            List Space
          </Link>

        </nav>
      </div>
    </header>
  );
}