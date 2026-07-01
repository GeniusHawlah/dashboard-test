import * as z from "zod";
import { IMAGE_UPLOAD_MIME_TYPES } from "@/utils/imageUploadTypes";

const MAX_IMAGE_UPLOAD_BYTES = 700 * 1024;

export const imageUploadPayloadSchema = z.object({
  dataUrl: z.string().refine(
    (value) => /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(value),
    { error: "Image upload data is invalid" },
  ),
  fileName: z.string().max(180).optional(),
  mimeType: z.enum(IMAGE_UPLOAD_MIME_TYPES),
  size: z.number().int().positive().max(MAX_IMAGE_UPLOAD_BYTES, {
    error: "Image must be smaller than 700KB after compression",
  }),
});

export function imageUploadPayloadSchemaWithLimit(maxBytes: number) {
  return z.object({
    dataUrl: z.string().refine(
      (value) => /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(value),
      { error: "Image upload data is invalid" },
    ),
    fileName: z.string().max(180).optional(),
    mimeType: z.enum(IMAGE_UPLOAD_MIME_TYPES),
    size: z.number().int().positive().max(maxBytes, {
      error: `Image must be smaller than ${Math.round(maxBytes / 1024)}KB after compression`,
    }),
  });
}

export function optionalImageSchema(label: string, maxBytes = MAX_IMAGE_UPLOAD_BYTES) {
  return z
    .union([
      z
        .string()
        .trim()
        .url({ error: `${label} must be a valid URL` })
        .or(z.literal(""))
        .transform((value) => (value === "" ? undefined : value)),
      imageUploadPayloadSchemaWithLimit(maxBytes),
    ])
    .optional();
}

export function requiredImageSchema(label: string, maxBytes = MAX_IMAGE_UPLOAD_BYTES) {
  return z.union([ 
    z.string().trim().url({ error: `${label} must be a valid URL` }),
    imageUploadPayloadSchemaWithLimit(maxBytes),
  ]);
}
