import { supabase } from "@/lib/supabase";

export async function ensureProfile(userId: string, email?: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (data) return data;

  const username = email?.split("@")[0] ?? "user";

  const { data: newProfile, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      username,
      full_name: "",
      avatar_url: "",
      bio: "",
      location: "",
    })
    .select()
    .single();

  if (error) throw error;

  return newProfile;
}