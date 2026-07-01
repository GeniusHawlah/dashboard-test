import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";
import {
  CreateMenteeErrorSchema,
  CreateMenteeSchema,
  CreateMenteeSuccessSchema,
} from "@/utils/zod/createMenteeSchema";
import {
  CreateMentorErrorSchema,
  CreateMentorSchema,
  CreateMentorSuccessSchema,
} from "@/utils/zod/createMentorSchema";
import {
  ContactUsErrorSchema,
  ContactUsSchema,
  ContactUsSuccessSchema,
} from "@/utils/zod/contactUsSchema";
import {
  LoginErrorSchema,
  LoginSchema,
  LoginSuccessSchema,
} from "@/utils/zod/loginSchema";
import {
  ForgotPasswordErrorSchema,
  ForgotPasswordSchema,
  ForgotPasswordSuccessSchema,
} from "@/utils/zod/forgotPasswordSchema";
import {
  ResetPasswordErrorSchema,
  ResetPasswordSchema,
  ResetPasswordSuccessSchema,
} from "@/utils/zod/resetPasswordSchema";
import {
  ProgramsErrorSchema,
  ProgramsSuccessSchema,
} from "@/utils/zod/getProgramsSchema";
import {
  ProgramErrorSchema,
  ProgramSuccessSchema,
} from "@/utils/zod/getProgramSchema";
import {
  ApplyProgramErrorSchema,
  ApplyProgramParamsSchema,
  ApplyProgramSuccessSchema,
} from "@/utils/zod/applyProgramSchema";

const registry = new OpenAPIRegistry();
const SESSION_COOKIE_SECURITY_SCHEME = "SessionCookieAuth";

registry.registerComponent("securitySchemes", SESSION_COOKIE_SECURITY_SCHEME, {
  type: "apiKey",
  in: "cookie",
  name: "better-auth.session_token",
  description:
    "Paste the Better Auth session cookie value for authenticated routes.",
});

