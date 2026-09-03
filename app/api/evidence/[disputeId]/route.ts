import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getDisputeEvidence } from "@/lib/evidence/getEvidence";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    disputeId: string;
  }>;
};

export async function GET(
  _req: Request,
  context: RouteContext
) {
  try {
    const { disputeId } = await context.params;

    if (!disputeId) {
      return NextResponse.json(
        { error: "Missing dispute ID" },
        { status: 400 }
      );
    }

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

    const { data: dispute, error: disputeError } =
      await supabaseAdmin
        .from("disputes")
        .select(`
          id,
          escrow_id,
          buyer_id,
          seller_id
        `)
        .eq("id", disputeId)
        .maybeSingle();

    if (disputeError) {
      console.error("Dispute lookup failed:", disputeError);

      return NextResponse.json(
        { error: "Failed to load dispute" },
        { status: 500 }
      );
    }

    if (!dispute) {
      return NextResponse.json(
        { error: "Dispute not found" },
        { status: 404 }
      );
    }

    const isParticipant =
      dispute.buyer_id === user.id ||
      dispute.seller_id === user.id;

    if (!isParticipant) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const evidence = await getDisputeEvidence(disputeId);

    return NextResponse.json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    console.error("Evidence read error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load evidence",
      },
      { status: 500 }
    );
  }
}
