import { createBrowserSupabase } from "@/lib/supabase/browser";
const supabase = createBrowserSupabase();

;

export type Listing = {
  id: string;
  title: string;
  location: string;
  type?: string;
  price?: number;
  user_id: string;
  rank_score?: number;
  status?: string;
};

export const marketplaceService = {
  /* =========================
     GET ALL LISTINGS
  ========================= */
  async getListings(): Promise<Listing[]> {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getListings error:", error.message);
      throw error;
    }

    return data || [];
  },

  /* =========================
     GET SINGLE LISTING
  ========================= */
  async getListingById(id: string): Promise<Listing | null> {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("getListingById error:", error.message);
      return null;
    }

    return data;
  },
};




