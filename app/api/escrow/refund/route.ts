import { NextResponse } from "next/server";
import { refundEscrow } from "@/lib/domain/escrow/escrow.service";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = user.email?.includes("admin");

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { escrowId } = await req.json();

  if (!escrowId) {
    return NextResponse.json({ error: "Missing escrowId" }, { status: 400 });
  }

  await refundEscrow(escrowId);

  return NextResponse.json({
    success: true,
    message: "Escrow refunded",
  });
}





