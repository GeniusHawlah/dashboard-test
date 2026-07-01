import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const RequestOtpSchema = z
  .object({
    email: z
      .email({ error: "Email is required" })
      .trim()
      .min(1, { error: "Email cannot be empty!" })
      .openapi({ example: "ada@example.com" }),
  })
  .openapi("RequestOtpRequest");

export const RequestOtpSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
    }),
  })
  .openapi("RequestOtpSuccessResponse");

export const RequestOtpErrorSchema = z
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
  .openapi("RequestOtpErrorResponse");

export type RequestOtpRequest = z.infer<typeof RequestOtpSchema>;
