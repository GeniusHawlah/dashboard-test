import { Gender, UserRole } from "@/utils/prisma";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { optionalImageSchema } from "@/utils/zod/imageUploadSchema";
import * as z from "zod";

extendZodWithOpenApi(z);

const PHONE_NUMBER_REGEX = /^[+]?[\d\s()-]{7,20}$/;

export const CreateAdminSchema = z
  .object({
    role: z
      .enum([UserRole.ADMIN, UserRole.SUPER_ADMIN], {
        error: "Admin role is required",
      })
      .optional()
      .default(UserRole.ADMIN),
    title: z
      .string({ error: "Title is required" })
      .min(2, { error: "Title must be at least 2 characters long" })
      .max(20, { error: "Title cannot exceed 20 characters" })
      .refine((value) => value.trim().length > 0, {
        error: "Title cannot be just spaces",
      }),
    firstName: z
      .string({ error: "First name is required" })
      .min(2, { error: "First name must be at least 2 characters long" })
      .max(50, { error: "First name cannot exceed 50 characters" })
      .refine((value) => value.trim().length > 0, {
        error: "First name cannot be just spaces",
      }),
    lastName: z
      .string({ error: "Last name is required" })
      .min(2, { error: "Last name must be at least 2 characters long" })
      .max(50, { error: "Last name cannot exceed 50 characters" })
      .refine((value) => value.trim().length > 0, {
        error: "Last name cannot be just spaces",
      }),
    email: z.email({ error: "Invalid email address" }),
    gender: z.enum(Object.values(Gender) as [Gender, ...Gender[]], {
      error: "Gender is required",
    }),
    dateOfBirth: z.coerce
      .date({
        error: "Date of birth is required",
      })
      .refine((date) => !Number.isNaN(date.getTime()), {
        error: "Invalid date of birth",
      })
      .refine((date) => date.getTime() <= Date.now(), {
        error: "Date of birth cannot be in the future",
      }),
    phoneNumber: z
      .string({ error: "Phone number is required" })
      .trim()
      .regex(PHONE_NUMBER_REGEX, {
        error: "Phone number must contain only numbers and valid symbols",
      })
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value)),
    address: z
      .string({ error: "Address is required" })
      .min(5, { error: "Address must be at least 5 characters long" })
      .max(300, { error: "Address cannot exceed 300 characters" })
      .refine((value) => value.trim().length > 0, {
        error: "Address cannot be just spaces",
      })
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value)),
    passport: optionalImageSchema("Passport"),
    idCard: optionalImageSchema("ID card"),
  })
  .openapi("CreateAdminRequest");

export const CreateAdminSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
    }),
  })
  .openapi("CreateAdminSuccessResponse");

export const CreateAdminErrorSchema = z
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
      statusCode: z.number().optional(),
    }),
  })
  .openapi("CreateAdminErrorResponse");

export type CreateAdminRequest = z.input<typeof CreateAdminSchema>;
