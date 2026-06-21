"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#050816]">

      {/* =========================
         BACKGROUND SYSTEM
      ========================= */}
      <div className="absolute inset-0">
        <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] bg-blue-600/20 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[700px] h-[700px] bg-blue-500/10 blur-[160px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_60%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 min-h-[90vh] flex items-center">

        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* =========================
             LEFT (FOCUSED MESSAGE LAYER)
          ========================= */}
          <div>

            <div className="inline-flex px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-sm mb-6">
              Visibility Infrastructure Network
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Monetize
              <span className="block text-blue-500">
                Attention
              </span>
              Everywhere
            </h1>

            <p className="mt-6 text-white/50 text-lg max-w-xl">
              Adsphere turns physical spaces, creators, and digital screens into a unified marketplace for advertising visibility.
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
                List Your Inventory
              </Link>

            </div>

            {/* MICRO TRUST LINE */}
            <p className="mt-6 text-xs text-white/30">
              No contracts • Real-time ranking • Performance-based visibility
            </p>

          </div>

          {/* =========================
             RIGHT (SYSTEM VISUAL CORE)
          ========================= */}
          <div className="relative flex justify-center">

            {/* ORBIT SYSTEM */}
            <div className="absolute w-[500px] h-[500px] rounded-full border border-blue-500/20 animate-pulse" />
            <div className="absolute w-[350px] h-[350px] rounded-full border border-white/5" />

            {/* CENTER CORE */}
            <div className="relative z-10 animate-pulse">
              <Image
                src="/logo.png"
                alt="Adsphere"
                width={220}
                height={220}
                priority
              />
            </div>

            {/* FLOATING METRICS (SOFTER, LESS DISTRACTION) */}
            <div className="absolute top-14 -left-10 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur">
              <p className="text-xs text-white/40">Creators</p>
              <p className="font-semibold text-blue-400">12K+</p>
            </div>

            <div className="absolute bottom-14 -right-10 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur">
              <p className="text-xs text-white/40">Ad Spaces</p>
              <p className="font-semibold text-blue-400">3.4K+</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}