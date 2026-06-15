"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#050816]">

      {/* GLOWS */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-blue-600/20 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-blue-500/10 blur-[150px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 min-h-[90vh] flex items-center">

        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* LEFT */}
          <div>

            <div className="inline-flex px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-sm mb-6">
              Visibility Operating System
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              The Future of
              <span className="block text-blue-500">
                Visibility
              </span>
            </h1>

            <p className="mt-6 text-white/50 text-lg max-w-xl">
              Adsphere connects creators, billboards, digital screens,
              retail spaces and advertisers into one unified marketplace.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">

              <Link
                href="/marketplace"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition"
              >
                Explore Marketplace
              </Link>

              <Link
                href="/list-space"
                className="px-6 py-3 border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition"
              >
                List Your Space
              </Link>

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center">

            {/* RING */}
            <div className="absolute w-[450px] h-[450px] rounded-full border border-blue-500/20" />

            <div className="absolute w-[350px] h-[350px] rounded-full bg-blue-500/20 blur-3xl" />

            {/* LOGO */}
            <div className="relative animate-pulse">
              <Image
                src="/logo.png"
                alt="Adsphere"
                width={220}
                height={220}
                priority
              />
            </div>

            {/* FLOATING CARDS */}
            <div className="absolute top-10 -left-10 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur">
              <p className="text-xs text-white/50">Creators</p>
              <p className="font-semibold">12K+</p>
            </div>

            <div className="absolute bottom-10 -right-10 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur">
              <p className="text-xs text-white/50">Ad Spaces</p>
              <p className="font-semibold">3.4K+</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}