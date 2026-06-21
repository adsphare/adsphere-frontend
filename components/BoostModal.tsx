"use client";

import { useEffect, useState } from "react";

type Plan = "basic" | "pro" | "premium";

type Props = {
  open: boolean;
  onClose: () => void;
  listingId: string;
};

export default function BoostModal({
  open,
  onClose,
  listingId,
}: Props) {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);

  useEffect(() => {
    if (!open) setLoadingPlan(null);
  }, [open]);

  if (!open) return null;

  async function pay(plan: Plan) {
    if (loadingPlan) return;

    setLoadingPlan(plan);

    try {
      const res = await fetch("/api/stripe/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, plan }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error("Stripe session failed");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
      setLoadingPlan(null);
    }
  }

  const plans = [
    {
      id: "basic",
      title: "Basic Boost",
      price: "$5",
      desc: "Increase visibility for a few days",
      features: ["Standard ranking boost", "Basic exposure"],
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "pro",
      title: "Pro Boost",
      price: "$10",
      desc: "Higher ranking + more reach",
      features: ["2x visibility", "Priority ranking"],
      color: "from-purple-500 to-purple-700",
      highlight: true,
    },
    {
      id: "premium",
      title: "Premium Boost",
      price: "$25",
      desc: "Maximum exposure & top placement",
      features: ["Top placement", "Highest visibility"],
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

      <div className="bg-[#0b1020] border border-white/10 rounded-2xl w-full max-w-3xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-xl font-bold">Boost Listing 🚀</h2>
            <p className="text-white/40 text-sm">
              Choose a plan to increase visibility
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/40 hover:text-white"
          >
            ✕
          </button>

        </div>

        {/* PLANS */}
        <div className="grid md:grid-cols-3 gap-4">

          {plans.map((plan) => {
            const isLoading = loadingPlan === plan.id;
            const disabled = loadingPlan !== null;

            return (
              <div
                key={plan.id}
                className={`
                  relative p-5 rounded-xl border transition
                  bg-white/5 hover:bg-white/10
                  border-white/10 hover:border-white/20
                  ${plan.highlight ? "ring-2 ring-purple-500/40" : ""}
                  ${disabled && !isLoading ? "opacity-40" : ""}
                `}
              >

                {/* BADGE */}
                {plan.highlight && (
                  <div className="absolute -top-2 right-3 text-xs bg-purple-500 px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}

                <h3 className="text-lg font-semibold">{plan.title}</h3>

                <p className="text-2xl font-bold mt-2">{plan.price}</p>

                <p className="text-white/40 text-sm mt-1">{plan.desc}</p>

                <ul className="mt-3 text-sm text-white/60 space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>

                <button
                  disabled={disabled}
                  onClick={() => pay(plan.id as Plan)}
                  className={`
                    mt-4 w-full py-2 rounded-lg font-medium text-black
                    bg-gradient-to-r ${plan.color}
                    hover:opacity-90 transition
                  `}
                >
                  {isLoading ? "Processing..." : "Select Plan"}
                </button>

              </div>
            );
          })}

        </div>

        {/* FOOTER */}
        <p className="text-center text-white/30 text-xs mt-6">
          Secure payment via Stripe • Instant activation after payment
        </p>

      </div>
    </div>
  );
}