"use server";

import { z } from "zod";

import {
  GENERAL_FORM_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from "@/utils/constants";
import type {
  SignUpDataInterface,
  SignUpFormErrorsInterface,
  SignUpFormStateInterface,
} from "@/utils/types";
import { SignUpSchema } from "@/utils/zod/signUpSchema";

export default async function signUpAction(
  signUpData: SignUpDataInterface,
): Promise<SignUpFormStateInterface> {
  const validatedFields = SignUpSchema.safeParse(signUpData);

  if (!validatedFields.success) {
    return {
      error: {
        message: GENERAL_FORM_ERROR_MESSAGE,
        formErrors: z.treeifyError(validatedFields.error)
          .properties as SignUpFormErrorsInterface,
      },
    };
  }

  // In a real app, this is where the server would create the user record,
  // persist it, and return the created account/session metadata to the client.
  // The client store currently handles the temporary persistence after this
  // action succeeds so the login flow can read it back.
  //
  // Example of the real flow we are temporarily bypassing:
  //
  // const response = await fetch(`${process.env.API_BASE}/auth/register`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     firstName: validatedFields.data.firstName.trim(),
  //     lastName: validatedFields.data.lastName.trim(),
  //     role: UserRole.ADMIN,
  //     email: validatedFields.data.email.trim().toLowerCase(),
  //     password: validatedFields.data.password,
  //   }),
  // });
  // if (!response.ok) {
  //   const errorBody = await response.json().catch(() => null);
  //   return { error: { message: "Account creation failed", formErrors: ... } };
  // }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    return {
      success: {
        message: "Account created successfully.",
      },
    };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : NETWORK_ERROR_MESSAGE,
      },
    };
  }
}
