"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

/* =========================
   TYPES
========================= */
type EscrowOrder = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  currency: string;
  status: "pending" | "funded" | "released" | "refunded" | "disputed";
  auto_release_at?: string | null;
  created_at: string;
};

/* =========================
   PAGE
========================= */
export default function AdminEscrowPage() {
  // ✅ Create browser Supabase client
  const supabase = createBrowserSupabase();

  const [deals, setDeals] = useState<EscrowOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadDeals();
  }, []);

  async function loadDeals() {
    setLoading(true);

    const { data, error } = await supabase
      .from("escrow_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Escrow load error:", error.message);
      setDeals([]);
    } else {
      setDeals((data as EscrowOrder[]) || []);
    }

    setLoading(false);
  }

  async function updateStatus(
    id: string,
    status: EscrowOrder["status"]
  ) {
    const { error } = await supabase
      .from("escrow_orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error(error.message);
      return;
    }

    await loadDeals();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading Escrow Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">🛡 Escrow Admin Panel</h1>
        <p className="text-white/50 mt-1">
          Manage all escrow transactions
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-white/10">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Buyer</th>
              <th className="p-3">Seller</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id} className="border-t border-white/10">
                <td className="p-3 text-xs">
                  {deal.id.slice(0, 6)}...
                </td>

                <td className="p-3">
                  {deal.amount} {deal.currency}
                </td>

                <td className="p-3">
                  <Status status={deal.status} />
                </td>

                <td className="p-3 text-xs">
                  {deal.buyer_id.slice(0, 6)}...
                </td>

                <td className="p-3 text-xs">
                  {deal.seller_id.slice(0, 6)}...
                </td>

                <td className="p-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => updateStatus(deal.id, "released")}
                    className="px-2 py-1 text-xs bg-green-600 rounded"
                  >
                    Release
                  </button>

                  <button
                    onClick={() => updateStatus(deal.id, "disputed")}
                    className="px-2 py-1 text-xs bg-yellow-500 text-black rounded"
                  >
                    Dispute
                  </button>

                  <button
                    onClick={() => updateStatus(deal.id, "refunded")}
                    className="px-2 py-1 text-xs bg-red-600 rounded"
                  >
                    Refund
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================
   STATUS UI
========================= */
function Status({ status }: { status: EscrowOrder["status"] }) {
  const map: Record<EscrowOrder["status"], string> = {
    pending: "bg-gray-500",
    funded: "bg-blue-500",
    released: "bg-green-500",
    refunded: "bg-red-500",
    disputed: "bg-purple-500",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${map[status]}`}>
      {status}
    </span>
  );
}