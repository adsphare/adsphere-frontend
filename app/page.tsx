"use client";

import Hero from "@/components/ui/Hero";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useEffect } from "react";

export default function HomePage() {
  /* =========================
     SCROLL MAGNET ENGINE
  ========================= */
  const { scrollY } = useScroll();

  // stronger “pull into sections”
  const magnet1 = useTransform(scrollY, [0, 600], [0, -80]);
  const magnet2 = useTransform(scrollY, [0, 600], [0, -40]);
  const magnet3 = useTransform(scrollY, [0, 600], [0, 60]);

  const smooth1 = useSpring(magnet1, { stiffness: 70, damping: 20 });
  const smooth2 = useSpring(magnet2, { stiffness: 70, damping: 20 });
  const smooth3 = useSpring(magnet3, { stiffness: 60, damping: 25 });

  /* =========================
     MOUSE GRAVITY FIELD
  ========================= */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) * 0.03);
      mouseY.set((e.clientY - window.innerHeight / 2) * 0.03);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#050816] text-white overflow-hidden scroll-smooth">

      {/* =========================
         GLOW FIELD (MAGNET BACKDROP)
      ========================= */}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[900px] h-[900px] bg-blue-500/20 blur-[160px] rounded-full"
      />

      {/* =========================
         HERO (MAGNET ZONE 1)
      ========================= */}
      <motion.section
        style={{ y: smooth1 }}
        className="relative z-10 pt-16 text-center"
      >
        <Hero />

        <div className="mt-10 max-w-6xl mx-auto px-6">
          <div className="relative h-[560px] rounded-[36px] overflow-hidden border border-white/10">
            <Image
              src="/showcase/hero.jpg"
              alt="hero"
              fill
              className="object-cover scale-[1.1]"
            />
          </div>
        </div>
      </motion.section>

      {/* =========================
         TRUST STRIP (MAGNET ZONE 2)
      ========================= */}
      <motion.section
        style={{ y: smooth2 }}
        className="text-center py-12 text-white/40 tracking-[0.3em]"
      >
        VISIBILITY • AI RANKING • REAL WORLD ADS
      </motion.section>

      {/* =========================
         METRICS (FLOAT MAGNET CARDS)
      ========================= */}
      <motion.section
        style={{ y: smooth2 }}
        className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {[
          ["1K+", "Listings"],
          ["300+", "Advertisers"],
          ["50+", "Cities"],
          ["24/7", "Uptime"],
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.08, y: -10 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold text-blue-400">{item[0]}</h2>
            <p className="text-white/40 text-sm">{item[1]}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* =========================
         MARKETPLACE (MAGNET PULL)
      ========================= */}
      <motion.section
        style={{ y: smooth2 }}
        className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-14 items-center"
      >
        <div>
          <h2 className="text-4xl font-semibold">
            Spatial <span className="text-blue-400">Marketplace</span>
          </h2>

          <p className="text-white/40 mt-4">
            Listings behave like magnetic objects in attention space.
          </p>

          <Link
            href="/marketplace"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 rounded-xl"
          >
            Enter Space
          </Link>
        </div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 6 }}
          className="relative h-[380px] rounded-[32px] overflow-hidden border border-white/10"
        >
          <Image
            src="/showcase/marketplace.jpg"
            alt="marketplace"
            fill
            className="object-cover scale-[1.08]"
          />
        </motion.div>
      </motion.section>

      {/* =========================
         DASHBOARD
      ========================= */}
      <motion.section
        style={{ y: smooth2 }}
        className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-14 items-center"
      >
        <motion.div
          whileHover={{ scale: 1.05, rotateY: -6 }}
          className="relative h-[380px] rounded-[32px] overflow-hidden border border-white/10"
        >
          <Image
            src="/showcase/dashboard.jpg"
            alt="dashboard"
            fill
            className="object-cover scale-[1.08]"
          />
        </motion.div>

        <div>
          <h2 className="text-4xl font-semibold">
            Control <span className="text-blue-400">Center</span>
          </h2>

          <p className="text-white/40 mt-4">
            Manage campaigns inside a magnetic control system.
          </p>

          <Link
            href="/dashboard"
            className="inline-block mt-6 px-6 py-3 border border-white/15 rounded-xl"
          >
            Open Panel
          </Link>
        </div>
      </motion.section>

      {/* =========================
         ABOUT (FLOAT ZONE)
      ========================= */}
      <motion.section
        style={{ y: smooth3 }}
        className="text-center max-w-6xl mx-auto px-6 py-28"
      >
        <h2 className="text-4xl font-semibold">
          Built for the <span className="text-blue-400">Immersive Web</span>
        </h2>

        <p className="text-white/40 mt-4 max-w-xl mx-auto">
          Attention becomes a physical force in this system.
        </p>

        <div className="mt-12 relative h-[460px] rounded-[36px] overflow-hidden border border-white/10">
          <Image
            src="/showcase/about.jpg"
            alt="about"
            fill
            className="object-cover"
          />
        </div>
      </motion.section>

      {/* =========================
         CTA
      ========================= */}
      <section className="text-center py-32">
        <h2 className="text-5xl font-semibold">
          Enter the <span className="text-blue-400">Magnetic Layer</span>
        </h2>

        <p className="text-white/40 mt-6 max-w-xl mx-auto">
          This is a living attention system, not a website.
        </p>

        <div className="mt-10 flex gap-4 justify-center">
          <Link
            href="/list-space"
            className="px-7 py-3 bg-white text-black rounded-xl"
          >
            Start
          </Link>

          <Link
            href="/marketplace"
            className="px-7 py-3 border border-white/15 rounded-xl"
          >
            Explore
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-white/30 text-sm border-t border-white/5">
        © {new Date().getFullYear()} Adsphere
      </footer>
    </main>
  );
}