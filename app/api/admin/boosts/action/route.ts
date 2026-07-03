import { NextResponse } from "next/server";


import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export async function POST(req: Request) {
  try {
    await requireAdmin();

  const supabase = createServerSupabase();

    const body = await req.json();
    const { boostId, action } = body;

    if (!boostId || !action) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 🔥 ACTIVATE BOOST
    if (action === "activate") {
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);

      const { data, error } = await supabase
        .from("boosts")
        .update({
          status: "active",
          expires_at: expires.toISOString(),
        })
        .eq("id", boostId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ boost: data });
    }

    // ❌ EXPIRE BOOST
    if (action === "expire") {
      const { data, error } = await supabase
        .from("boosts")
        .update({
          status: "expired",
          expires_at: new Date().toISOString(),
        })
        .eq("id", boostId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ boost: data });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}





