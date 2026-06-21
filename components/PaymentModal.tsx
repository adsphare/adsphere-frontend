"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Plan = "basic" | "premium";
type Provider = "stripe" | "chapa";

export default function PaymentModal({
  open,
  onClose,
  listingId,
  userId,
}: {
  open: boolean;
  onClose: () => void;
  listingId: string;
  userId: string;
}) {
  const [plan, setPlan] = useState<Plan>("basic");
  const [provider, setProvider] = useState<Provider>("stripe");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handlePayment() {
    setLoading(true);

    try {
      let url = "";

      // ================= STRIPE =================
      if (provider === "stripe") {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId, userId, plan }),
        });

        const data = await res.json();
        url = data?.url;
      }

      // ================= CHAPA =================
      if (provider === "chapa") {
        const res = await fetch("/api/chapa/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId, userId, plan }),
        });

        const data = await res.json();

        url =
          data?.checkout_url ||
          data?.data?.checkout_url ||
          data?.data?.checkoutUrl;
      }

      if (!url) throw new Error("No payment URL returned");

      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[420px] bg-[#0b1020] border border-white/10 p-6 rounded-2xl"
      >
        {/* HEADER */}
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Boost Listing</h2>
          <button onClick={onClose} className="text-white/40">
            ✕
          </button>
        </div>

        {/* PLAN */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => setPlan("basic")}
            className={`p-3 rounded-xl border ${
              plan === "basic"
                ? "border-blue-500 bg-blue-500/10"
                : "border-white/10"
            }`}
          >
            Basic (7 days)
          </button>

          <button
            onClick={() => setPlan("premium")}
            className={`p-3 rounded-xl border ${
              plan === "premium"
                ? "border-purple-500 bg-purple-500/10"
                : "border-white/10"
            }`}
          >
            Premium (x2 reach)
          </button>
        </div>

        {/* PROVIDER */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => setProvider("stripe")}
            className={`p-3 rounded-xl border ${
              provider === "stripe"
                ? "border-blue-500 bg-blue-500/10"
                : "border-white/10"
            }`}
          >
            Stripe
          </button>

          <button
            onClick={() => setProvider("chapa")}
            className={`p-3 rounded-xl border ${
              provider === "chapa"
                ? "border-green-500 bg-green-500/10"
                : "border-white/10"
            }`}
          >
            Chapa
          </button>
        </div>

        {/* ACTION */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl"
        >
          {loading ? "Processing..." : "Continue Payment"}
        </button>
      </motion.div>
    </div>
  );
}