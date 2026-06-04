"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-10 py-6 border-b border-white/10 bg-black/30">

      <Link href="/" className="text-2xl font-bold">
        Ad<span className="text-blue-500">Sphere</span>
      </Link>

      <div className="hidden md:flex gap-8 text-sm text-zinc-400">

        <Link href="/">Home</Link>

        <Link href="/marketplace">
          Marketplace
        </Link>

        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/about">
          About
        </Link>

      </div>

    </nav>
  );
}

