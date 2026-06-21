import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const now = new Date().toISOString();

  // 🔥 EXPIRE BOOSTS (NEW SYSTEM)
  const { data, error } = await supabase
    .from("boosts")
    .update({ status: "expired" })
    .eq("status", "active")
    .lt("expires_at", now)
    .select("id");

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    expiredCount: data?.length || 0,
  });
}