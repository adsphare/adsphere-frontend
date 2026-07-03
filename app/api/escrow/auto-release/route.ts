import { NextResponse } from "next/server";
import { releaseEscrow } from "@/lib/domain/escrow/escrow.service";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: replace with real admin role check
  const isAdmin = user.email?.includes("admin");

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { escrowId } = body;

  if (!escrowId) {
    return NextResponse.json({ error: "Missing escrowId" }, { status: 400 });
  }

  await releaseEscrow(escrowId);

  return NextResponse.json({
    success: true,
    message: "Escrow released",
  });
}




