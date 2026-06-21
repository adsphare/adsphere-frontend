"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/list-space", label: "List Space" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* =========================
            LOGO
        ========================= */}
        <Link href="/" className="flex items-center gap-3">

          <Image
            src="/logo.png"
            alt="Adsphere"
            width={40}
            height={40}
            priority
          />

          <div className="leading-tight">
            <h1 className="text-white font-bold text-lg">Adsphere</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">
              Visibility Network
            </p>
          </div>

        </Link>

        {/* =========================
            DESKTOP NAV LINKS
        ========================= */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  active
                    ? "text-blue-400"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* =========================
            ACTIONS (DESKTOP)
        ========================= */}
        <div className="hidden md:flex items-center gap-3">

          {/* 🔔 NOTIFICATIONS */}
          <NotificationBell />

          <Link
            href="/marketplace"
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition"
          >
            Explore
          </Link>

          <Link
            href="/list-space"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20 transition"
          >
            Create Listing
          </Link>

        </div>

        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>

      </div>

      {/* =========================
          MOBILE MENU
      ========================= */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#050816]/95 backdrop-blur-xl">

          <div className="px-6 py-5 flex flex-col gap-4">

            {/* MOBILE TOP BAR */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Menu</span>

              {/* 🔔 NOTIFICATIONS (MOBILE) */}
              <NotificationBell />
            </div>

            {/* LINKS */}
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`transition ${
                  pathname === link.href
                    ? "text-blue-400"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* CTA BUTTON */}
            <Link
              href="/list-space"
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-3 rounded-xl bg-blue-600 text-center font-semibold"
            >
              Create Listing
            </Link>

          </div>

        </div>
      )}

    </header>
  );
}