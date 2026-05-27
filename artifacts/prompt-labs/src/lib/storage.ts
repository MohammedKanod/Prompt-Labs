const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

export async function uploadImage(file: File, publicId?: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  if (publicId) form.append("public_id", publicId);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? "Cloudinary upload failed");
  }

  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}
