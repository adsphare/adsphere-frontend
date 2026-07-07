"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function EvidenceUploader({
  escrowId,
}: {
  escrowId: string;
}) {
  const [uploading, setUploading] = useState(false);

  // ✅ REQUIRED
  const supabase = createBrowserSupabase();

  async function uploadEvidence(file: File) {
    try {
      setUploading(true);

      const filePath = `${escrowId}/${Date.now()}-${file.name}`;

      // 1. Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("evidence")
        .upload(filePath, file);

      if (uploadError) {
        console.error(uploadError);
        alert(uploadError.message);
        return;
      }

      // 2. Save record in DB
      const { error: dbError } = await supabase.from("evidence").insert({
        escrow_id: escrowId,
        file_path: filePath,
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        console.error(dbError);
        alert(dbError.message);
        return;
      }

      alert("Evidence uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadEvidence(file);
        }}
      />

      {uploading && <p>Uploading...</p>}
    </div>
  );
}

