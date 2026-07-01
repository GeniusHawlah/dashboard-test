import { buildFakeAuthSession } from "@/utils/auth-session";
import { RelativeRoutes } from "@/utils/enum";
import { UserRole, UserStatus } from "@/utils/prisma";

type AuthResponse = {
  status: number;
  headers: Headers;
  response: {
    token?: string;
    user: {
      userId: string;
      email: string;
      role: UserRole;
      status: UserStatus;
    };
    redirect?: string;
    message?: string;
  };
};

function createHeaders() {
  return new Headers();
}

export const auth = {
  api: {
    async signInEmail({
      body,
    }: {
      body: {
        email: string;
        password: string;
        rememberMe?: boolean;
      };
      headers?: Headers;
      returnHeaders?: boolean;
      returnStatus?: boolean;
    }): Promise<AuthResponse> {
      const session = buildFakeAuthSession(body.email);

      return {
        status: 200,
        headers: createHeaders(),
        response: {
          token: session.accessToken,
          user: {
            userId: session.user.userId,
            email: session.user.email,
            role: session.user.role,
            status: session.user.status,
          },
          redirect: RelativeRoutes.DASHBOARD_HOMEPAGE,
        },
      };
    },
    async signUpEmail({
      body,
    }: {
      body: {
        email: string;
        password: string;
        callbackURL?: string;
        role?: UserRole;
        userId?: string;
      } & Record<string, unknown>;
    }): Promise<AuthResponse> {
      const session = buildFakeAuthSession(body.email);

      return {
        status: 200,
        headers: createHeaders(),
        response: {
          token: session.accessToken,
          user: {
            userId: body.userId ?? session.user.userId,
            email: session.user.email,
            role: body.role ?? UserRole.MENTEE,
            status: UserStatus.ACTIVE,
          },
          message: "Account created successfully.",
        },
      };
    },
    async sendVerificationEmail({
      body,
    }: {
      body: {
        email: string;
        callbackURL?: string;
      };
    }): Promise<AuthResponse> {
      return {
        status: 200,
        headers: createHeaders(),
        response: {
          message: "Verification email sent.",
          user: {
            userId: "",
            email: body.email,
            role: UserRole.MENTEE,
            status: UserStatus.ACTIVE,
          },
        },
      };
    },
    async signOut(): Promise<AuthResponse> {
      return {
        status: 200,
        headers: createHeaders(),
        response: {
          message: "Signed out.",
          user: {
            userId: "",
            email: "",
            role: UserRole.MENTEE,
            status: UserStatus.ACTIVE,
          },
        },
      };
    },
  },
};
