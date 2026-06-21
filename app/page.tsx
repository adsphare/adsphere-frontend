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
     SCROLL → DEPTH ENGINE
  ========================= */
  const { scrollY } = useScroll();

  const depth1 = useTransform(scrollY, [0, 800], [0, -120]);   // closest layer
  const depth2 = useTransform(scrollY, [0, 800], [0, -60]);    // mid layer
  const depth3 = useTransform(scrollY, [0, 800], [0, 80]);     // background push

  const smoothDepth1 = useSpring(depth1, { stiffness: 80, damping: 20 });
  const smoothDepth2 = useSpring(depth2, { stiffness: 80, damping: 20 });
  const smoothDepth3 = useSpring(depth3, { stiffness: 60, damping: 25 });

  /* =========================
     MOUSE LIGHT FIELD
  ========================= */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#050816] text-white overflow-hidden">

      {/* =========================
         IMMERSIVE LIGHT FIELD
      ========================= */}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[900px] h-[900px] bg-blue-500/20 blur-[160px] rounded-full"
      />

      {/* =========================
         BACKGROUND DEPTH LAYERS
      ========================= */}
      <motion.div style={{ y: smoothDepth3 }} className="absolute inset-0 pointer-events-none">

        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-600/20 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-300px] right-[-200px] w-[800px] h-[800px] bg-purple-600/10 blur-[180px] rounded-full" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_65%)]" />
      </motion.div>

      {/* =========================
         HERO (CLOSEST LAYER)
      ========================= */}
      <motion.section style={{ y: smoothDepth1 }} className="relative z-10 pt-10">

        <Hero />

        <div className="max-w-6xl mx-auto px-6 mt-10">

          <motion.div
            whileHover={{ scale: 1.03, rotateX: 2 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="relative h-[560px] rounded-[36px] overflow-hidden border border-white/10"
            style={{ perspective: 1200 }}
          >
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl" />

            <Image
              src="/showcase/hero.jpg"
              alt="Hero"
              fill
              className="object-cover scale-[1.1]"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* =========================
         FLOATING TRUST TEXT (MID DEPTH)
      ========================= */}
      <motion.section style={{ y: smoothDepth2 }} className="relative z-10 text-center py-12">

        <p className="tracking-[0.35em] text-white/40 text-xs">
          VISIBILITY NETWORK • REAL WORLD ADS • AI RANKING ENGINE
        </p>

      </motion.section>

      {/* =========================
         METRICS (FLOATING IN SPACE)
      ========================= */}
      <motion.section style={{ y: smoothDepth2 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-6">

        {[
          ["1K+", "Listings"],
          ["300+", "Advertisers"],
          ["50+", "Cities"],
          ["24/7", "Uptime"],
        ].map((i, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05, y: -8 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl"
          >
            <h2 className="text-2xl font-bold text-blue-400">{i[0]}</h2>
            <p className="text-white/40 text-sm mt-1">{i[1]}</p>
          </motion.div>
        ))}

      </motion.section>

      {/* =========================
         MARKETPLACE (SPATIAL OBJECT)
      ========================= */}
      <motion.section style={{ y: smoothDepth2 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-14 items-center">

        <div>
          <h2 className="text-4xl font-semibold">
            Spatial <span className="text-blue-400">Marketplace</span>
          </h2>

          <p className="text-white/40 mt-4">
            Listings behave like objects in a 3D visibility field.
          </p>

          <Link
            href="/marketplace"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 rounded-xl"
          >
            Enter Space
          </Link>
        </div>

        <motion.div
          whileHover={{ rotateY: 6, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="relative h-[380px] rounded-[32px] overflow-hidden border border-white/10"
          style={{ perspective: 1200 }}
        >
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl" />

          <Image
            src="/showcase/marketplace.jpg"
            alt="Marketplace"
            fill
            className="object-cover scale-[1.08]"
          />
        </motion.div>

      </motion.section>

      {/* =========================
         DASHBOARD (CONTROL PANEL)
      ========================= */}
      <motion.section style={{ y: smoothDepth2 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-14 items-center">

        <motion.div
          whileHover={{ rotateY: -6, scale: 1.05 }}
          className="relative h-[380px] rounded-[32px] overflow-hidden border border-white/10"
        >
          <div className="absolute inset-0 bg-purple-500/10 blur-3xl" />

          <Image
            src="/showcase/dashboard.jpg"
            alt="Dashboard"
            fill
            className="object-cover scale-[1.08]"
          />
        </motion.div>

        <div>
          <h2 className="text-4xl font-semibold">
            Control <span className="text-blue-400">Center</span>
          </h2>

          <p className="text-white/40 mt-4">
            Manage visibility, campaigns, and performance in real-time space.
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
         ABOUT (DEPTH BACKDROP)
      ========================= */}
      <motion.section style={{ y: smoothDepth3 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-28 text-center">

        <h2 className="text-4xl font-semibold">
          Built for the <span className="text-blue-400">Immersive Web</span>
        </h2>

        <p className="text-white/40 mt-4 max-w-2xl mx-auto">
          A new layer where attention, space, and data merge into one system.
        </p>

        <div className="relative mt-12 h-[460px] rounded-[36px] overflow-hidden border border-white/10">
          <Image
            src="/showcase/about.jpg"
            alt="About"
            fill
            className="object-cover"
          />
        </div>

      </motion.section>

      {/* =========================
         FINAL GRAVITY CTA
      ========================= */}
      <section className="relative z-10 text-center py-36">

        <h2 className="text-5xl font-semibold">
          Step Into the{" "}
          <span className="text-blue-400">Visibility Layer</span>
        </h2>

        <p className="text-white/40 mt-6 max-w-xl mx-auto">
          This is not a website. It’s a spatial system for attention.
        </p>

        <div className="mt-10 flex gap-4 justify-center">
          <Link href="/list-space" className="px-7 py-3 bg-white text-black rounded-xl">
            Start
          </Link>

          <Link href="/marketplace" className="px-7 py-3 border border-white/15 rounded-xl">
            Explore
          </Link>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-10 text-center text-white/30 text-sm border-t border-white/5">
        © {new Date().getFullYear()} Adsphere
      </footer>

    </main>
  );
}