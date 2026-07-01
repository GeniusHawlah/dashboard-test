import { UserRole, UserStatus } from "@/utils/prisma";
import { randomUUID } from "crypto";
import {
  buildPicsumPassport,
  type DemoAccount,
} from "@/utils/demo-auth";

export interface FakeAuthSessionUser {
  id: string;
  userId: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  isFirstLogin: boolean;
  passport?: string | null;
  title?: string | null;
  middleName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
}

export interface FakeAuthSession {
  accessToken: string;
  userId: string;
  user: FakeAuthSessionUser;
  session: {
    userId: string;
    user: FakeAuthSessionUser;
  };
  data: {
    user: FakeAuthSessionUser;
  };
}

function titleCase(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return "";

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

function getNameParts(email: string) {
  const localPart = email.split("@")[0] ?? "user";
  const cleaned = localPart.replace(/[^a-zA-Z0-9._-]+/g, " ");
  const parts = cleaned
    .split(/[._-\s]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const firstName = titleCase(parts[0] ?? "Demo");
  const lastName = titleCase(parts[1] ?? "User");

  return { firstName, lastName };
}

function inferRole(email: string): UserRole {
  const lowered = email.toLowerCase();

  if (lowered.includes("super")) return UserRole.SUPER_ADMIN;
  if (lowered.includes("tech")) return UserRole.TECH_ADMIN;
  if (lowered.includes("admin")) return UserRole.ADMIN;
  if (lowered.includes("mentor")) return UserRole.MENTOR;

  return UserRole.MENTEE;
}

export function buildFakeAuthSession(
  accountOrEmail: string | DemoAccount,
): FakeAuthSession {
  const accessToken = randomUUID();
  const email =
    typeof accountOrEmail === "string" ? accountOrEmail : accountOrEmail.email;
  const nameParts =
    typeof accountOrEmail === "string"
      ? getNameParts(accountOrEmail)
      : {
          firstName:
          accountOrEmail.firstName.trim() || getNameParts(email).firstName,
          lastName:
            accountOrEmail.lastName.trim() || getNameParts(email).lastName,
        };
  const role =
    typeof accountOrEmail === "string"
      ? inferRole(email)
      : accountOrEmail.role;

  const user: FakeAuthSessionUser = {
    id: randomUUID(),
    userId: `USR-${accessToken.slice(0, 8).toUpperCase()}`,
    email: email.trim().toLowerCase(),
    name: `${nameParts.firstName} ${nameParts.lastName}`.trim(),
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    role,
    status: UserStatus.ACTIVE,
    emailVerified: true,
    isFirstLogin: false,
    passport:
      typeof accountOrEmail === "string"
        ? buildPicsumPassport(email)
        : accountOrEmail.passport?.trim() || buildPicsumPassport(email),
  };

  return {
    accessToken,
    userId: user.userId,
    user,
    session: {
      userId: user.userId,
      user,
    },
    data: {
      user,
    },
  };
}

export function serializeFakeAuthSession(session: FakeAuthSession) {
  return encodeURIComponent(JSON.stringify(session));
}

export function parseFakeAuthSession(value: string | undefined | null) {
  if (!value) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as FakeAuthSession;

    if (!parsed?.accessToken || !parsed?.user) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
