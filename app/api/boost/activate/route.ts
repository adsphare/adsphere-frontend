import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    const { boostId } = await req.json();

    if (!boostId) {
      return NextResponse.json(
        { error: "Missing boostId" },
        { status: 400 }
      );
    }

    // ⏳ 7-day boost expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data, error } = await supabase
      .from("boosts")
      .update({
        status: "active",
        expires_at: expiresAt.toISOString(),
      })
      .eq("id", boostId)
      .select()
      .single();

    if (error) {
      console.error("Boost activation error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ boost: data });
  } catch (err: any) {
    console.error("Boost activation crash:", err);

    return NextResponse.json(
      {
        error: err.message || "Server error",
      },
      { status: 500 }
    );
  }
}






