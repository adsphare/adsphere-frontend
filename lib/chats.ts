import { supabase } from "./supabase";

export async function sendMessage({
  listing_id,
  sender_id,
  receiver_id,
  message,
}: {
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
}) {
  return await supabase.from("chats").insert([
    {
      listing_id,
      sender_id,
      receiver_id,
      message,
    },
  ]);
}