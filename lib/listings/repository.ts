
import { createServerSupabase } from "@/lib/supabase/server";
import type { Listing } from "./types";

/* =========================================
   CREATE PAYLOAD
========================================= */

export type CreateListingPayload = {
  user_id: string;

  title: string;

  description: string;

  location: string;

  type: string;

  price: number;

  currency: string;

  status: string;

  /*
   * Boost fields are allowed during creation
   * only so a new listing starts from a known
   * non-promoted state.
   */
  boost_score: number;

  boost_views: number;

  boost_clicks: number;

  boosted: boolean;

  created_at: string;
};

/* =========================================
   EDITABLE LISTING FIELDS
========================================= */

/*
 * Promotion/boost state is intentionally excluded.
 *
 * NEVER add these fields here:
 *
 * - boost_score
 * - boosted
 * - boost_expires_at
 * - boost_plan
 * - boost_provider
 *
 * Promotion state belongs to the canonical
 * payment/boost settlement flow.
 */

export type UpdateListingPayload = Partial<
  Pick<
    Listing,
    | "title"
    | "description"
    | "location"
    | "type"
    | "price"
    | "currency"
  >
>;

/* =========================================
   GET ALL LISTINGS
========================================= */

export async function getListings(): Promise<Listing[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Listing[];
}

/* =========================================
   GET SINGLE LISTING
========================================= */

export async function getListingById(
  id: string
): Promise<Listing | null> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as Listing;
}

/* =========================================
   CREATE LISTING
========================================= */

export async function createListing(
  listing: CreateListingPayload
): Promise<Listing> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("listings")
    .insert(listing)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Listing;
}

/* =========================================
   UPDATE LISTING
========================================= */

export async function updateListing(
  id: string,
  updates: UpdateListingPayload
): Promise<Listing> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("listings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Listing;
}

/* =========================================
   DELETE LISTING
========================================= */

export async function deleteListing(
  id: string
): Promise<void> {
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

