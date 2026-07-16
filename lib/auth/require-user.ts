import { redirect } from "next/navigation";
import { createServerSupabase } from "./server";

export async function requireUser() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return {
    supabase,
    user,
  };
}

