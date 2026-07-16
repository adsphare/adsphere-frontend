import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createServerSupabase();

  const { escrowId, reason } = await req.json();

  const { data: escrow } = await supabase
    .from("escrow_orders")
    .select("*")
    .eq("id", escrowId)
    .single();

  if (!escrow) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: dispute } = await supabase
    .from("disputes")
    .insert({
      escrow_id: escrowId,
      reason,
      status: "open",
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  await supabase
    .from("escrow_orders")
    .update({
      status: "disputed",
      is_locked: true,
    })
    .eq("id", escrowId);

  return NextResponse.json(dispute);
}





