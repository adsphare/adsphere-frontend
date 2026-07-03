import { createBrowserSupabase } from "@/lib/supabase/browser";

const supabase = createBrowserSupabase();




export const listingService = {
  async getAll() {
    ;

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data ?? [];
  },

  async getById(id: string) {
    ;

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  },
};



