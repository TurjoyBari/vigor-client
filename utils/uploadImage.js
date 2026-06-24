const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Whether imgBB is configured for client-side image uploads.
 */
export function isImageUploadConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_IMGBB_API_KEY?.trim());
}

/**
 * Upload an image file to imgBB and return the hosted URL.
 * Returns null on failure — callers should handle UI toasts.
 */
export const uploadImage = async (imageFile) => {
  if (!imageFile) {
    console.warn("uploadImage: no file provided");
    return null;
  }

  if (!imageFile.type?.startsWith("image/")) {
    console.error("uploadImage: invalid file type", imageFile.type);
    return null;
  }

  if (imageFile.size > MAX_FILE_SIZE_BYTES) {
    console.error("uploadImage: file exceeds 5 MB limit", imageFile.size);
    return null;
  }

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "uploadImage: NEXT_PUBLIC_IMGBB_API_KEY is missing in vigor-client/.env"
    );
    return null;
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  console.log("uploadImage: uploading", {
    name: imageFile.name,
    size: imageFile.size,
    type: imageFile.type,
  });

  try {
    const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("uploadImage: HTTP error", response.status, data);
      return null;
    }

    if (data?.success && data?.data) {
      const url = data.data.display_url || data.data.url || null;
      console.log("uploadImage: success", url);
      return url;
    }

    console.error("uploadImage: imgBB rejected upload", data?.error || data);
    return null;
  } catch (error) {
    console.error("uploadImage: network error", error);
    return null;
  }
};
