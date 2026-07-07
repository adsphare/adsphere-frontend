"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

/* =========================
   TYPES
========================= */
type Dispute = {
  id: string;
  escrow_id: string;
  conversation_id: string;
  buyer_id: string;
  seller_id: string;
  reason: string;
  status: "open" | "under_review" | "resolved";
  created_at: string;
};

type Escrow = {
  id: string;
  amount: number;
  currency: string;
  status: string;
};

/* =========================
   PAGE
========================= */
export default function AdminDisputesPage() {
  const supabase = createBrowserSupabase();

  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEscrow, setSelectedEscrow] = useState<Escrow | null>(null);

  /* =========================
     LOAD DISPUTES
  ========================= */
  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("disputes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load disputes error:", error.message);
      setDisputes([]);
      setLoading(false);
      return;
    }

    setDisputes(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  /* =========================
     LOAD ESCROW DETAIL
  ========================= */
  async function loadEscrow(escrowId: string) {
    const { data, error } = await supabase
      .from("escrow_orders")
      .select("*")
      .eq("id", escrowId)
      .single();

    if (error) {
      console.error("Escrow load error:", error.message);
      setSelectedEscrow(null);
      return;
    }

    setSelectedEscrow(data || null);
  }

  /* =========================
     RESOLVE DISPUTE
  ========================= */
  async function resolveDispute(
    dispute: Dispute,
    action: "release" | "refund" | "review"
  ) {
    try {
      if (action === "release") {
        await supabase
          .from("escrow_orders")
          .update({
            status: "released",
            is_locked: false,
          })
          .eq("id", dispute.escrow_id);
      }

      if (action === "refund") {
        await supabase
          .from("escrow_orders")
          .update({
            status: "refunded",
            is_locked: false,
          })
          .eq("id", dispute.escrow_id);
      }

      await supabase
        .from("disputes")
        .update({
          status: action === "review" ? "under_review" : "resolved",
        })
        .eq("id", dispute.id);

      await load();
    } catch (err) {
      console.error("Resolution error:", err);
    }
  }

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading disputes...
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        ⚖️ Dispute Resolution Center
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* DISPUTES LIST */}
        <div className="space-y-3">
          {disputes.map((d) => (
            <div
              key={d.id}
              className="p-4 border border-white/10 bg-white/5 rounded-xl"
            >
              <p className="text-sm text-white/60">
                Dispute ID: {d.id.slice(0, 8)}
              </p>

              <p className="text-xs text-white/40 mt-1">
                Reason: {d.reason}
              </p>

              <p className="text-xs mt-1">
                Status:{" "}
                <span className="text-yellow-400">
                  {d.status.toUpperCase()}
                </span>
              </p>

              <div className="flex gap-2 mt-3 flex-wrap">
                <button
                  onClick={() => loadEscrow(d.escrow_id)}
                  className="px-2 py-1 text-xs bg-white/10 rounded"
                >
                  View Escrow
                </button>

                <button
                  onClick={() => resolveDispute(d, "release")}
                  className="px-2 py-1 text-xs bg-green-600 rounded"
                >
                  Release
                </button>

                <button
                  onClick={() => resolveDispute(d, "refund")}
                  className="px-2 py-1 text-xs bg-red-600 rounded"
                >
                  Refund
                </button>

                <button
                  onClick={() => resolveDispute(d, "review")}
                  className="px-2 py-1 text-xs bg-yellow-500 text-black rounded"
                >
                  Mark Review
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ESCROW INSPECTOR */}
        <div className="p-4 border border-white/10 bg-white/5 rounded-xl h-fit">

          <h2 className="font-bold mb-3">
            Escrow Inspector
          </h2>

          {!selectedEscrow ? (
            <p className="text-white/40 text-sm">
              Select a dispute to view escrow details
            </p>
          ) : (
            <div className="space-y-2 text-sm">

              <p>
                💰 Amount:{" "}
                <span className="text-green-400">
                  ${selectedEscrow.amount}
                </span>
              </p>

              <p>
                📊 Status:{" "}
                <span className="text-blue-400">
                  {selectedEscrow.status}
                </span>
              </p>

              <p>
                💱 Currency: {selectedEscrow.currency}
              </p>

              <div className="mt-4 p-3 bg-black/40 rounded">
                <p className="text-xs text-white/50">
                  Future upgrades:
                </p>
                <ul className="text-xs text-white/40 list-disc ml-4 mt-1">
                  <li>Chat timeline</li>
                  <li>Payment proof</li>
                  <li>Delivery evidence</li>
                  <li>File uploads</li>
                </ul>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

