import { NextResponse } from "next/server";
import { resolveDispute } from "@/lib/dispute/resolveDispute";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    // 1. Auth check
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. OPTIONAL: admin check (important)
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

    // 3. Request body
    const body = await req.json();

    const { disputeId, action } = body;

    // 4. Resolve dispute
    const result = await resolveDispute({
      disputeId,
      action,
      adminId: user.id,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}




