import { createClient, isSupabaseConfigured } from "./client";

export const BUCKET_NAME = "digital-school-assets";

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  error?: string;
}

/**
 * Format bytes into human readable string (e.g. "2.4 MB")
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Upload a file to Supabase Storage with client-side validation
 */
export async function uploadAssetFile(
  file: File,
  folder: "worksheets" | "books" | "images" = "worksheets"
): Promise<UploadResult> {
  // 1. Validation: File size
  const maxBytes = folder === "images" ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for PDFs
  if (file.size > maxBytes) {
    return {
      success: false,
      error: `File size exceeds the limit (${formatBytes(maxBytes)}). Current file is ${formatBytes(file.size)}.`,
    };
  }

  // 2. Validation: File types
  if (folder === "worksheets" || folder === "books") {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return {
        success: false,
        error: "Invalid file format. Please upload a PDF file.",
      };
    }
  } else if (folder === "images") {
    const allowedImages = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedImages.includes(file.type)) {
      return {
        success: false,
        error: "Invalid image format. Supported formats: JPG, PNG, WEBP, SVG.",
      };
    }
  }

  // If Supabase is not configured, generate a simulated/local blob URL for demo testing
  if (!isSupabaseConfigured()) {
    const fakeUrl = URL.createObjectURL(file);
    return {
      success: true,
      fileUrl: fakeUrl,
      fileName: file.name,
      fileSize: formatBytes(file.size),
    };
  }

  try {
    const supabase = createClient();
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${folder}/${timestamp}_${sanitizedName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to upload file to storage.",
      };
    }

    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      success: true,
      fileUrl: publicData.publicUrl,
      fileName: file.name,
      fileSize: formatBytes(file.size),
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "File upload failed due to a network error.",
    };
  }
}

/**
 * Delete a file from storage bucket by URL
 */
export async function deleteAssetFile(fileUrl: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !fileUrl.includes(BUCKET_NAME)) {
    return true;
  }

  try {
    const supabase = createClient();
    const parts = fileUrl.split(`${BUCKET_NAME}/`);
    if (parts.length < 2) return true;
    const path = parts[1];

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
    return !error;
  } catch {
    return false;
  }
}
