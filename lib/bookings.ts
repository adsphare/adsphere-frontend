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
  return await supabase.from("bookings").insert([
    {
      listing_id,
      buyer_id,
      message,
      status: "pending",
    },
  ]);
}