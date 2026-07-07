import { createBrowserSupabase } from "@/lib/supabase/browser";

export async function uploadEvidence(
  file: File,
  disputeId: string,
  userId: string
) {
  const supabase = createBrowserSupabase();

  const filePath = `disputes/${disputeId}/${Date.now()}-${file.name}`;

  // 1. Upload file
  const { error: uploadError } = await supabase.storage
    .from("evidence")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // 2. Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("evidence")
    .getPublicUrl(filePath);

  const url = publicUrlData.publicUrl;

  // 3. Save metadata in DB
  const { error: dbError } = await supabase
    .from("dispute_evidence")
    .insert({
      dispute_id: disputeId,
      uploader_id: userId,
      file_url: url,
      file_type: file.type,
    });

  if (dbError) {
    throw new Error(dbError.message);
  }

  return url;
}

