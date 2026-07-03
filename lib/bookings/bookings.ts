import { createServerSupabase } from "@/lib/supabase/server";

/* =========================
   GET USER
========================= */
export async function getUser() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase.auth.getUser();

  return {
    user: error ? null : data.user,
  };
}

/* =========================
   CREATE BOOKING
========================= */
export async function createBooking({
  listing_id,
  buyer_id,
  message,
}: {
  listing_id: string;
  buyer_id: string;
  message: string;
}) {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        listing_id,
        buyer_id,
        message,
        status: "pending",
      },
    ])
    .select()
    .single();

  return { data, error };
}





