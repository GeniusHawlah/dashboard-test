import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const CreateEventSchema = z
  .object({
    programId: z.string({ error: "Program is required" }).min(1, {
      error: "Program is required",
    }),
    title: z.string({ error: "Event title is required" }).trim().min(2, {
      error: "Event title must be at least 2 characters long",
    }),
    description: z
      .string()
      .trim()
      .max(5000, {
        error: "Event description cannot exceed 5000 characters",
      })
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value)),
    note: z
      .string()
      .trim()
      .max(2000, {
        error: "Event note cannot exceed 2000 characters",
      })
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value)),
    venue: z.string({ error: "Event venue is required" }).trim().min(2, {
      error: "Event venue must be at least 2 characters long",
    }),
    eventDate: z.date({ error: "Event date is required" }),
    eventTime: z.string({ error: "Event time is required" }).trim().min(1, {
      error: "Event time is required",
    }),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);

    if (data.eventDate < todayStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eventDate"],
        message: "Event date cannot be in the past",
      });
      return;
    }

    const dateKey = data.eventDate.toISOString().slice(0, 10);
    const scheduledAt = new Date(`${dateKey}T${data.eventTime}`);

    if (Number.isNaN(scheduledAt.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eventTime"],
        message: "Event time is invalid",
      });
      return;
    }

    if (scheduledAt.getTime() < now.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eventTime"],
        message: "Event time cannot be in the past",
      });
    }
  })
  .openapi("CreateEventRequest");

export const CreateEventErrorSchema = z.object({
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
});

export type CreateEventRequest = z.infer<typeof CreateEventSchema>;
