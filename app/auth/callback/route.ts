import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/profile/ensureProfile";

export const runtime = "nodejs";


export async function GET(req: Request) {

  console.log("CALLBACK START");


  const url = new URL(req.url);

  const code = url.searchParams.get("code");


  console.log(
    "CODE:",
    !!code
  );


  // Supabase returned an error instead of code
  const authError = url.searchParams.get("error");

  if (authError) {

    console.log(
      "AUTH ERROR:",
      authError
    );

    return NextResponse.redirect(
      new URL(
        `/auth/login?error=${authError}`,
        req.url
      )
    );
  }



  if (!code) {

    return NextResponse.redirect(
      new URL(
        "/auth/login?error=no_code",
        req.url
      )
    );

  }



  const supabase =
    await createServerSupabase();



  // Exchange magic link code
  const {
    error: exchangeError
  } =
    await supabase.auth.exchangeCodeForSession(
      code
    );



  console.log(
    "EXCHANGE:",
    exchangeError?.message ?? "success"
  );



  if (exchangeError) {

    return NextResponse.redirect(
      new URL(
        "/auth/login?error=session",
        req.url
      )
    );

  }



  // Get logged in user
  const {
    data: {
      user
    }
  } =
    await supabase.auth.getUser();



  console.log(
    "CALLBACK USER:",
    user?.id
  );



  if (!user) {

    return NextResponse.redirect(
      new URL(
        "/auth/login?error=no_user",
        req.url
      )
    );

  }



  // Create or find profile
  const profileResult =
    await ensureProfile(user);



  console.log(
    "PROFILE EXISTS:",
    profileResult.exists
  );



  // Existing user
  if (profileResult.exists) {

    return NextResponse.redirect(
      new URL(
        "/dashboard",
        req.url
      )
    );

  }



  // New user
  return NextResponse.redirect(
    new URL(
      "/onboarding",
      req.url
    )
  );

}
