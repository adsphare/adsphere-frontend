import { createServerSupabase } from "@/lib/supabase/server";

type Action = "refund" | "release";
type ResolveDisputeResult = {
  success: boolean;
  dispute_id?: string;
  escrow_id?: string;
  action?: Action;
  settlement_required?: boolean;
  financial_state?: string;
  error?: string;
};

export async function resolveDispute({
  disputeId,
  action,
  adminId,
}: {
  disputeId: string;
  action: Action;
  adminId: string;
}) {
  if (!disputeId) {
    throw new Error("Missing dispute ID");
  }

  if (action !== "refund" && action !== "release") {
    throw new Error("Invalid dispute action");
  }

  if (!adminId) {
    throw new Error("Missing administrator identity");
  }

  const supabase = await createServerSupabase();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user.id !== adminId) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "admin"
  ) {
    throw new Error("Forbidden");
  }

  const { data, error } = await supabase.rpc(
    "resolve_dispute_decision",
    {
      p_dispute_id: disputeId,
      p_admin_id: user.id,
      p_action: action,
    }
  );

  if (error) {
    console.error(
      "Resolve dispute RPC failed:",
      error
    );

    throw new Error("Failed to resolve dispute");
  }

  const result =
    data as ResolveDisputeResult | null;

  if (!result?.success) {
    switch (result?.error) {
      case "FORBIDDEN":
        throw new Error("Forbidden");

      case "DISPUTE_NOT_FOUND":
        throw new Error("Dispute not found");

      case "ESCROW_NOT_FOUND":
        throw new Error("Escrow not found");

      case "DISPUTE_ALREADY_RESOLVED":
        throw new Error("Dispute already resolved");

      case "INVALID_ACTION":
        throw new Error("Invalid dispute action");

      case "DISPUTE_PARTICIPANT_MISMATCH":
        throw new Error(
          "Dispute participant integrity violation"
        );

      case "ESCROW_NOT_DISPUTED":
        throw new Error(
          "Escrow is not in the required disputed state"
        );

      case "ESCROW_NOT_LOCKED":
        throw new Error(
          "Escrow must remain locked during resolution"
        );

      default:
        throw new Error(
          "Unable to resolve dispute"
        );
    }
  }

  return {
    success: true,
    action,
    disputeId: result.dispute_id,
    escrowId: result.escrow_id,
    settlementRequired:
      result.settlement_required === true,
    financialState:
      result.financial_state ??
      "DISPUTED_LOCKED",
  };
}



