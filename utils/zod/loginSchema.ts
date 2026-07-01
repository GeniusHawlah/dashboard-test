import * as z from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const LoginSchema = z
  .object({
    email: z
      .email({ error: "Email is required" })
      .min(1, { error: "Email cannot be empty!" })
      .openapi({ example: "ada@example.com" }),
    password: z
      .string({ error: "Password is required" })
      .min(3, { error: "Password cannot be empty" })
      .refine((value) => value.trim().length > 0, {
        error: "Password cannot be just spaces",
      })
      .openapi({ example: "Password@123" }),
    rememberMe: z.boolean().optional().openapi({ example: false }),
  })
  .openapi("LoginRequest");

export const LoginSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
      redirect: z.boolean(),
      token: z.string(),
      url: z.string().optional(),
      user: z
        .object({
          id: z.string(),
          email: z.string().email(),
          name: z.string(),
          userId: z.string(),
          role: z.string(),
          status: z.string().optional(),
        })
        .passthrough(),
    }),
  })
  .openapi("LoginSuccessResponse");

export const LoginErrorSchema = z
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
  .openapi("LoginErrorResponse");

export type LoginRequest = z.infer<typeof LoginSchema>;
