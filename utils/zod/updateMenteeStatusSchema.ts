import { UserStatus } from "@prisma/client";
import * as z from "zod";

export const UpdateMenteeStatusParamsSchema = z.object({
  menteeId: z.string().min(1, "Mentee is required"),
});

export const UpdateMenteeStatusBodySchema = z.object({
  status: z.enum(UserStatus),
});

export const UpdateMenteeStatusActionSchema = UpdateMenteeStatusParamsSchema.merge(
  UpdateMenteeStatusBodySchema,
);

