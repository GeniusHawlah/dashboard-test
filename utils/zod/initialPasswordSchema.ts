import { z } from "zod";

export const InitialPasswordSchema = z
  .object({
    newPassword: z
      .string({ error: "New Password is required" })
      .min(8, {
        error: "New Password must be at least eight characters long",
      })
      .regex(/[a-z]/, {
        error: "New Password must include at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        error: "New Password must include at least one uppercase letter",
      })
      .regex(/\d/, {
        error: "New Password must include at least one number",
      })
      .regex(/[@$!%*?&#]/, {
        error:
          "New Password must include at least one special character e.g @$!%*?&#",
      }),
    confirmNewPassword: z.string({
      error: "New Password confirmation is required",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    error: "New Password and Confirm New Password do not match",
    path: ["confirmNewPassword"],
  });
