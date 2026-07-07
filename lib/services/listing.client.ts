import { createBrowserSupabase } from "@/lib/supabase/browser";
const supabase = createBrowserSupabase();

;

export const listingService = {
  async getAll() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active");

    if (error) throw error;
    return data ?? [];
  },
};




