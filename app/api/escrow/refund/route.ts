import { NextResponse } from "next/server";
import { refundEscrow } from "@/lib/domain/escrow/escrow.service";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();

    // 1. AUTHENTICATION
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. AUTHORIZATION
    // profiles.role is the canonical Adspheria admin source of truth.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      profileError ||
      !profile ||
      profile.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 3. REQUEST VALIDATION
    const body = await req.json();
    const { escrowId } = body;

    if (
      typeof escrowId !== "string" ||
      !escrowId.trim()
    ) {
      return NextResponse.json(
        { error: "Missing escrowId" },
        { status: 400 }
      );
    }

    // 4. CANONICAL ESCROW REFUND
    const result = await refundEscrow(escrowId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Escrow refund API error:", err);

    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
