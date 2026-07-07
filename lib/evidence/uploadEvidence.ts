import { createClient } from "@supabase/supabase-js";

/* =========================
   SERVER CLIENT
========================= */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* =========================
   UPLOAD EVIDENCE V2
========================= */
export async function uploadEvidence(
  file: File,
  disputeId: string,
  userId: string,
  description?: string
) {
  if (!file) throw new Error("No file provided");

  /* =========================
     VALIDATION
  ========================= */
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "video/mp4",
    "application/pdf",
  ];

  if (!allowed.includes(file.type)) {
    throw new Error("Unsupported file type");
  }

  /* =========================
     GENERATE FILE PATH
  ========================= */
  const ext = file.name.split(".").pop();
  const path = `evidence/${disputeId}/${Date.now()}.${ext}`;

  /* =========================
     UPLOAD TO STORAGE
  ========================= */
  const { error: uploadError } = await supabase.storage
    .from("evidence-files")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  /* =========================
     GET PUBLIC URL
  ========================= */
  const { data } = supabase.storage
    .from("evidence-files")
    .getPublicUrl(path);

  const fileUrl = data.publicUrl;

  /* =========================
     SAVE TO DB
  ========================= */
  const { data: record, error: dbError } = await supabase
    .from("dispute_evidence")
    .insert({
      dispute_id: disputeId,
      uploader_id: userId,
      file_url: fileUrl,
      file_type: file.type,
    })
    .select()
    .single();

  if (dbError) {
    throw new Error(dbError.message);
  }

  return record;
}





