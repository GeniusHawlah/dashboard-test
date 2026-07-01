import * as z from "zod";

export const EmailSchema = z.object({
  email: z
    .email({ error: "Email is required" })
    .min(1, { error: "Email cannot be empty!" }),
});
