import { UserStatus } from "@/utils/prisma";

type UserStatusInput = UserStatus | string | null | undefined;

export const STAFF_FILTER_USER_STATUSES: UserStatus[] = [
  UserStatus.ACTIVE,
  UserStatus.INACTIVE,
  UserStatus.SUSPENDED,
  UserStatus.RESIGNED,
  UserStatus.SACKED,
];

export const MENTEE_FILTER_USER_STATUSES: UserStatus[] = [
  UserStatus.UNAPPROVED,
  UserStatus.ACTIVE,
  UserStatus.INACTIVE,
  UserStatus.SUSPENDED,
];

export const STUDENT_FILTER_USER_STATUSES: UserStatus[] = [
  UserStatus.ACTIVE,
  UserStatus.INACTIVE,
  UserStatus.SUSPENDED,
  UserStatus.UNAPPROVED,
];

export const MENTEE_STATUS_UPDATE_STATUSES: UserStatus[] = [
  UserStatus.UNAPPROVED,
  UserStatus.ACTIVE,
  UserStatus.INACTIVE,
  UserStatus.SUSPENDED,
];

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
  UNAPPROVED: "Unapproved",
  RESIGNED: "Resigned",
  SACKED: "Sacked",
};

const USER_STATUS_BADGE_CLASSES: Record<UserStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-red-100 text-red-700",
  SUSPENDED: "bg-amber-100 text-amber-700",
  UNAPPROVED: "bg-slate-100 text-slate-700",
  RESIGNED: "bg-zinc-100 text-zinc-700",
  SACKED: "bg-red-100 text-red-700",
};

function toUserStatus(status: UserStatusInput): UserStatus | null {
  if (!status) return null;
  return status in USER_STATUS_LABELS ? (status as UserStatus) : null;
}

export function formatUserStatus(status: UserStatusInput) {
  const userStatus = toUserStatus(status);
  return userStatus ? USER_STATUS_LABELS[userStatus] : "Unknown";
}

export function userStatusBadgeClass(status: UserStatusInput) {
  const userStatus = toUserStatus(status);
  return userStatus
    ? USER_STATUS_BADGE_CLASSES[userStatus]
    : "bg-slate-100 text-slate-700";
}
