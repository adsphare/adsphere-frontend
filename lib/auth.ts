import { supabase } from "./supabase";

export async function getUser() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Auth error:", error.message);
      return {
        user: null,
        error,
      };
    }

    return {
      user: data.user,
      error: null,
    };
  } catch (err: any) {
    console.error("Unexpected auth error:", err);

    return {
      user: null,
      error: err,
    };
  }
}