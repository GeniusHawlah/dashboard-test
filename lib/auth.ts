import { UserRole, UserStatus } from "@prisma/client";
import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  EMAIL_NOT_VERIFIED_ERROR_MESSAGE,
  INACTIVE_ERROR_MESSAGE,
  UNAPPROVED_ERROR_MESSAGE,
} from "../utils/constants";
import {
  buildMenteeWelcomeEmail,
  buildVerificationEmail,
} from "../utils/emailTemplates";
import { db } from "./db";

const prisma = db; //new PrismaClient();

const globalForAuth = globalThis as unknown as {
  auth?: ReturnType<typeof betterAuth>;
};

export const auth = betterAuth({
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ token, user }) => {
      await sendVerificationEmailToUser(user.email, token);
    },
    afterEmailVerification: async (user) => {
      const appUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { role: true, firstName: true, email: true },
      });

      if (appUser?.role !== UserRole.MENTEE) {
        return;
      }

      await sendMenteeWelcomeEmail(appUser.email, appUser.firstName);
    },
  },

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,

    // This is here in case a user requests password reset
    // sendResetPassword: async ({ user, url, token }, request) => {
    //   const { sendEmail } = await import("@/utils/sendEmail");
    //   await sendEmail({
    //     to: user.email,
    //     subject: "PASSWORD RESET REQUEST",
    //     text: passwordResetRequestTemplate(url),
    //   });
    // },

    // onPasswordReset: async ({ user }, request) => {
    //   const { sendEmail } = await import("@/utils/sendEmail");
    //   await sendEmail({
    //     to: user.email,
    //     subject: "PASSWORD RESET SUCCESSFUL",
    //     text: passwordResetSuccessTemplate(
    //       `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
    //     ),
    //   });
    // },
    // resetPasswordTokenExpiresIn: 3600,
  },

  // Check for inactive user on login
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true, status: true, emailVerified: true },
          });

          if (!user?.emailVerified) {
            throw new APIError("FORBIDDEN", {
              message: EMAIL_NOT_VERIFIED_ERROR_MESSAGE,
            });
          }

          const unapprovedRoles: UserRole[] = [
            UserRole.MENTEE,
            UserRole.MENTOR,
          ];

          if (
            user?.status === UserStatus.UNAPPROVED &&
            user?.role &&
            unapprovedRoles.includes(user.role)
          ) {
            throw new APIError("FORBIDDEN", {
              message: UNAPPROVED_ERROR_MESSAGE,
            });
          }

          if (user?.status !== UserStatus.ACTIVE) {
            throw new APIError("FORBIDDEN", {
              message: INACTIVE_ERROR_MESSAGE,
            });
          }

          return { data: session }; // proceed
        },
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "compact",
      refreshCache: true,
    },
  },

  secret: process.env.BETTER_AUTH_SECRET,

  user: {
    additionalFields: {
      title: {
        type: "string",
        required: false,
        input: true,
      },
      firstName: {
        type: "string",
        required: true,
        input: true,
      },
      educationLevel: {
        type: "string",
        required: false,
        input: true,
        returned: true,
      },

      middleName: {
        type: "string",
        required: false,
        input: true,
      },
      lastName: {
        type: "string",
        required: true,
        input: true,
      },

      userId: {
        type: "string",
        required: true,
        input: true,
        returned: true,
      },

      role: {
        type: "string",
        required: true,
        input: true,
        default: UserRole.MENTEE,
        returned: true,
      },

      gender: {
        type: "string",
        required: true,
        input: true,
      },

      phoneNumber: {
        type: "string",
        required: false,
        input: true,
      },

      address: {
        type: "string",
        required: false,
        input: true,
      },

      dateOfBirth: {
        type: "date",
        required: true,
        input: true,
      },

      programId: {
        type: "string",
        required: false,
        input: true,
      },

      passport: {
        type: "string",
        required: false,
        input: true,
      },

      idCard: {
        type: "string",
        required: false,
        input: true,
      },

      status: {
        type: "string",
        required: false,
        input: true,
        default: UserStatus.UNAPPROVED,
        returned: true,
      },

      isFirstLogin: {
        type: "boolean",
        required: false,
        input: true,
        default: true,
        returned: true,
      },
    },
  },

  plugins: [],
});

async function sendVerificationEmailToUser(email: string, token: string) {
  const { sendEmail } = await import("@/utils/sendEmail");
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";
  const url = new URL("/verify-email", baseUrl);
  url.searchParams.set("token", token);
  const verificationUrl = url.toString();

  try {
    await sendEmail({
      to: email,
      subject: "Verify your ProFak SIF email address",
      text: buildVerificationEmail(verificationUrl),
    });
  } catch (error) {
    console.log("Failed to send verification email", error);
  }
}

async function sendMenteeWelcomeEmail(email: string, firstName: string) {
  const { sendEmail } = await import("@/utils/sendEmail");

  try {
    await sendEmail({
      to: email,
      subject: "Welcome to ProFak Science Impactful Foundation",
      text: buildMenteeWelcomeEmail(firstName),
    });
  } catch (error) {
    console.log("Failed to send mentee welcome email", error);
  }
}

// In dev mode, Next.js hot reload can still re-run modules. Better Auth recommends this to cache the instance and prevent dev-only double initialization
if (process.env.NODE_ENV !== "production") {
  globalForAuth.auth = auth;
}
