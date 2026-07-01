import * as z from "zod";
import { UserRole } from "@/utils/prisma";

export const SignUpSchema = z
  .object({
    firstName: z
      .string({ error: "First name is required" })
      .min(2, { error: "First name must be at least 2 characters long" })
      .refine((value) => value.trim().length > 0, {
        error: "First name cannot be just spaces",
      }),
    lastName: z
      .string({ error: "Last name is required" })
      .min(2, { error: "Last name must be at least 2 characters long" })
      .refine((value) => value.trim().length > 0, {
        error: "Last name cannot be just spaces",
      }),
    role: z
      .enum(Object.values(UserRole) as [UserRole, ...UserRole[]], {
        error: "Role is required",
      })
      .default(UserRole.ADMIN),
    passport: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || z.url().safeParse(value).success,
        {
          error: "Profile picture URL must be valid",
        },
      )
      .default(""),
    email: z.email({ error: "Email is required" }),
    password: z
      .string({ error: "Password is required" })
      .min(8, { error: "Password must be at least 8 characters long" }),
    confirmPassword: z.string({ error: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });
