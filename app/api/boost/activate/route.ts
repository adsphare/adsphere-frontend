import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { boostId } = await req.json();

  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  const { data, error } = await supabase
    .from("boosts")
    .update({
      status: "active",
      expires_at: expires,
    })
    .eq("id", boostId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ boost: data });
}