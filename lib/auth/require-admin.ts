import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = createServerSupabase();

  // 1. Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 2. Get role from DB (secure source of truth)
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // 3. Fail-safe protection
  if (error || !profile || profile.role !== "admin") {
    redirect("/unauthorized");
  }

  // 4. Return useful context (optional but powerful)
  return {
    user,
    role: profile.role,
  };
}






