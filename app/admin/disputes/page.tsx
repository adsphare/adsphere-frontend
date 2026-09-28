
"use client";

import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { createBrowserSupabase } from "@/lib/supabase/browser";

/* =========================
   TYPES
========================= */

type Dispute = {
  id: string;
  escrow_id: string;
  conversation_id?: string | null;
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
  const supabase = useMemo(
    () => createBrowserSupabase(),
    []
  );

  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEscrow, setSelectedEscrow] =
    useState<Escrow | null>(null);

  /* =========================
     LOAD DISPUTES
  ========================= */

  const load = useCallback(async () => {
    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("disputes")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Load disputes error:",
        error.message
      );

      setDisputes([]);
      setLoading(false);
      return;
    }

    setDisputes(
      (data as Dispute[]) || []
    );

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  /* =========================
     LOAD ESCROW
  ========================= */

  const loadEscrow = useCallback(
    async (escrowId: string) => {
      try {
        const {
          data,
          error,
        } = await supabase
          .from("escrow_orders")
          .select("*")
          .eq("id", escrowId)
          .single();

        if (error) {
          console.error(
            "Escrow load error:",
            error.message
          );

          setSelectedEscrow(null);
          return;
        }

        setSelectedEscrow(
          data as Escrow
        );
      } catch (err) {
        console.error(
          "Unexpected escrow error:",
          err
        );

        setSelectedEscrow(null);
      }
    },
    [supabase]
  );

  /* =========================
     RESOLVE DISPUTE
     
     IMPORTANT:
     No direct UPDATE against:
       - escrow_orders
       - disputes
     
     Authorization is enforced by:
       resolve_dispute_decision()
     
     The authenticated user's ID is passed
     to the RPC. The RPC itself verifies:
       p_admin_id = auth.uid()
       profile.role = admin
     
     Release/refund are recorded as
     settlement-required decisions.
  ========================= */

  const resolveDispute = useCallback(
    async (
      dispute: Dispute,
      action: "release" | "refund"
    ) => {
      try {
        const authResult =
          await supabase.auth.getUser();

        const user = authResult.data.user;
        const authError = authResult.error;

        if (authError || !user) {
          console.error(
            "Admin authentication error:",
            authError?.message ||
              "UNAUTHENTICATED"
          );

          return;
        }

        const rpcResult =
          await supabase.rpc(
            "resolve_dispute_decision",
            {
              p_dispute_id: dispute.id,
              p_admin_id: user.id,
              p_action: action,
            }
          );

        const data = rpcResult.data;
        const error = rpcResult.error;

        if (error) {
          console.error(
            "Dispute resolution error:",
            error.message
          );

          return;
        }

        if (!data || data.success !== true) {
          console.error(
            "Dispute resolution rejected:",
            data?.error ||
              "UNKNOWN_ERROR"
          );

          return;
        }

        console.log(
          "Dispute decision recorded:",
          data
        );

        await load();
      } catch (err) {
        console.error(
          "Unexpected dispute resolution error:",
          err
        );
      }
    },
    [supabase, load]
  );

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-[#050816]
          text-white
        "
      >
        Loading disputes...
      </div>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div
      className="
        min-h-screen
        bg-[#050816]
        text-white
        p-6
      "
    >
      <h1
        className="
          text-3xl
          font-bold
          mb-6
        "
      >
        ⚖️ Dispute Resolution Center
      </h1>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        "
      >
        <div
          className="
            space-y-3
          "
        >
          {disputes.map((dispute) => (
            <div
              key={dispute.id}
              className="
                p-4
                border
                border-white/10
                bg-white/5
                rounded-xl
              "
            >
              <p
                className="
                  text-sm
                  text-white/60
                "
              >
                Dispute ID:
                {" "}
                {dispute.id.slice(0, 8)}
              </p>

              <p
                className="
                  text-xs
                  text-white/40
                  mt-1
                "
              >
                Reason:
                {" "}
                {dispute.reason}
              </p>

              <p
                className="
                  text-xs
                  mt-1
                "
              >
                Status:
                {" "}
                <span
                  className="
                    text-yellow-400
                  "
                >
                  {dispute.status.toUpperCase()}
                </span>
              </p>

              <div
                className="
                  flex
                  gap-2
                  mt-3
                  flex-wrap
                "
              >
                <button
                  onClick={() =>
                    loadEscrow(
                      dispute.escrow_id
                    )
                  }
                  className="
                    px-2
                    py-1
                    text-xs
                    bg-white/10
                    rounded
                  "
                >
                  View Escrow
                </button>

                <button
                  onClick={() =>
                    resolveDispute(
                      dispute,
                      "release"
                    )
                  }
                  className="
                    px-2
                    py-1
                    text-xs
                    bg-green-600
                    rounded
                  "
                >
                  Release
                </button>

                <button
                  onClick={() =>
                    resolveDispute(
                      dispute,
                      "refund"
                    )
                  }
                  className="
                    px-2
                    py-1
                    text-xs
                    bg-red-600
                    rounded
                  "
                >
                  Refund
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          className="
            p-4
            border
            border-white/10
            bg-white/5
            rounded-xl
            h-fit
          "
        >
          <h2
            className="
              font-bold
              mb-3
            "
          >
            Escrow Inspector
          </h2>

          {!selectedEscrow ? (
            <p
              className="
                text-white/40
                text-sm
              "
            >
              Select a dispute to view escrow details
            </p>
          ) : (
            <div
              className="
                space-y-2
                text-sm
              "
            >
              <p>
                💰 Amount:
                {" "}
                <span
                  className="
                    text-green-400
                  "
                >
                  {selectedEscrow.amount}
                  {" "}
                  {selectedEscrow.currency}
                </span>
              </p>

              <p>
                📊 Status:
                {" "}
                <span
                  className="
                    text-blue-400
                  "
                >
                  {selectedEscrow.status}
                </span>
              </p>

              <p>
                💱 Currency:
                {" "}
                {selectedEscrow.currency}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

