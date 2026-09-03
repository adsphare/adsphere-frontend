import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "evidence-files";
const SIGNED_URL_SECONDS = 300;

export async function getDisputeEvidence(disputeId: string) {
  if (!disputeId) {
    throw new Error("Missing dispute ID");
  }

  const { data: evidence, error } = await supabaseAdmin
    .from("dispute_evidence")
    .select(`
      id,
      dispute_id,
      escrow_id,
      uploader_id,
      file_url,
      file_type,
      note,
      created_at
    `)
    .eq("dispute_id", disputeId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const items = await Promise.all(
    (evidence ?? []).map(async (item) => {
      /*
       * file_url is currently being used as the storage path.
       * This avoids introducing another schema migration.
       */
      const storagePath = item.file_url;

      if (!storagePath) {
        return {
          ...item,
          signed_url: null,
        };
      }

      const { data, error: signedUrlError } =
        await supabaseAdmin.storage
          .from(BUCKET)
          .createSignedUrl(storagePath, SIGNED_URL_SECONDS);

      if (signedUrlError) {
        console.error(
          "Failed to create evidence signed URL:",
          signedUrlError
        );

        return {
          ...item,
          signed_url: null,
        };
      }

      return {
        ...item,
        signed_url: data.signedUrl,
      };
    })
  );

  return items;
}
