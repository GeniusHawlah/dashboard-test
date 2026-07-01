import type { UserRole } from "@/utils/prisma";

export interface DemoAccount {
  firstName: string;
  lastName: string;
  role: UserRole;
  passport?: string | null;
  email: string;
  password: string;
}

const DEMO_ACCOUNT_STORAGE_KEY = "GoFinance:demo-account";

export function buildPicsumPassport(seed: string) {
  const normalizedSeed = seed.trim().toLowerCase() || "GoFinance-user";

  return `https://picsum.photos/seed/${encodeURIComponent(normalizedSeed)}/200/200`;
}

export function saveDemoAccount(account: DemoAccount) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    DEMO_ACCOUNT_STORAGE_KEY,
    JSON.stringify(account),
  );
}

export function getDemoAccount(): DemoAccount | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(DEMO_ACCOUNT_STORAGE_KEY);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DemoAccount;

    if (
      typeof parsed?.firstName !== "string" ||
      typeof parsed?.lastName !== "string" ||
      typeof parsed?.role !== "string" ||
      (typeof parsed?.passport !== "string" &&
        typeof parsed?.passport !== "undefined" &&
        parsed?.passport !== null) ||
      typeof parsed?.email !== "string" ||
      typeof parsed?.password !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
