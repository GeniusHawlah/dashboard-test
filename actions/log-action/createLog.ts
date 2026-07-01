"use server";

import { db } from "@/lib/db";
import { formatTitledName } from "@/utils/utils";
import { ActionLogStatus, Prisma, UserRole } from "@prisma/client";
import { headers } from "next/headers";

type LogPerformer = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  role?: UserRole | string | null;
};

type LogTarget = {
  type?: string | null;
  id?: string | null;
  name?: string | null;
};

export type CreateLogInput = {
  action: string;
  apiRoute?: string;
  functionName?: string;
  performer?: LogPerformer | null;
  status?: ActionLogStatus;
  message?: string | null;
  target?: LogTarget | null;
  metadata?: unknown;
};

const SENSITIVE_KEY_PARTS = [
  "authorization",
  "cookie",
  "credential",
  "hash",
  "otp",
  "password",
  "secret",
  "session",
  "token",
];

function compactText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function normalizeRole(role: LogPerformer["role"]): UserRole | undefined {
  if (!role) return undefined;

  return Object.values(UserRole).includes(role as UserRole)
    ? (role as UserRole)
    : undefined;
}

function shouldRedact(key: string) {
  const normalizedKey = key.toLowerCase();
  return SENSITIVE_KEY_PARTS.some((part) => normalizedKey.includes(part));
}

function cleanMetadata(value: unknown, depth = 0): unknown {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === "string") {
    return value.length > 1200 ? `${value.slice(0, 1200)}...` : value;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (depth >= 5) return "[Max depth reached]";

  if (Array.isArray(value)) {
    return value.slice(0, 50).map((item) => cleanMetadata(item, depth + 1));
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, nestedValue]) => [
        key,
        shouldRedact(key)
          ? "[Redacted]"
          : cleanMetadata(nestedValue, depth + 1),
      ])
      .filter(([, nestedValue]) => nestedValue !== undefined);

    return Object.fromEntries(entries);
  }

  return String(value);
}

function toJsonValue(value: unknown): Prisma.InputJsonValue | undefined {
  const cleaned = cleanMetadata(value);
  if (cleaned === undefined) return undefined;
  return cleaned as Prisma.InputJsonValue;
}

async function getPerformerSnapshot(
  performer: LogPerformer | null | undefined,
): Promise<{
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  role: UserRole | undefined;
}> {
  const id = compactText(performer?.id);
  const providedRole = normalizeRole(performer?.role);

  if (!id) {
    return {
      id: undefined,
      name: compactText(performer?.name),
      email: compactText(performer?.email),
      role: providedRole,
    };
  }

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return {
    id: user?.id,
    name: user
      ? formatTitledName({
          title: user.title,
          name: compactText(performer?.name) ?? user.name,
        })
      : compactText(performer?.name),
    email: compactText(performer?.email) ?? user?.email,
    role: providedRole ?? user?.role,
  };
}

async function getRequestSnapshot() {
  try {
    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for");

    return {
      ipAddress:
        forwardedFor?.split(",")[0]?.trim() ||
        headerStore.get("x-real-ip") ||
        undefined,
      userAgent: headerStore.get("user-agent") || undefined,
    };
  } catch {
    return {
      ipAddress: undefined,
      userAgent: undefined,
    };
  }
}

export async function createLog(input: CreateLogInput) {
  try {
    const requestSnapshot = await getRequestSnapshot();
    const performer = await getPerformerSnapshot(input.performer);

    await db.actionLog.create({
      data: {
        action: compactText(input.action) ?? input.functionName ?? "unknown",
        apiRoute:
          compactText(input.apiRoute) ??
          compactText(input.functionName) ??
          compactText(input.action) ??
          "unknown",
        status: input.status ?? ActionLogStatus.SUCCESS,
        message: compactText(input.message),
        performerId: performer.id,
        performerName: performer.name,
        performerEmail: performer.email,
        performerRole: performer.role,
        targetType: compactText(input.target?.type),
        targetId: compactText(input.target?.id),
        targetName: compactText(input.target?.name),
        metadata: toJsonValue(input.metadata),
        ipAddress: requestSnapshot.ipAddress,
        userAgent: requestSnapshot.userAgent,
      },
      select: { id: true },
    });
  } catch (error) {
    console.log("[createLog] failed to persist log", error);
  }
}
