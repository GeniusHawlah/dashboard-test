import { Gender, UserRole } from "@prisma/client";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {
  optionalImageSchema,
  requiredImageSchema,
} from "@/utils/zod/imageUploadSchema";
import * as z from "zod";

extendZodWithOpenApi(z);

const PHONE_NUMBER_REGEX = /^[+]?[\d\s()-]{7,20}$/;

export const CreateMentorSchema = z
  .object({
    role: z
      .enum([UserRole.MENTOR], {
        error: "Mentor role is required",
      })
      .optional()
      .default(UserRole.MENTOR),
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
      .refine((value) => value.trim().length > 0, {
        error: "First name cannot be just spaces",
      })
      .openapi({ example: "Amina" }),
    lastName: z
      .string({ error: "Last name is required" })
      .min(2, { error: "Last name must be at least 2 characters long" })
      .refine((value) => value.trim().length > 0, {
        error: "Last name cannot be just spaces",
      })
      .openapi({ example: "Okafor" }),
    email: z.email({ error: "Invalid email address" }).openapi({
      example: "amina@example.com",
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
      .string({ error: "Phone number is required" })
      .trim()
      .regex(PHONE_NUMBER_REGEX, {
        error: "Phone number must contain only numbers and valid symbols",
      }),
    address: z
      .string({ error: "Address is required" })
      .min(5, { error: "Address must be at least 5 characters long" })
      .max(300, { error: "Address cannot exceed 300 characters" })
      .refine((value) => value.trim().length > 0, {
        error: "Address cannot be just spaces",
      })
      .openapi({ example: "12 Mentor Road, Abuja" }),
    passport: optionalImageSchema("Passport", 200 * 1024),
    idCard: requiredImageSchema("ID card", 400 * 1024),
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
  .openapi("CreateMentorRequest");

export const CreateMentorSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
    }),
  })
  .openapi("CreateMentorSuccessResponse");

export const CreateMentorErrorSchema = z
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
  .openapi("CreateMentorErrorResponse");

export type CreateMentorRequest = z.input<typeof CreateMentorSchema>;
