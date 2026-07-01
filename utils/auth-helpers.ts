import { UserRole } from "@prisma/client";
import { RelativeRoutes } from "./enum";

type RoleSource = {
  session?: any;
  providedRole?: UserRole | null;
  providedRoles?: UserRole | UserRole[] | null;
};

const USER_TECHNICAL_ROLE_LABELS: Partial<Record<UserRole, string>> = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.SUPER_ADMIN]: "Super Admin",
  [UserRole.TECH_ADMIN]: "Tech Admin",
  [UserRole.MENTOR]: "Mentor",
  [UserRole.MENTEE]: "Mentee",
};

function getRoles({
  session,
  providedRole,
  providedRoles,
}: RoleSource): UserRole[] {
  if (Array.isArray(providedRoles)) {
    return providedRoles.filter(Boolean);
  }

  if (providedRoles) {
    return [providedRoles];
  }

  const role = providedRole ?? session?.user?.role ?? session?.data?.user?.role;

  if (Array.isArray(role)) return role;
  if (!role) return [];

  return [role];
}

function getPrimaryRole(source: RoleSource): UserRole | null {
  return getRoles(source)[0] ?? null;
}

function isEmailVerified(source: RoleSource): boolean {
  const verified =
    source.session?.user?.emailVerified ??
    source.session?.data?.user?.emailVerified;

  return verified !== false;
}

function hasRole(source: RoleSource, role: UserRole): boolean {
  return getRoles(source).includes(role);
}

function hasAnyRole(source: RoleSource, roles: UserRole[]): boolean {
  return getRoles(source).some((role) => roles.includes(role));
}

export function getPrimaryUserTechnicalRole(source: RoleSource) {
  return getPrimaryRole(source);
}

export function formatUserTechnicalRole(
  role: UserRole | string | null | undefined,
): string {
  if (!role) return "User";

  return (
    USER_TECHNICAL_ROLE_LABELS[role as UserRole] ??
    String(role)
      .toLowerCase()
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function getPrimaryUserTechnicalRoleLabel(source: RoleSource): string {
  return formatUserTechnicalRole(getPrimaryUserTechnicalRole(source));
}

export function isTechAdmin(source: RoleSource): boolean {
  return isEmailVerified(source) && hasRole(source, UserRole.TECH_ADMIN);
}

export function isAdmin(source: RoleSource): boolean {
  if (!isEmailVerified(source)) return false;

  return hasAnyRole(source, [
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.TECH_ADMIN,
  ]);
}

export function isOrdinaryAdmin(source: RoleSource): boolean {
  return isEmailVerified(source) && hasRole(source, UserRole.ADMIN);
}

export function isSuperAdmin(source: RoleSource): boolean {
  return isEmailVerified(source) && hasRole(source, UserRole.SUPER_ADMIN);
}

export function isMentee(source: RoleSource): boolean {
  return hasRole(source, UserRole.MENTEE);
}

export function isMentor(source: RoleSource): boolean {
  return hasRole(source, UserRole.MENTOR);
}

export function getUserDashboardRoute(session: any): RelativeRoutes | null {
  if (isTechAdmin({ session })) return RelativeRoutes.TECH_ADMIN_HOMEPAGE;
  if (isSuperAdmin({ session })) return RelativeRoutes.SUPER_ADMIN_HOMEPAGE;
  if (isAdmin({ session })) return RelativeRoutes.ADMIN_HOMEPAGE;
  if (isMentor({ session })) return RelativeRoutes.MENTOR_HOMEPAGE;
  if (isMentee({ session })) return RelativeRoutes.MENTEE_HOMEPAGE;

  return null;
}

export function navItemType({ session }: { session: any }): {
  menteeOnly?: boolean;
  mentorOnly?: boolean;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
  techAdminOnly?: boolean;
  ceoOnly?: boolean;
} {
  if (isTechAdmin({ session })) return { techAdminOnly: true };
  if (isSuperAdmin({ session })) return { superAdminOnly: true };
  if (isOrdinaryAdmin({ session })) return { adminOnly: true };
  if (isMentor({ session })) return { mentorOnly: true };
  if (isMentee({ session })) return { menteeOnly: true };

  return {};
}
