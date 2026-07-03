"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";
import { rankListing } from "@/lib/ranking/rankListing";

const supabase = createBrowserSupabase(); // ✅ FIXED

export async function createListing(
  listing: any
) {
  const { data, error } = await supabase
    .from("listings")
    .insert(listing)
    .select()
    .single();

  if (error) return { success: false, error };

  return { success: true, data };
}

export async function getListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active");

  if (error) return { success: false, data: [], error };

  const now = Date.now();

  const cleaned = (data || []).map((item: any) => {
    const expires = item.boost_expires_at
      ? new Date(item.boost_expires_at).getTime()
      : null;

    const expired = item.boosted && expires && expires < now;

    return {
      ...item,
      boosted: expired ? false : item.boosted,
      boost_score: expired ? 0 : item.boost_score,
    };
  });

  return {
    success: true,
    data: cleaned.sort(
      (a: any, b: any) => (rankListing(b) || 0) - (rankListing(a) || 0)
    ),
  };
}