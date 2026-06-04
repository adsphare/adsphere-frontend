"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SpaceCard from "@/components/marketplace/SpaceCard";
import { store } from "@/lib/store";

const filters = ["all", "billboard", "social", "video"];

export default function MarketplacePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredListings = store.listings.filter((item) => {
    const matchesFilter =
      activeFilter === "all" || item.type === activeFilter;

    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-20">

        {/* HEADER */}
        <h1 className="text-5xl font-bold mb-4">
          Marketplace
        </h1>

        <p className="text-gray-400 mb-8">
          Search, filter and discover premium ad spaces worldwide
        </p>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search TikTok, Billboard, Instagram..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 mb-8 p-4 rounded-xl bg-white/5 border border-white/10"
        />

        {/* FILTER BUTTONS */}
        <div className="flex gap-4 mb-10 flex-wrap">

          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-xl border transition ${
                activeFilter === filter
                  ? "bg-blue-600 border-blue-500"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {filter}
            </button>
          ))}

        </div>

        {/* LISTINGS GRID */}
        <div className="grid md:grid-cols-3 gap-6">

          {filteredListings.map((item) => (
            <SpaceCard
              key={item.id}
              id={item.id}
              title={item.title}
              location={item.location}
              price={item.price}
            />
          ))}

        </div>

      </section>

    </main>
  );
}