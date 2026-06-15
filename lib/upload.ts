import { supabase } from "@/lib/supabase";

export async function uploadImage(file: File) {
  try {
    // 1. Create unique file name
    const fileName = `${Date.now()}-${file.name}`;

    // 2. Upload file to Supabase Storage bucket
    const { data, error } = await supabase.storage
      .from("listings") // bucket name
      .upload(fileName, file);

    if (error) {
      console.log("Upload error:", error);
      return null;
    }

    // 3. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("listings")
      .getPublicUrl(data.path);

    // 4. Return image URL
    return publicUrlData.publicUrl;

  } catch (err) {
    console.log("Upload failed:", err);
    return null;
  }
}