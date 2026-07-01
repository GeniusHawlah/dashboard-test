import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const ForgotPasswordSchema = z
  .object({
    email: z
      .email({ error: "Email is required" })
      .trim()
      .min(1, { error: "Email cannot be empty!" })
      .openapi({ example: "ada@example.com" }),
  })
  .openapi("ForgotPasswordRequest");

export const ForgotPasswordSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
    }),
  })
  .openapi("ForgotPasswordSuccessResponse");

export const ForgotPasswordErrorSchema = z
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
  .openapi("ForgotPasswordErrorResponse");

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordSchema>;
