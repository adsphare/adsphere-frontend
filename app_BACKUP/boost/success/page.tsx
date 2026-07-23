"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/dashboard");
    }, 2500);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#050816]
        text-white
        px-6
      "
    >
      <div
        className="
          text-center
          p-8
          rounded-2xl
          bg-white/5
          border
          border-white/10
        "
      >
        <div className="text-5xl mb-4">
          🚀
        </div>

        <h1 className="text-3xl font-bold">
          Boost Payment Successful
        </h1>

        <p className="mt-3 text-white/60">
          Your Adspheria visibility boost payment was received.
        </p>

        <p className="mt-2 text-white/40 text-sm">
          Verifying payment and activating your boost...
        </p>
      </div>
    </main>
  );
}