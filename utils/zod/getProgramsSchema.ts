import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const ProgramItemSchema = z
  .object({
    id: z.string().openapi({ example: "cly9g8k1a0001xqv9m7d0p8z1" }),
    name: z.string().openapi({ example: "Science Mentorship" }),
    description: z.string().nullable().openapi({
      example: "A structured mentorship program for aspiring science leaders.",
    }),
    price: z.number().openapi({ example: 0 }),
    cohort: z.string().nullable().openapi({ example: "2026 Cohort" }),
    coverImage: z.string().nullable().openapi({
      example: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    }),
    applicationOpensAt: z.string().datetime().nullable().openapi({
      example: "2026-03-10T09:00:00.000Z",
    }),
    startsAt: z.string().datetime().nullable().openapi({
      example: "2026-04-01T09:00:00.000Z",
    }),
    endsAt: z.string().datetime().nullable().openapi({
      example: "2026-07-01T09:00:00.000Z",
    }),
    applicationClosesAt: z.string().datetime().nullable().openapi({
      example: "2026-03-24T09:00:00.000Z",
    }),
    programBenefits: z.array(z.string()).openapi({
      example: ["Certificate of Completion", "Access to Mentors"],
    }),
    requirements: z.array(z.string()).openapi({
      example: ["Laptop or desktop access", "Stable internet access"],
    }),
    isActive: z.boolean().openapi({ example: true }),
    enrolledByUser: z.boolean().openapi({ example: false }),
  })
  .openapi("ProgramItem");

export const ProgramsSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
      data: z.array(ProgramItemSchema),
      metadata: z.object({
        total: z.number(),
      }),
    }),
  })
  .openapi("ProgramsSuccessResponse");

export const ProgramsErrorSchema = z
  .object({
    error: z.object({
      message: z.string(),
      statusCode: z.number().optional(),
    }),
  })
  .openapi("ProgramsErrorResponse");
