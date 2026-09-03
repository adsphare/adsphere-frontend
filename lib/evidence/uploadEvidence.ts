import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "evidence-files";

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "video/mp4",
  "application/pdf",
]);

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function uploadEvidence(
  file: File,
  disputeId: string,
  userId: string,
  note?: string
) {
  if (!(file instanceof File)) {
    throw new Error("No file provided");
  }

  if (!disputeId) {
    throw new Error("Missing dispute ID");
  }

  if (!userId) {
    throw new Error("Missing uploader ID");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Unsupported file type");
  }

  if (file.size <= 0) {
    throw new Error("File is empty");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds the 50 MB limit");
  }

  /*
   * Confirm the uploader is actually a participant
   * in the dispute. This remains enforced server-side
   * even if this function is called from another route.
   */
  const { data: dispute, error: disputeError } =
    await supabaseAdmin
      .from("disputes")
      .select(`
        id,
        escrow_id,
        buyer_id,
        seller_id
      `)
      .eq("id", disputeId)
      .maybeSingle();

  if (disputeError) {
    throw new Error(
      `Failed to validate dispute: ${disputeError.message}`
    );
  }

  if (!dispute) {
    throw new Error("Dispute not found");
  }

  const isParticipant =
    dispute.buyer_id === userId ||
    dispute.seller_id === userId;

  if (!isParticipant) {
    throw new Error(
      "Uploader is not a participant in this dispute"
    );
  }

  /*
   * Use a generated storage filename rather than the
   * original filename to prevent path manipulation and
   * collisions.
   */
  const extension =
    file.name.includes(".")
      ? file.name.split(".").pop()?.toLowerCase()
      : undefined;

  const safeExtension = extension
    ? extension.replace(/[^a-z0-9]/g, "")
    : "bin";

  const storagePath =
    `disputes/${disputeId}/${crypto.randomUUID()}.${safeExtension}`;

  const fileBuffer = Buffer.from(
    await file.arrayBuffer()
  );

  /*
   * Evidence is stored in a PRIVATE bucket.
   * Never expose a public URL for dispute evidence.
   */
  const { error: uploadError } =
    await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

  if (uploadError) {
    throw new Error(
      `Evidence storage upload failed: ${uploadError.message}`
    );
  }

  /*
   * The existing schema does not have storage_path.
   * file_url currently stores the private storage path.
   *
   * A signed URL is generated only when evidence is viewed.
   */
  const { data: record, error: dbError } =
    await supabaseAdmin
      .from("dispute_evidence")
      .insert({
        dispute_id: disputeId,
        escrow_id: dispute.escrow_id,
        uploader_id: userId,
        file_url: storagePath,
        file_type: file.type,
        note: note?.trim() || null,
      })
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
      .single();

  if (dbError) {
    /*
     * Compensating cleanup:
     * if the database insert fails, remove the orphaned
     * storage object.
     */
    await supabaseAdmin.storage
      .from(BUCKET)
      .remove([storagePath]);

    throw new Error(
      `Evidence database record failed: ${dbError.message}`
    );
  }

  return record;
}
