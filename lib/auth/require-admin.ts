import "server-only";

import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    error ||
    !profile ||
    profile.role !== "admin"
  ) {
    redirect("/unauthorized");
  }

  return {
    user,
    role: profile.role,
  };
}