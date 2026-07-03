import { NextResponse } from "next/server";
import { escrowEngine } from "@/lib/domain/escrow/escrowEngine";
import { createServerSupabase } from "@/lib/supabase/server";

/* =========================
   ESCROW ADMIN API (SECURE)
========================= */
export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    // 1. AUTH CHECK
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. ADMIN ROLE CHECK
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 3. REQUEST BODY
    const body = await req.json();

    const { action, escrowId } = body;

    if (!action || !escrowId) {
      return NextResponse.json(
        { error: "Missing action or escrowId" },
        { status: 400 }
      );
    }

    // 4. VALID ACTIONS (IMPORTANT SAFETY LAYER)
    const allowedActions = [
      "RELEASE",
      "REFUND",
      "DISPUTE",
      "LOCK",
      "FUND",
    ];

    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // 5. EXECUTE ESCROW ENGINE
    const result = await escrowEngine(action, escrowId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error("Escrow API error:", err);

    return NextResponse.json(
      {
        error: err.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}




