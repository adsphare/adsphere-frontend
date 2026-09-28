import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

type OpenDisputeResult = {
  success: boolean;
  already_open?: boolean;
  dispute_id?: string;
  escrow_id?: string;
  buyer_id?: string;
  seller_id?: string;
  status?: string;
  error?: string;
};

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const payload = body as {
      escrowId?: unknown;
      reason?: unknown;
    };

    const escrowId =
      typeof payload.escrowId === "string"
        ? payload.escrowId.trim()
        : "";

    const reason =
      payload.reason === undefined || payload.reason === null
        ? null
        : typeof payload.reason === "string"
          ? payload.reason.trim()
          : null;

    if (!escrowId) {
      return NextResponse.json(
        { error: "Missing escrow ID" },
        { status: 400 }
      );
    }

    if (
      payload.reason !== undefined &&
      payload.reason !== null &&
      typeof payload.reason !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid reason" },
        { status: 400 }
      );
    }

    if (reason && reason.length > 2000) {
      return NextResponse.json(
        { error: "Reason is too long" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc(
      "open_dispute",
      {
        p_escrow_id: escrowId,
        p_user_id: user.id,
        p_reason: reason,
      }
    );

    if (error) {
      console.error("Open dispute RPC failed:", error);

      return NextResponse.json(
        { error: "Failed to open dispute" },
        { status: 500 }
      );
    }

    const result = data as OpenDisputeResult | null;

    if (!result?.success) {
      switch (result?.error) {
        case "ESCROW_NOT_FOUND":
          return NextResponse.json(
            { error: "Escrow not found" },
            { status: 404 }
          );

        case "NOT_ESCROW_PARTICIPANT":
          return NextResponse.json(
            { error: "Forbidden" },
            { status: 403 }
          );

        case "ESCROW_ALREADY_SETTLED":
          return NextResponse.json(
            { error: "Escrow is already settled" },
            { status: 409 }
          );

        case "REASON_TOO_LONG":
          return NextResponse.json(
            { error: "Reason is too long" },
            { status: 400 }
          );

        case "DISPUTE_PARTICIPANT_MISMATCH":
          console.error(
            "Dispute participant integrity violation:",
            result
          );

          return NextResponse.json(
            { error: "Dispute integrity violation" },
            { status: 409 }
          );

        case "INVALID_REQUEST":
          return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
          );

        default:
          return NextResponse.json(
            { error: "Unable to open dispute" },
            { status: 409 }
          );
      }
    }

    return NextResponse.json(
      {
        success: true,
        alreadyOpen: result.already_open === true,
        disputeId: result.dispute_id,
        escrowId: result.escrow_id,
        status: result.status,
      },
      { status: result.already_open ? 200 : 201 }
    );
  } catch (error) {
    console.error("Dispute creation error:", error);

    return NextResponse.json(
      { error: "Failed to open dispute" },
      { status: 500 }
    );
  }
}
