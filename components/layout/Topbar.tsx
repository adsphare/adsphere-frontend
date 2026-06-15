"use client";

import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between mb-8">

      {/* SEARCH */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 w-full max-w-md focus-within:border-blue-500/40 transition">
        <Search size={18} className="text-white/50" />

        <input
          placeholder="Search listings, campaigns..."
          className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/30"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* NOTIFICATIONS */}
        <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <Bell size={18} className="text-white/70" />

          {/* notification dot (optional SaaS touch) */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        {/* USER */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">

          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />

          <span className="text-sm text-white/80 font-medium">
            Admin
          </span>

        </div>

      </div>

    </div>
  );
}