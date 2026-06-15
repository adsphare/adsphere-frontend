import { supabase } from "@/lib/supabase";

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
  const { data, error } = await supabase
    .from("listings")
    .insert([listing])
    .select()
    .single();

  return { data, error };
}

/* =========================
   GET ALL LISTINGS
========================= */
export async function getListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

/* =========================
   GET SINGLE LISTING
========================= */
export async function getListingById(id: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return { data, error };
}

/* =========================
   GET USER LISTINGS
========================= */
export async function getUserListings(userId: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

/* =========================
   DELETE LISTING
========================= */
export async function deleteListing(id: string) {
  const { data, error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id);

  return { data, error };
}