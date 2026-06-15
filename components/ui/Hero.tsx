"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#050816] overflow-hidden">

      {/* =========================
         BACKGROUND FIELD (SUBTLE)
      ========================= */}
      <div className="absolute inset-0">
        <div className="absolute top-[-250px] left-[-250px] w-[700px] h-[700px] bg-blue-600/15 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-250px] right-[-250px] w-[700px] h-[700px] bg-blue-500/10 blur-[200px] rounded-full" />
      </div>

      {/* =========================
         CONTENT GRID
      ========================= */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 grid md:grid-cols-2 gap-20 items-center">

        {/* =========================
           LEFT — SYSTEM MESSAGE
        ========================= */}
        <div className="space-y-6">

          {/* SYSTEM LABEL */}
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs tracking-wide">
            ADSPHERE VISIBILITY NETWORK
          </div>

          {/* MAIN HEADLINE */}
          <h1 className="text-5xl md:text-6xl font-semibold text-white leading-tight tracking-tight">
            Turn Attention Into
            <span className="text-blue-400"> Infrastructure</span>
          </h1>

          {/* DESCRIPTION */}
          <p className="text-white/60 text-lg leading-relaxed max-w-xl">
            A unified marketplace for billboards, creators, and digital screens —
            where visibility is measured, ranked, and traded like a real asset class.
          </p>

          {/* CTA ROW */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">

            <Link
              href="/marketplace"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition text-center"
            >
              Explore Marketplace
            </Link>

            <Link
              href="/list-space"
              className="px-6 py-3 border border-white/15 text-white/70 hover:text-white hover:border-white/30 rounded-xl transition text-center"
            >
              List Your Space
            </Link>

          </div>

          {/* MICRO SIGNAL */}
          <p className="text-white/30 text-sm pt-2">
            Built for advertisers • creators • physical inventory owners
          </p>

        </div>

        {/* =========================
           RIGHT — SYSTEM CORE VISUAL
        ========================= */}
        <div className="relative flex items-center justify-center">

          {/* ENERGY RINGS */}
          <div className="absolute w-[500px] h-[500px] rounded-full border border-blue-500/10" />
          <div className="absolute w-[350px] h-[350px] rounded-full border border-blue-400/10" />

          {/* CORE GLOW */}
          <div className="absolute w-[220px] h-[220px] bg-blue-500/20 blur-3xl rounded-full" />

          {/* CORE IDENTITY */}
          <div className="relative text-center">

            <div className="text-white text-4xl font-semibold tracking-[0.4em]">
              ADSPHERE
            </div>

            <div className="text-blue-400 text-xs tracking-[0.5em] mt-3 opacity-80">
              VISIBILITY OS
            </div>

            <div className="mt-6 text-white/30 text-xs">
              Real-world attention layer
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}