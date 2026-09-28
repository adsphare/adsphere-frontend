import { NextResponse } from "next/server";
import { resolveDispute } from "@/lib/dispute/resolveDispute";
import { createServerSupabase } from "@/lib/supabase/server";

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
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
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
      disputeId?: unknown;
      action?: unknown;
    };

    const disputeId =
      typeof payload.disputeId === "string"
        ? payload.disputeId.trim()
        : "";

    const action =
      typeof payload.action === "string"
        ? payload.action.trim().toLowerCase()
        : "";

    if (!disputeId) {
      return NextResponse.json(
        { error: "Missing dispute ID" },
        { status: 400 }
      );
    }

    if (action !== "release" && action !== "refund") {
      return NextResponse.json(
        { error: "Invalid dispute action" },
        { status: 400 }
      );
    }

    const result = await resolveDispute({
      disputeId,
      action,
      adminId: user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to resolve dispute";

    if (message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (message === "Forbidden") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    if (
      message === "Dispute not found" ||
      message === "Escrow not found"
    ) {
      return NextResponse.json(
        { error: message },
        { status: 404 }
      );
    }

    if (
      message === "Dispute already resolved" ||
      message === "Dispute was already resolved"
    ) {
      return NextResponse.json(
        { error: message },
        { status: 409 }
      );
    }

    console.error("Dispute resolution error:", error);

    return NextResponse.json(
      { error: "Failed to resolve dispute" },
      { status: 500 }
    );
  }
}