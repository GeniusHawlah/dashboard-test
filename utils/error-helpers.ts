import { BetterAuthError } from "better-auth";
import { ZodError } from "zod";
import { DATABASE_NOT_READY_LOG_MESSAGE } from "./constants";

function extractErrorMessage(value: unknown, depth = 0): string | undefined {
  if (!value || depth > 4) return undefined;

  if (typeof value === "string") {
    return value.trim() || undefined;
  }

  if (value instanceof Error) {
    return value.message || undefined;
  }

  if (typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;

  const directMessage = record.message;
  if (typeof directMessage === "string" && directMessage.trim()) {
    return directMessage;
  }

  const nestedKeys = [
    "body",
    "data",
    "error",
    "cause",
    "response",
    "details",
    "result",
  ] as const;

  for (const key of nestedKeys) {
    const nested = extractErrorMessage(record[key], depth + 1);
    if (nested) return nested;
  }

  return undefined;
}

export function networkError(error: string | null | undefined) {
  if (!error) return false;

  if (typeof error !== "string") return false;

  const errorText = error.toLowerCase();

  return (
    errorText.includes("network") ||
    errorText.includes("fetch failed") ||
    errorText.includes("econnrefused") ||
    errorText.includes("enotfound") ||
    errorText.includes("etimedout") ||
    errorText.includes("failed to fetch") ||
    errorText.includes("socket hang up")
  );
}

export function guardError(error: unknown): string {
  const unexpectedErrorMessage = "An unexpected error occurred";

  if (!error) return unexpectedErrorMessage;

  if (error instanceof Error) {
    const errorName = error.name || "";
    const isPrismaKnownRequestError =
      errorName === "PrismaClientKnownRequestError" ||
      errorName.includes("PrismaClientKnownRequestError") ||
      error.message.includes("PrismaClientKnownRequestError");

    if (isPrismaKnownRequestError) {
      const code = (error as { code?: string }).code;

      if (code === "P2021") {
        return DATABASE_NOT_READY_LOG_MESSAGE;
      }

      if (code === "P2022") {
        return "The database schema is out of sync with the app. Please apply the latest Prisma migrations.";
      }

      return "A database error occurred.";
    }

    if (error.name === "PrismaClientInitializationError") {
      return "Database connection failed - check your connection string or database status.";
    }

    if (error.name === "PrismaClientValidationError") {
      return "Invalid data: one or more fields don't match the database schema (check required fields, types, or unknown fields.)";
    }
  }

  const message = extractErrorMessage(error);

  if (message) {
    return message;
  }

  if (error instanceof BetterAuthError) {
    return error.message || unexpectedErrorMessage;
  }

  if (error instanceof Error) {
    if (
      error.message.includes("PrismaClient") ||
      error.name?.includes("PrismaClient")
    ) {
      const lines = error.message.split("\n");

      for (const line of lines) {
        const trimmed = line.trim();

        if (
          trimmed &&
          !trimmed.startsWith("at ") &&
          !trimmed.includes("node_modules") &&
          !trimmed.includes("__TURBOPACK__") &&
          trimmed.length > 20
        ) {
          return trimmed;
        }
      }

      return "Database error occurred";
    }

    return error.message || unexpectedErrorMessage;
  }

  return unexpectedErrorMessage;
}

export function getFirstZodErrorMessage(
  error: unknown,
  fallback = "Invalid input.",
): string {
  if (!(error instanceof ZodError)) {
    return fallback;
  }

  const firstIssue = error.issues.find((issue) => issue.message?.trim());

  return firstIssue?.message || fallback;
}
