"use client";

import { useState } from "react";
import BoostModal from "@/components/BoostModal";

type Props = {
  listingId: string;
};

<<<<<<< HEAD
export default function BoostButton({ listingId }: Props) {
  const [open, setOpen] = useState(false);
=======
  if (!open) return null;

  async function pay(plan: "basic" | "premium") {
    if (!provider) return;

    setLoading(true);

    try {
      let url = "";

      if (provider === "stripe") {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId, userId, plan }),
        });

        const data = await res.json();
        url = data.url;
      }

      if (provider === "chapa") {
        const res = await fetch("/api/chapa/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId, userId, plan }),
        });

        const data = await res.json();
        url = data.checkout_url;
      }

      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  }
>>>>>>> 6c58162 (refactor: move globals.css to app, add 3D scene system, stabilize layout architecture)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
      >
        🚀 Boost
      </button>

<<<<<<< HEAD
      <BoostModal
        open={open}
        onClose={() => setOpen(false)}
        listingId={listingId}
      />
    </>
=======
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Boost Listing 🚀</h2>
          <button onClick={onClose} className="text-white/40">✕</button>
        </div>

        {step === "provider" && (
          <div className="space-y-3">
            <p className="text-white/50 text-sm">Choose payment method</p>

            <button
              onClick={() => {
                setProvider("stripe");
                setStep("plan");
              }}
              className="w-full bg-yellow-500 text-black py-2 rounded"
            >
              Pay with Stripe
            </button>

            <button
              onClick={() => {
                setProvider("chapa");
                setStep("plan");
              }}
              className="w-full bg-green-500 text-black py-2 rounded"
            >
              Pay with Chapa
            </button>
          </div>
        )}

        {step === "plan" && (
          <div className="space-y-3">
            <p className="text-white/50 text-sm">
              Selected: {provider?.toUpperCase()}
            </p>

            <button
              disabled={loading}
              onClick={() => pay("basic")}
              className="w-full bg-blue-500 text-black py-2 rounded"
            >
              Basic Boost
            </button>

            <button
              disabled={loading}
              onClick={() => pay("premium")}
              className="w-full bg-orange-500 text-black py-2 rounded"
            >
              Premium Boost
            </button>

            <button
              onClick={() => setStep("provider")}
              className="w-full text-white/50 text-sm"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
>>>>>>> 6c58162 (refactor: move globals.css to app, add 3D scene system, stabilize layout architecture)
  );
}