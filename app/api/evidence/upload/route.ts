import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { uploadEvidence } from "@/lib/evidence/uploadEvidence";

export const runtime = "nodejs";

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

    const formData = await req.formData();

    const file = formData.get("file");
    const disputeId = formData.get("disputeId");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file" },
        { status: 400 }
      );
    }

    if (typeof disputeId !== "string" || !disputeId) {
      return NextResponse.json(
        { error: "Missing dispute ID" },
        { status: 400 }
      );
    }

    /*
     * Never trust userId from the browser.
     * The authenticated Supabase user is the uploader.
     */
    const { data: dispute, error: disputeError } =
      await supabaseAdmin
        .from("disputes")
        .select(`
          id,
          buyer_id,
          seller_id
        `)
        .eq("id", disputeId)
        .maybeSingle();

    if (disputeError) {
      console.error(disputeError);

      return NextResponse.json(
        { error: "Failed to validate dispute" },
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
        { error: "You are not a participant in this dispute" },
        { status: 403 }
      );
    }

    const result = await uploadEvidence(
      file,
      disputeId,
      user.id
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Evidence upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Evidence upload failed",
      },
      { status: 500 }
    );
  }
}
