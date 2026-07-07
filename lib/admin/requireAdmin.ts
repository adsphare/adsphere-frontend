import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

type Profile = {
  role: string;
};

export async function requireAdmin(supabase: SupabaseClient) {
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

  if (error || !profile) {
    console.error("Profile error:", error?.message);
    redirect("/");
  }

  if (profile.role !== "admin") {
    redirect("/");
  }

  return user;
}

