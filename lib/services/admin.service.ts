import { createServerSupabase } from "@/lib/supabase/server";

export type BoostStatus = "active" | "expired" | "paused";

async function getSupabase() {
  return createServerSupabase();
}

/* =========================
   GET ALL USERS
========================= */
export async function getUsers() {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

/* =========================
   GET ALL LISTINGS
========================= */
export async function getListings() {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

/* =========================
   GET ALL BOOSTS
========================= */
export async function getBoosts() {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("boosts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

/* =========================
   ACTIVATE BOOST
========================= */
export async function activateBoost(boostId: string, days = 7) {
  const supabase = await getSupabase();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  const { data, error } = await supabase
    .from("boosts")
    .update({
      status: "active",
      expires_at: expiresAt.toISOString(),
    })
    .eq("id", boostId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

/* =========================
   EXPIRE BOOST
========================= */
export async function expireBoost(boostId: string) {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("boosts")
    .update({
      status: "expired",
    })
    .eq("id", boostId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

/* =========================
   DELETE LISTING (ADMIN)
========================= */
export async function deleteListing(listingId: string) {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId);

  if (error) throw new Error(error.message);

  return { success: true };
}

/* =========================
   DASHBOARD STATS
========================= */
export async function getDashboardStats() {
  const supabase = await getSupabase();

  const [{ count: users }, { count: listings }, { count: boosts }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("*", { count: "exact", head: true }),
      supabase.from("boosts").select("*", { count: "exact", head: true }),
    ]);

  return {
    users: users || 0,
    listings: listings || 0,
    boosts: boosts || 0,
  };
}





