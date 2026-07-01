type StatusTone = "blue" | "emerald" | "amber" | "slate" | "rose";

export type ProgramStatusDescriptor = {
  label: string;
  tone: StatusTone;
};

export const statusPillToneClasses: Record<StatusTone, string> = {
  blue: "border-sky-500 bg-sky-500 text-white",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  slate: "border-slate-200 bg-slate-100 text-slate-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
};

function toDate(value?: string | Date | null) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getRegistrationStatus(
  applicationOpensAt?: string | Date | null,
  applicationClosesAt?: string | Date | null,
  now = new Date(),
): ProgramStatusDescriptor {
  const opensAt = toDate(applicationOpensAt);
  const closesAt = toDate(applicationClosesAt);

  if (opensAt && now < opensAt) {
    return { label: "Reg. Upcoming", tone: "amber" };
  }

  if (closesAt && now > closesAt) {
    return { label: "Reg. Closed", tone: "slate" };
  }

  if (opensAt || closesAt) {
    return { label: "Reg. Ongoing", tone: "blue" };
  }

  return { label: "Reg. Ongoing", tone: "blue" };
}

export function getProgramStatus(
  startsAt?: string | Date | null,
  endsAt?: string | Date | null,
  now = new Date(),
): ProgramStatusDescriptor {
  const programStartsAt = toDate(startsAt);
  const programEndsAt = toDate(endsAt);

  if (programEndsAt && now > programEndsAt) {
    return { label: "Program Ended", tone: "rose" };
  }

  if (!programStartsAt || now < programStartsAt) {
    return { label: "Program Upcoming", tone: "amber" };
  }

  return { label: "Program Ongoing", tone: "emerald" };
}

export function getLiveStatus(
  startsAt?: string | Date | null,
  endsAt?: string | Date | null,
  now = new Date(),
): ProgramStatusDescriptor {
  const programStartsAt = toDate(startsAt);
  const programEndsAt = toDate(endsAt);

  if (programEndsAt && now > programEndsAt) {
    return { label: "Ended", tone: "rose" };
  }

  if (!programStartsAt || now < programStartsAt) {
    return { label: "Upcoming", tone: "amber" };
  }

  return { label: "Ongoing", tone: "emerald" };
}
