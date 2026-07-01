import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

const PasswordSchema = z
  .string({ error: "Password is required" })
  .min(8, { error: "Password must be at least 8 characters long" })
  .max(100, { error: "Password cannot exceed 100 characters" })
  .regex(/[a-z]/, {
    error: "Password must include at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    error: "Password must include at least one uppercase letter",
  })
  .regex(/\d/, { error: "Password must include at least one number" })
  .regex(/[@$!%*?&#]/, {
    error: "Password must include at least one special character e.g @$!%*?&#",
  });

export const ResetPasswordSchema = z
  .object({
    email: z
      .email({ error: "Email is required" })
      .trim()
      .min(1, { error: "Email cannot be empty!" })
      .openapi({ example: "ada@example.com" }),
    code: z
      .string({ error: "Reset code is required" })
      .trim()
      .min(8, { error: "Reset code must be 8 characters long" })
      .max(8, { error: "Reset code must be 8 characters long" })
      .regex(/^[a-zA-Z0-9]+$/, {
        error: "Reset code must be alphanumeric",
      })
      .transform((value) => value.toUpperCase())
      .openapi({ example: "A1B2C3D4" }),
    password: PasswordSchema.openapi({ example: "Password@123" }),
    confirmPassword: z
      .string({ error: "Password confirmation is required" })
      .openapi({ example: "Password@123" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .openapi("ResetPasswordRequest");

export const ResetPasswordSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
    }),
  })
  .openapi("ResetPasswordSuccessResponse");

export const ResetPasswordErrorSchema = z
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
  .openapi("ResetPasswordErrorResponse");

export type ResetPasswordRequest = z.infer<typeof ResetPasswordSchema>;
