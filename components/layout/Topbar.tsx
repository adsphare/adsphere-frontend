"use client";

import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between mb-8">

      {/* SEARCH */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 w-full max-w-md">
        <Search size={18} className="text-white/60" />
        <input
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-white w-full"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <button className="p-2 rounded-lg bg-white/5 border border-white/10">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="w-6 h-6 rounded-full bg-blue-600" />
          <span className="text-sm">Admin</span>
        </div>

      </div>

    </div>
  );
}
