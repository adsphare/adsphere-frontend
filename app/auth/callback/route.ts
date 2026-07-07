import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    // 🔥 SAFE FIX (NO server.ts CHANGE)
    const supabase = await Promise.resolve(
      createServerSupabase()
    );

    if (code) {
      const { error } =
        await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        return NextResponse.redirect(
          new URL("/auth/login?error=auth_failed", req.url)
        );
      }
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(
        new URL("/auth/login", req.url)
      );
    }

    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  } catch (err: any) {
    console.error("Auth callback crash:", err.message);

    return NextResponse.redirect(
      new URL("/auth/login", req.url)
    );
  }
}

