"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SpaceCard from "@/components/marketplace/SpaceCard";
import { listings } from "@/data/listings";

const filters = ["all", "billboard", "social", "video"];

export default function MarketplacePage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredListings =
    activeFilter === "all"
      ? listings
      : listings.filter((item) => item.type === activeFilter);

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-20">

        {/* Header */}
        <h1 className="text-5xl font-bold mb-6">
          Marketplace
        </h1>

        <p className="text-gray-400 mb-10">
          Filter and discover premium ad spaces worldwide
        </p>

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

        {/* GRID */}
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
