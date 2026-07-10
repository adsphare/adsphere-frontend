import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {

  const supabase = await createServerSupabase();

  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();


  console.log("TEST AUTH USER:", user?.id);


  return NextResponse.json({
    user: user?.id ?? null
  });
}
