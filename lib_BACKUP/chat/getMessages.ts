import { createServerSupabase } from "@/lib/supabase/server";

export async function getMessages(conversationId: string) {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}






