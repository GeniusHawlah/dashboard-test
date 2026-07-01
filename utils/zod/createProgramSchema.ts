import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";
import {
  IMAGE_UPLOAD_MIME_TYPES,
  type ImageUploadMimeType,
} from "@/utils/imageUploadTypes";

const ProgramCoverImageUploadSchema = z
  .object({
    dataUrl: z.string().min(1, { error: "Cover image upload is required" }),
    fileName: z.string().optional(),
    mimeType: z.enum(
      [...IMAGE_UPLOAD_MIME_TYPES] as [
        ImageUploadMimeType,
        ...ImageUploadMimeType[],
      ],
      { error: "Cover image type is required" },
    ),
    size: z.coerce.number().int().nonnegative({
      error: "Cover image size is invalid",
    }),
  });

extendZodWithOpenApi(z);

export const CreateProgramSchema = z
  .object({
    name: z
      .string({ error: "Program name is required" })
      .trim()
      .min(2, { error: "Program name must be at least 2 characters long" })
      .max(150, { error: "Program name cannot exceed 150 characters" })
      .openapi({ example: "ProFak Science Mentorship" }),
    description: z
      .string()
      .trim()
      .max(5000, {
        error: "Program description cannot exceed 5000 characters",
      })
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value))
      .openapi({
        example: "A structured mentorship program for aspiring science leaders.",
      }),
    price: z
      .coerce.number({ error: "Program price is required" })
      .min(0, { error: "Program price cannot be negative" })
      .default(0)
      .openapi({ example: 0 }),
    isActive: z.boolean().optional().default(false).openapi({ example: false }),
    applicationOpensAt: z
      .coerce.date({ error: "Application open date is invalid" })
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value))
      .openapi({ example: "2026-03-10T09:00:00.000Z" }),
    startsAt: z.coerce
      .date({ error: "Program start date is required" })
      .openapi({ example: "2026-04-01T09:00:00.000Z" }),
    endsAt: z
      .coerce.date({ error: "Program end date is invalid" })
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value))
      .openapi({ example: "2026-07-01T09:00:00.000Z" }),
    applicationClosesAt: z
      .coerce.date({ error: "Application close date is invalid" })
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value))
      .openapi({ example: "2026-03-24T09:00:00.000Z" }),
    programBenefits: z
      .array(z.string().trim().min(1))
      .default([])
      .openapi({
        example: ["Certificate of Completion", "Access to Mentors"],
      }),
    requirements: z
      .array(z.string().trim().min(1))
      .default([])
      .openapi({
        example: ["Laptop or desktop access", "Stable internet access"],
      }),
    mentorIds: z
      .array(z.string().trim().min(1))
      .min(1, { error: "Select at least one mentor" })
      .openapi({
        example: ["cly9g8k1a0001xqv9m7d0p8z1"],
      }),
    coverImage: z
      .union([
        z
          .string()
          .trim()
          .max(2048, {
            error: "Cover image URL cannot exceed 2048 characters",
          }),
        ProgramCoverImageUploadSchema,
      ])
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value))
      .openapi({
        example: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      }),
  })
  .refine(
    (data) => !data.endsAt || data.endsAt.getTime() >= data.startsAt.getTime(),
    {
      error: "Program end date must be after the start date",
      path: ["endsAt"],
    },
  )
  .refine(
    (data) =>
      !data.applicationOpensAt ||
      data.applicationOpensAt.getTime() <= data.startsAt.getTime(),
    {
      error: "Application open date must be on or before the program start date",
      path: ["applicationOpensAt"],
    },
  )
  .refine(
    (data) =>
      !data.applicationClosesAt ||
      !data.applicationOpensAt ||
      data.applicationClosesAt.getTime() >= data.applicationOpensAt.getTime(),
    {
      error: "Application close date must be on or after the open date",
      path: ["applicationClosesAt"],
    },
  )
  .refine(
    (data) =>
      !data.applicationClosesAt ||
      data.applicationClosesAt.getTime() <= data.startsAt.getTime(),
    {
      error: "Application close date must be on or before the program start date",
      path: ["applicationClosesAt"],
    },
  )
  .openapi("CreateProgramRequest");

export const CreateProgramSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
    }),
  })
  .openapi("CreateProgramSuccessResponse");

export const CreateProgramErrorSchema = z
  .object({
    error: z.object({
      message: z.string(),
      formErrors: z
        .record(
          z.string(),
          z.object({
            errors: z.array(z.string()),
          }),
        )
        .optional(),
    }),
  })
  .openapi("CreateProgramErrorResponse");

export type CreateProgramRequest = z.infer<typeof CreateProgramSchema>;
