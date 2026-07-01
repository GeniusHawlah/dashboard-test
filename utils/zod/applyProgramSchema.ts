import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const ApplyProgramParamsSchema = z
  .object({
    programId: z.string().openapi({ example: "cly9g8k1a0001xqv9m7d0p8z1" }),
  })
  .openapi("ApplyProgramParams");

export const ApplyProgramSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
      data: z.object({
        programId: z.string().openapi({
          example: "cly9g8k1a0001xqv9m7d0p8z1",
        }),
        enrollmentId: z.string().openapi({
          example: "cly9g8k1a0002xqv9m7d0p8z2",
        }),
        userId: z.string().openapi({ example: "USR-2026-0001" }),
        eventScoresCreated: z.number().openapi({ example: 4 }),
        mentorAssignmentsCreated: z.number().openapi({ example: 2 }),
      }),
    }),
  })
  .openapi("ApplyProgramSuccessResponse");

export const ApplyProgramErrorSchema = z
  .object({
    error: z.object({
      message: z.string(),
      statusCode: z.number().optional(),
    }),
  })
  .openapi("ApplyProgramErrorResponse");
