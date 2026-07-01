"use server";

import { buildContactUsEmail } from "@/utils/emailTemplates";
import { GENERAL_FORM_ERROR_MESSAGE } from "@/utils/constants";
import { guardError } from "@/utils/error-helpers";
import {
  logActionFailure,
  logActionStart,
  logActionSuccess,
} from "@/utils/serverActionLogger";
import { sendEmail } from "@/utils/sendEmail";
import {
  ContactUsSchema,
  type ContactUsRequest,
} from "@/utils/zod/contactUsSchema";
import {
  type ContactUsFormErrors,
  type ContactUsFormStateInterface,
} from "@/utils/types";
import { z } from "zod";

const GENERIC_SUCCESS_MESSAGE = "Your message has been sent successfully.";
const GENERIC_FAILURE_MESSAGE =
  "Unable to send your message right now. Please try again later.";

function getFormErrors(
  error: z.ZodError,
): ContactUsFormErrors | undefined {
  const tree = z.treeifyError(error) as {
    properties?: ContactUsFormErrors;
  };

  return tree.properties;
}

function getRecipientEmail() {
  const recipient = process.env.RESEND_CONTACT_TO_EMAIL?.trim();

  if (!recipient) {
    throw new Error("RESEND_CONTACT_TO_EMAIL is not configured.");
  }

  return recipient;
}

export default async function contactUsAction(
  contactData: ContactUsRequest,
): Promise<ContactUsFormStateInterface> {
  logActionStart({
    action: "contactUsAction",
    context: {
      email: contactData.email,
      subject: contactData.subject,
    },
  });

  const validatedFields = ContactUsSchema.safeParse(contactData);

  if (!validatedFields.success) {
    await logActionFailure({
      action: "contactUsAction",
      message: GENERAL_FORM_ERROR_MESSAGE,
      context: {
        email: contactData.email,
        subject: contactData.subject,
      },
    });

    return {
      error: {
        message: GENERAL_FORM_ERROR_MESSAGE,
        formErrors: getFormErrors(validatedFields.error),
      },
    };
  }

  const { name, email, subject, message } = validatedFields.data;

  try {
    await sendEmail({
      to: getRecipientEmail(),
      subject: `[Contact Us] ${subject}`,
      replyTo: email,
      text: buildContactUsEmail({
        name,
        email,
        subject,
        message,
      }),
    });

    await logActionSuccess({
      action: "contactUsAction",
      message: "Contact message sent successfully.",
      context: {
        name,
        email,
        subject,
      },
    });

    return {
      success: {
        message: GENERIC_SUCCESS_MESSAGE,
      },
    };
  } catch (error) {
    const message = guardError(error);

    await logActionFailure({
      action: "contactUsAction",
      message,
      context: {
        name,
        email,
        subject,
      },
    });

    return {
      error: {
        message: GENERIC_FAILURE_MESSAGE,
      },
    };
  }
}
