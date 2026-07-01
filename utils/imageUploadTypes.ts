export const IMAGE_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ImageUploadMimeType = (typeof IMAGE_UPLOAD_MIME_TYPES)[number];

export interface ImageUploadPayload {
  dataUrl: string;
  fileName?: string;
  mimeType: ImageUploadMimeType;
  size: number;
}

export type ImageInputValue = string | ImageUploadPayload | null | undefined;

export function isImageUploadPayload(
  value: unknown,
): value is ImageUploadPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "dataUrl" in value &&
    "mimeType" in value &&
    "size" in value
  );
}
