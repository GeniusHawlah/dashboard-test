import * as z from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const ContactUsSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(1, { error: "Name cannot be empty!" })
    .max(100, { error: "Name is too long" }),
  email: z
    .email({ error: "Email is required" })
    .trim()
    .min(1, { error: "Email cannot be empty!" }),
  subject: z
    .string({ error: "Subject is required" })
    .trim()
    .min(1, { error: "Subject cannot be empty!" })
    .max(150, { error: "Subject is too long" }),
  message: z
    .string({ error: "Message is required" })
    .trim()
    .min(1, { error: "Message cannot be empty!" })
    .max(5000, { error: "Message is too long" })
    .openapi({ example: "I would like to learn more about the mentorship program." }),
}).openapi("ContactUsRequest");

export const ContactUsSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
    }),
  })
  .openapi("ContactUsSuccessResponse");

export const ContactUsErrorSchema = z
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
  .openapi("ContactUsErrorResponse");

export type ContactUsRequest = z.infer<typeof ContactUsSchema>;
