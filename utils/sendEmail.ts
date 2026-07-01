import { Resend } from "resend";
import { z } from "zod";

let resendClient: Resend | null = null;

const SendEmailSchema = z.object({
  to: z.union([
    z.email({ error: "Recipient email is invalid" }),
    z.array(z.email({ error: "Recipient email is invalid" })),
  ]),
  subject: z
    .string({ error: "Subject is required" })
    .trim()
    .min(1, { error: "Subject cannot be empty!" }),
  text: z
    .string({ error: "Email body is required" })
    .trim()
    .min(1, { error: "Email body cannot be empty!" }),
  replyTo: z.email({ error: "Reply-to email is invalid" }).optional(),
});

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
  fromName,
}: {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
  fromName?: string;
}) {
  const validatedFields = SendEmailSchema.safeParse({
    to,
    subject,
    text,
    replyTo,
  });

  if (!validatedFields.success) {
    throw new Error(
      validatedFields.error.issues[0]?.message ?? "Invalid email payload.",
    );
  }

  const from = process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is not configured.");
  }

  const brandedFromName =
    fromName?.trim() || process.env.RESEND_FROM_NAME?.trim() || "ProFak SIF";
  const fromAddress = brandedFromName ? `${brandedFromName} <${from}>` : from;

  const { error } = await getResendClient().emails.send({
    from: fromAddress,
    to: validatedFields.data.to,
    subject: validatedFields.data.subject,
    html: validatedFields.data.text,
    replyTo: validatedFields.data.replyTo,
  });

  if (error) {
    throw error;
  }
}
