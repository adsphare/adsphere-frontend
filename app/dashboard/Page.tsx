"use client";

import Navbar from "@/components/layout/Navbar";
import { store } from "@/lib/store";
import { getUser } from "@/lib/auth";
import { useState } from "react";

export default function DashboardPage() {
  const [_, forceUpdate] = useState(0);

  const user = getUser();

  const userListings = store.listings.filter(
    (item) => item.userId === user?.id
  );

  const deleteListing = (id: string) => {
    store.listings = store.listings.filter((item) => item.id !== id);
    forceUpdate((x) => x + 1);
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-bold mb-4">
          Dashboard
        </h1>

        <p className="text-gray-400 mb-10">
          Manage your listings
        </p>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <p className="text-gray-400">My Listings</p>
            <h2 className="text-3xl font-bold mt-2">
              {userListings.length}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <p className="text-gray-400">Active Ads</p>
            <h2 className="text-3xl font-bold mt-2">
              {userListings.length}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <p className="text-gray-400">Revenue (Mock)</p>
            <h2 className="text-3xl font-bold mt-2">
              $1,240
            </h2>
          </div>

        </div>

        {/* LISTINGS */}
        <div className="space-y-4">

          {userListings.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center"
            >

              <div>
                <h3 className="font-semibold text-lg">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {item.location}
                </p>

                <p className="text-blue-400 mt-1">
                  {item.price}
                </p>
              </div>

              <button
                onClick={() => deleteListing(item.id)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500"
              >
                Delete
              </button>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}