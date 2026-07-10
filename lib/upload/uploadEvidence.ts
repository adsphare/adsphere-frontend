import { createClient } from "@supabase/supabase-js";

export async function uploadEvidence(file: File, disputeId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const filePath = `disputes/${disputeId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("evidence")
    .upload(filePath, file);

  if (error) throw new Error(error.message);

  const { data: publicUrl } = supabase.storage
    .from("evidence")
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
}





