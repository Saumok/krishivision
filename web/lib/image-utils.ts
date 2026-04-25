import imageCompression from "browser-image-compression";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1024,
  useWebWorker: true,
  fileType: "image/jpeg" as const,
  initialQuality: 0.8,
};

/**
 * Compress an image file to ≤ 500 KB for upload.
 */
export async function compressImage(file: File): Promise<File> {
  if (file.size <= 500 * 1024) return file; // Already small enough
  return imageCompression(file, COMPRESSION_OPTIONS);
}

/**
 * Upload a compressed image to Supabase Storage.
 * Returns the public URL on success.
 */
export async function uploadScanImage(
  supabase: ReturnType<typeof import("./supabase/client").createClient>,
  file: File,
  userId: string
): Promise<string> {
  const compressed = await compressImage(file);
  const ext = "jpg";
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("scan-images")
    .upload(path, compressed, { contentType: "image/jpeg", upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from("scan-images").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Create a local object URL from a File for image preview.
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Upload a marketplace image to Supabase Storage.
 */
export async function uploadMarketplaceImage(
  supabase: ReturnType<typeof import("./supabase/client").createClient>,
  file: File,
  userId: string,
  index: number
): Promise<string> {
  const compressed = await imageCompression(file, {
    ...COMPRESSION_OPTIONS,
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
    initialQuality: 0.85,
  });
  const path = `${userId}/${Date.now()}_${index}.jpg`;
  const { error } = await supabase.storage
    .from("marketplace-images")
    .upload(path, compressed, { contentType: "image/jpeg", upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from("marketplace-images").getPublicUrl(path);
  return data.publicUrl;
}
