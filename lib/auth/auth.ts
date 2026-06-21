import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      error: error ?? new Error("No user found"),
    };
  }

  return {
    user,
    error: null,
  };
}