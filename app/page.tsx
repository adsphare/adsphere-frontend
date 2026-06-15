"use client";

import Hero from "@/components/ui/Hero";
import Link from "next/link";
import { motion } from "framer-motion";

/* =========================
   ANIMATIONS
========================= */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#050816] text-white overflow-hidden">

      {/* 🌌 GLOBAL BACKGROUND SYSTEM */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-140px] left-[-140px] w-[520px] h-[520px] bg-blue-600/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-[-160px] right-[-140px] w-[520px] h-[520px] bg-purple-600/10 blur-3xl rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_60%)]" />
      </div>

      {/* HERO */}
      <Hero />

      {/* TRUST BAR */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-6 border-y border-white/5 text-center relative z-10"
      >
        <p className="text-white/40 text-sm tracking-wide">
          Trusted by creators • advertisers • real-world inventory owners
        </p>
      </motion.section>

      {/* STATS */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={stagger}
        className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
      >
        {[
          { label: "Active Listings", value: "1K+" },
          { label: "Advertisers", value: "300+" },
          { label: "Cities", value: "50+" },
          { label: "Uptime", value: "24/7" },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="p-5 rounded-xl border border-white/5 bg-white/3 hover:bg-white/5 transition"
          >
            <h2 className="text-2xl font-bold text-blue-400">
              {item.value}
            </h2>
            <p className="text-white/40 text-sm">{item.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* VALUE PROPOSITIONS */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={stagger}
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6"
      >
        {[
          {
            title: "📍 Physical Ads",
            desc: "Monetize billboards, retail spaces, and real-world attention.",
          },
          {
            title: "📱 Creator Economy",
            desc: "Turn social influence into measurable revenue streams.",
          },
          {
            title: "🚀 Visibility Ranking",
            desc: "AI-powered ranking system boosts high-performing listings.",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl border border-white/5 bg-white/3 hover:bg-white/8 transition"
          >
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-white/40 text-sm">{card.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* MARKETPLACE PREVIEW CTA */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative z-10 py-24 text-center bg-gradient-to-b from-white/5 to-transparent border-y border-white/5"
      >
        <h2 className="text-3xl md:text-4xl font-semibold">
          Discover High-Impact{" "}
          <span className="text-blue-400">Ad Spaces</span>
        </h2>

        <p className="text-white/40 mt-4 max-w-2xl mx-auto">
          Real listings ranked by engagement, boost score, and visibility intelligence.
        </p>

        <Link
          href="/marketplace"
          className="inline-block mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition"
        >
          Explore Marketplace
        </Link>
      </motion.section>

      {/* FINAL CTA */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative z-10 text-center py-24 px-6"
      >
        <h2 className="text-3xl md:text-4xl font-semibold">
          Turn Attention Into{" "}
          <span className="text-blue-400">Revenue Infrastructure</span>
        </h2>

        <p className="text-white/40 mt-4 max-w-xl mx-auto">
          Adsphere connects creators, advertisers, and real-world spaces into one visibility network.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/list-space"
            className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:scale-105 transition"
          >
            Start Listing
          </Link>

          <Link
            href="/marketplace"
            className="px-6 py-3 border border-white/15 text-white/70 hover:text-white rounded-xl transition"
          >
            Browse Marketplace
          </Link>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="relative z-10 py-10 text-center text-white/30 text-sm border-t border-white/5">
        © {new Date().getFullYear()} Adsphere. Visibility Infrastructure Network.
      </footer>

    </main>
  );
}