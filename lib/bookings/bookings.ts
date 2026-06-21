import { supabase } from "./supabase";

export async function createBooking({
  listing_id,
  buyer_id,
  message,
}: {
  listing_id: string;
  buyer_id: string;
  message: string;
}) {
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