import { createBrowserSupabase } from "@/lib/supabase/browser";

const supabase = createBrowserSupabase();

/* =========================
   STORAGE UPLOAD
========================= */
export async function uploadFile(file: File): Promise<string | null> {
  try {
    // Create unique filename
    const fileName = `${Date.now()}-${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("listings")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("listings")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
}

