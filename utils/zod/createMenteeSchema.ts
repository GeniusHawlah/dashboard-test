import { Gender } from "@/utils/prisma";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { EDUCATION_LEVEL_VALUES } from "@/utils/education-level";
import { optionalImageSchema } from "@/utils/zod/imageUploadSchema";
import * as z from "zod";

extendZodWithOpenApi(z);

const PHONE_NUMBER_REGEX = /^[+]?[\d\s()-]{7,20}$/;

export const CreateMenteeSchema = z
  .object({
    firstName: z
      .string({ error: "First name is required" })
      .min(2, { error: "First name must be at least 2 characters long" })
      .refine((value) => value.trim().length > 0, {
        error: "First name cannot be just spaces",
      })
      .openapi({ example: "Ada" }),
    middleName: z
      .string()
      .min(2, { error: "Middle name must be at least 2 characters long" })
      .refine((value) => value.trim().length > 0, {
        error: "Middle name cannot be just spaces",
      })
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value))
      .openapi({ example: "Joy" }),
    lastName: z
      .string({ error: "Last name is required" })
      .min(2, { error: "Last name must be at least 2 characters long" })
      .refine((value) => value.trim().length > 0, {
        error: "Last name cannot be just spaces",
      })
      .openapi({ example: "Okafor" }),
    educationLevel: z.enum(EDUCATION_LEVEL_VALUES, {
      error: "Education level is required",
    }),
    email: z.email({ error: "Invalid email address" }).openapi({
      example: "ada@example.com",
    }),
    password: z
      .string({ error: "Password is required" })
      .min(8, { error: "Password must be at least 8 characters long" })
      .max(100, { error: "Password cannot exceed 100 characters" })
      .openapi({ example: "Password@123" }),
    confirmPassword: z
      .string({ error: "Confirm password is required" })
      .openapi({
        example: "Password@123",
      }),
    gender: z.enum(Object.values(Gender) as [Gender, ...Gender[]], {
      error: "Gender is required",
    }),
    dateOfBirth: z.coerce.date({
      error: "Date of birth is required",
    }).refine((date) => date.getTime() <= Date.now(), {
      error: "Date of birth cannot be in the future",
    }),
    phoneNumber: z
      .string()
      .trim()
      .regex(PHONE_NUMBER_REGEX, {
        error: "Phone number must contain only numbers and valid symbols",
      })
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value)),
    address: z
      .string()
      .min(5, { error: "Address must be at least 5 characters long" })
      .max(300, { error: "Address cannot exceed 300 characters" })
      .refine((value) => value.trim().length > 0, {
        error: "Address cannot be just spaces",
      })
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value))
      .openapi({ example: "12 Mentor Road, Abuja" }),
    passport: optionalImageSchema("Passport", 200 * 1024),
    idCard: optionalImageSchema("ID card", 400 * 1024),
    programId: z
      .string()
      .min(1, { error: "Program ID cannot be empty" })
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .openapi("CreateMenteeRequest");

export const CreateMenteeSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
    }),
  })
  .openapi("CreateMenteeSuccessResponse");

export const CreateMenteeErrorSchema = z
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
  .openapi("CreateMenteeErrorResponse");

export type CreateMenteeRequest = z.infer<typeof CreateMenteeSchema>;
