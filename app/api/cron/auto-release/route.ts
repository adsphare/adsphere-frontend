import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { escrowEngine } from "@/lib/domain/escrow/escrowEngine";

export const runtime = "nodejs";

/* runs every X minutes via cron (Vercel / server) */
export async function GET() {
  const supabase = createServerSupabase();

  const now = new Date().toISOString();

  const { data: escrows } = await supabase
    .from("escrow_orders")
    .select("id")
    .eq("status", "delivered")
    .lte("auto_release_at", now);

  for (const e of escrows || []) {
    await escrowEngine("AUTO_RELEASE", e.id);
  }

  return NextResponse.json({
    processed: escrows?.length || 0,
  });
}





