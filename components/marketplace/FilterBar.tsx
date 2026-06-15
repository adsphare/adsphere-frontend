"use client";

import { useEffect, useState } from "react";

type Props = {
  onFilterChange?: (filters: any) => void;
};

export default function FilterBar({ onFilterChange }: Props) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [location, setLocation] = useState("");

  // 🔥 FIX: always sync filters properly
  useEffect(() => {
    onFilterChange?.({
      search,
      type,
      location,
    });
  }, [search, type, location]);

  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl mb-6 backdrop-blur-md">

      {/* TITLE ROW (optional SaaS touch) */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white/70">
          Filter Marketplace
        </h2>
        <p className="text-xs text-white/30">
          Find high-impact ad spaces instantly
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ad spaces..."
          className="p-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-blue-500/40 outline-none transition"
        />

        {/* TYPE */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-3 bg-black/30 border border-white/10 rounded-xl text-white focus:border-blue-500/40 outline-none transition"
        >
          <option value="all">All Types</option>
          <option value="billboard">Billboard</option>
          <option value="digital">Digital Screen</option>
          <option value="influencer">Influencer</option>
          <option value="social">Social Media</option>
        </select>

        {/* LOCATION */}
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location..."
          className="p-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-blue-500/40 outline-none transition"
        />

      </div>
    </div>
  );
}