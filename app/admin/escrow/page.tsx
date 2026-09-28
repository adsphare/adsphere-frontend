"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type EscrowOrder = {
  id: string;
  listing_id: string | null;
  buyer_id: string;
  seller_id: string;
  amount: number;
  currency: string;
  status:
    | "pending"
    | "funded"
    | "delivered"
    | "disputed"
    | "released"
    | "refunded";
  auto_release_at?: string | null;
  created_at: string;
};

const supabase = createBrowserSupabase();

export default function AdminEscrowPage() {
  const [deals, setDeals] = useState<EscrowOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDeals = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("escrow_orders")
      .select(
        "id, listing_id, buyer_id, seller_id, amount, currency, status, auto_release_at, created_at",
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Escrow load error:", error.message);
      setDeals([]);
    } else {
      setDeals((data as EscrowOrder[]) || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadDeals();
  }, [loadDeals]);

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
        <h1 className="text-3xl font-bold">
          Escrow Admin Panel
        </h1>

        <p className="text-white/50 mt-1">
          Read-only view of canonical escrow orders
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-blue-400/20 bg-blue-500/5 p-4 text-sm text-white/70">
        Escrow financial state cannot be changed from the browser.
        Release, refund, dispute, and automatic settlement must use
        the canonical authorized settlement flow.
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-white/10">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Buyer</th>
              <th className="p-3 text-left">Seller</th>
              <th className="p-3 text-left">Created</th>
            </tr>
          </thead>

          <tbody>
            {deals.map((deal) => (
              <tr
                key={deal.id}
                className="border-t border-white/10"
              >
                <td className="p-3 text-xs">
                  {deal.id.slice(0, 8)}...
                </td>

                <td className="p-3">
                  {deal.amount} {deal.currency}
                </td>

                <td className="p-3">
                  <Status status={deal.status} />
                </td>

                <td className="p-3 text-xs">
                  {deal.buyer_id.slice(0, 8)}...
                </td>

                <td className="p-3 text-xs">
                  {deal.seller_id.slice(0, 8)}...
                </td>

                <td className="p-3 text-xs text-white/60">
                  {new Date(deal.created_at).toLocaleString()}
                </td>
              </tr>
            ))}

            {deals.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-white/40"
                >
                  No escrow orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Status({
  status,
}: {
  status: EscrowOrder["status"];
}) {
  const map: Record<EscrowOrder["status"], string> = {
    pending: "bg-gray-500",
    funded: "bg-blue-500",
    delivered: "bg-indigo-500",
    disputed: "bg-purple-500",
    released: "bg-blue-600",
    refunded: "bg-slate-600",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded ${map[status]}`}
    >
      {status}
    </span>
  );
}