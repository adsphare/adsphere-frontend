import { createClient } from "@/lib/supabase/server";
import { rankListing } from "@/lib/server/rank";

/* =========================
   RESPONSE WRAPPER
========================= */
function response(data: any, error: any) {
  return {
    success: !error,
    data,
    error,
  };
}

/* =========================
   CREATE LISTING
========================= */
export async function createListing(listing: {
  user_id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  description: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .insert([listing])
    .select()
    .single();

  return response(data, error);
}

/* =========================
   GET ALL LISTINGS (FIXED BOOST ENGINE)
========================= */
export async function getListings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*");

  if (error) return response(null, error);

  const now = Date.now();

  const cleaned = (data || []).map((item) => {
    const expires = item.boost_expires_at
      ? new Date(item.boost_expires_at).getTime()
      : null;

    const isExpired =
      item.is_boosted && expires && expires < now;

    return {
      ...item,

      // safe normalization
      is_boosted: isExpired ? false : item.is_boosted,
      boost_level: isExpired ? 0 : item.boost_level,
      boost_score: isExpired ? 0 : item.boost_score,
    };
  });

  /* =========================
     SAFE SORTING
  ========================= */
  const sorted = cleaned.sort((a, b) => {
    try {
      return rankListing(b) - rankListing(a);
    } catch {
      return 0;
    }
  });

  return response(sorted, null);
}

/* =========================
   GET SINGLE LISTING
========================= */
export async function getListingById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return response(data, error);
}

/* =========================
   GET USER LISTINGS
========================= */
export async function getUserListings(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return response(data, error);
}

/* =========================
   DELETE LISTING
========================= */
export async function deleteListing(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id);

  return response(data, error);
}

/* =========================
   INCREMENT VIEWS (FIXED ATOMIC VERSION)
========================= */
export async function incrementViews(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "increment_listing_views",
    {
      row_id: id,
    }
  );

  return response(data, error);
}