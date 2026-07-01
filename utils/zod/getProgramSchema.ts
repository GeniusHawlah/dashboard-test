import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const ProgramMentorBriefSchema = z
  .object({
    id: z.string().openapi({ example: "cly9g8k1a0001xqv9m7d0p8z1" }),
    title: z.string().nullable().openapi({ example: "Dr." }),
    name: z.string().openapi({ example: "Amina Yusuf" }),
    email: z.string().email().openapi({ example: "amina@example.com" }),
  })
  .openapi("ProgramMentorBrief");

export const ProgramDetailsSchema = z
  .object({
    id: z.string().openapi({ example: "cly9g8k1a0001xqv9m7d0p8z1" }),
    name: z.string().openapi({ example: "Science Mentorship" }),
    description: z.string().nullable().openapi({
      example: "A structured mentorship program for aspiring science leaders.",
    }),
    levelCount: z.number().openapi({ example: 4 }),
    currentLevel: z.number().openapi({ example: 2 }),
    isActive: z.boolean().openapi({ example: true }),
    price: z.number().openapi({ example: 0 }),
    cohort: z.string().nullable().openapi({ example: "COHORT-APR-2026" }),
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
    createdAt: z.string().datetime().openapi({
      example: "2026-01-01T09:00:00.000Z",
    }),
    updatedAt: z.string().datetime().openapi({
      example: "2026-01-12T09:00:00.000Z",
    }),
    mentors: z.array(ProgramMentorBriefSchema),
    _count: z.object({
      enrollments: z.number().openapi({ example: 12 }),
    }),
    enrolledByUser: z.boolean().openapi({ example: false }),
    activeEnrollmentProgramId: z.string().nullable().openapi({
      example: "cly9g8k1a0001xqv9m7d0p8z1",
    }),
  })
  .openapi("ProgramDetails");

export const ProgramSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
      data: ProgramDetailsSchema,
    }),
  })
  .openapi("ProgramSuccessResponse");

export const ProgramErrorSchema = z
  .object({
    error: z.object({
      message: z.string(),
      statusCode: z.number().optional(),
    }),
  })
  .openapi("ProgramErrorResponse");
