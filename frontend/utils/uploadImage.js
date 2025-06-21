import { supabase } from "@/supabase";

export async function uploadImage(file) {
  if (!file) return null;

  const fileName = `images/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("techy-blogs-bucket")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Error uploading image:", error);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("techy-blogs-bucket")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