registry.registerPath({
  method: "post",
  path: "/api/global/contact-us",
  summary: "Send a contact message",
  description:
    "Sends a message from the public contact form to the configured inbox.",
  tags: ["Global"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ContactUsSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Contact message sent successfully.",
      content: {
        "application/json": {
          schema: ContactUsSuccessSchema,
        },
      },
    },
    400: {
      description: "Validation failed.",
      content: {
        "application/json": {
          schema: ContactUsErrorSchema,
        },
      },
    },
    500: {
      description: "Unexpected server error.",
      content: {
        "application/json": {
          schema: ContactUsErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/mentee",
  summary: "Create a mentee account",
  description:
    "Creates a mentee account, generates a user ID, and stores the auth record.",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateMenteeSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Mentee account created successfully.",
      content: {
        "application/json": {
          schema: CreateMenteeSuccessSchema,
        },
      },
    },
    400: {
      description: "Validation failed.",
      content: {
        "application/json": {
          schema: CreateMenteeErrorSchema,
        },
      },
    },
    403: {
      description: "Inactive account.",
      content: {
        "application/json": {
          schema: CreateMenteeErrorSchema,
        },
      },
    },
    409: {
      description: "Duplicate email or phone number.",
      content: {
        "application/json": {
          schema: CreateMenteeErrorSchema,
        },
      },
    },
    500: {
      description: "Unexpected server error.",
      content: {
        "application/json": {
          schema: CreateMenteeErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/login",
  summary: "Login a user",
  description: "Logs a user in with email and password.",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful.",
      content: {
        "application/json": {
          schema: LoginSuccessSchema,
        },
      },
    },
    400: {
      description: "Validation failed.",
      content: {
        "application/json": {
          schema: LoginErrorSchema,
        },
      },
    },
    401: {
      description: "Invalid credentials.",
      content: {
        "application/json": {
          schema: LoginErrorSchema,
        },
      },
    },
    403: {
      description: "Inactive account.",
      content: {
        "application/json": {
          schema: LoginErrorSchema,
        },
      },
    },
    500: {
      description: "Unexpected server error.",
      content: {
        "application/json": {
          schema: LoginErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/request-otp",
  summary: "Request a password reset code",
  description:
    "Sends an 8-character alphanumeric password reset code to the user's email address. The response stays generic to avoid account enumeration.",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ForgotPasswordSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Password reset code request processed.",
      content: {
        "application/json": {
          schema: ForgotPasswordSuccessSchema,
        },
      },
    },
    400: {
      description: "Validation failed.",
      content: {
        "application/json": {
          schema: ForgotPasswordErrorSchema,
        },
      },
    },
    500: {
      description: "Unexpected server error.",
      content: {
        "application/json": {
          schema: ForgotPasswordErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/reset-password",
  summary: "Reset a password with a verification code",
  description:
    "Verifies an 8-character alphanumeric reset code sent to the user's email, updates the password, and clears the consumed verification record.",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ResetPasswordSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Password reset successfully.",
      content: {
        "application/json": {
          schema: ResetPasswordSuccessSchema,
        },
      },
    },
    400: {
      description: "Validation failed or the code was invalid.",
      content: {
        "application/json": {
          schema: ResetPasswordErrorSchema,
        },
      },
    },
    410: {
      description: "Reset code expired.",
      content: {
        "application/json": {
          schema: ResetPasswordErrorSchema,
        },
      },
    },
    500: {
      description: "Unexpected server error.",
      content: {
        "application/json": {
          schema: ResetPasswordErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/mentor",
  summary: "Create a mentor account",
  description:
    "Creates a mentor account, generates a user ID, and stores the auth record.",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateMentorSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Mentor account created successfully.",
      content: {
        "application/json": {
          schema: CreateMentorSuccessSchema,
        },
      },
    },
    400: {
      description: "Validation failed.",
      content: {
        "application/json": {
          schema: CreateMentorErrorSchema,
        },
      },
    },
    403: {
      description: "Inactive account.",
      content: {
        "application/json": {
          schema: CreateMentorErrorSchema,
        },
      },
    },
    409: {
      description: "Duplicate email or phone number.",
      content: {
        "application/json": {
          schema: CreateMentorErrorSchema,
        },
      },
    },
    500: {
      description: "Unexpected server error.",
      content: {
        "application/json": {
          schema: CreateMentorErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/programs",
  summary: "List active programs",
  description:
    "Returns active programs and marks the ones the current user is enrolled in when a session exists.",
  tags: ["Programs"],
  security: [
    { [SESSION_COOKIE_SECURITY_SCHEME]: [] },
    {},
  ],
  responses: {
    200: {
      description: "Programs fetched successfully.",
      content: {
        "application/json": {
          schema: ProgramsSuccessSchema,
        },
      },
    },
    500: {
      description: "Unexpected server error.",
      content: {
        "application/json": {
          schema: ProgramsErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/programs/{programId}",
  summary: "Get a program",
  description:
    "Returns a single program by id and marks whether the current user is enrolled when a session exists.",
  tags: ["Programs"],
  security: [
    { [SESSION_COOKIE_SECURITY_SCHEME]: [] },
    {},
  ],
  request: {
    params: z
      .object({
        programId: z.string().openapi({
          example: "cly9g8k1a0001xqv9m7d0p8z1",
        }),
      })
      .openapi("ProgramParams"),
  },
  responses: {
    200: {
      description: "Program fetched successfully.",
      content: {
        "application/json": {
          schema: ProgramSuccessSchema,
        },
      },
    },
    400: {
      description: "Invalid program id.",
      content: {
        "application/json": {
          schema: ProgramErrorSchema,
        },
      },
    },
    404: {
      description: "Program not found.",
      content: {
        "application/json": {
          schema: ProgramErrorSchema,
        },
      },
    },
    500: {
      description: "Unexpected server error.",
      content: {
        "application/json": {
          schema: ProgramErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/programs/{programId}/apply",
  summary: "Apply for a program",
  description:
    "Creates the initial enrollment scaffolding for the authenticated mentee, including the active enrollment record and starter result rows.",
  tags: ["Programs"],
  security: [{ [SESSION_COOKIE_SECURITY_SCHEME]: [] }],
  request: {
    params: ApplyProgramParamsSchema,
  },
  responses: {
    201: {
      description: "Program application submitted successfully.",
      content: {
        "application/json": {
          schema: ApplyProgramSuccessSchema,
        },
      },
    },
    400: {
      description: "Validation failed.",
      content: {
        "application/json": {
          schema: ApplyProgramErrorSchema,
        },
      },
    },
    401: {
      description: "Authentication required.",
      content: {
        "application/json": {
          schema: ApplyProgramErrorSchema,
        },
      },
    },
    403: {
      description: "Not allowed.",
      content: {
        "application/json": {
          schema: ApplyProgramErrorSchema,
        },
      },
    },
    404: {
      description: "Program not found.",
      content: {
        "application/json": {
          schema: ApplyProgramErrorSchema,
        },
      },
    },
    409: {
      description: "Already enrolled or applications are closed.",
      content: {
        "application/json": {
          schema: ApplyProgramErrorSchema,
        },
      },
    },
    500: {
      description: "Unexpected server error.",
      content: {
        "application/json": {
          schema: ApplyProgramErrorSchema,
        },
      },
    },
  },
});

export const openApiSpec = new OpenApiGeneratorV3(registry.definitions).generateDocument({
  openapi: "3.0.3",
  info: {
    title: "ProFak SIF API",
    version: "1.0.0",
    description:
      "OpenAPI documentation for the ProFak Science Impactful Foundation API.",
  },
  servers: [{ url: "/" }],
});
