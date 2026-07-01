export function formatTitledName(
  user?: { title?: string | null; name?: string | null } | null,
  fallback = "-",
): string {
  const title = user?.title?.trim();
  const name = user?.name?.trim();

  if (!name) return fallback;
  if (!title) return name;

  if (name.toLowerCase().startsWith(title.toLowerCase())) {
    return name;
  }

  return `${title} ${name}`;
}

export function capitalizeFirstLetter(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return "";

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function toTitleCase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type FormatNairaOptions = {
  showDecimals?: boolean;
  decimals?: number;
  fallback?: string;
  compact?: boolean;
};

export function formatDate(dateInput: any): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "-";
  }

  const monthShort = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  const getOrdinal = (n: number): string => {
    const remainder10 = n % 10;
    const remainder100 = n % 100;

    if (remainder10 === 1 && remainder100 !== 11) return `${n}st`;
    if (remainder10 === 2 && remainder100 !== 12) return `${n}nd`;
    if (remainder10 === 3 && remainder100 !== 13) return `${n}rd`;
    return `${n}th`;
  };

  return `${monthShort}. ${getOrdinal(day)}, ${year}`;
}

export function formatDateTime(dateInput: any): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "-";
  }

  return `${formatDate(date)}, ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

export function formatProgramDuration(
  startsAt?: string | Date | null,
  endsAt?: string | Date | null,
): string {
  const startDate =
    typeof startsAt === "string" ? new Date(startsAt) : startsAt ?? null;
  const endDate = typeof endsAt === "string" ? new Date(endsAt) : endsAt ?? null;

  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    return "Duration pending";
  }

  if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
    return "Duration pending";
  }

  const totalDays = Math.max(
    0,
    Math.round((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)),
  );
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  const weekLabel = weeks === 1 ? "week" : "weeks";
  const dayLabel = days === 1 ? "day" : "days";

  if (weeks > 0 && days > 0) {
    return `${weeks} ${weekLabel} ${days} ${dayLabel}`;
  }

  if (weeks > 0) {
    return `${weeks} ${weekLabel}`;
  }

  if (days === 0) {
    return "0 days";
  }

  return `${days} ${dayLabel}`;
}

export function slugifyProgramText(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildProgramSlug(params: {
  name?: string | null;
  cohort?: string | null;
}) {
  const name = params.name?.trim();
  const cohort = params.cohort?.trim();

  if (!name || !cohort) {
    return "";
  }

  const titleSlug = slugifyProgramText(name);
  const cohortSlug = slugifyProgramText(cohort);

  return titleSlug && cohortSlug ? `${titleSlug}--${cohortSlug}` : "";
}

export function buildProgramHref(params: {
  name?: string | null;
  cohort?: string | null;
}) {
  const slug = buildProgramSlug(params);

  return slug ? `/programs/${slug}` : "/programs";
}

export function formatOrdinalNumber(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";

  const remainder10 = value % 10;
  const remainder100 = value % 100;

  if (remainder10 === 1 && remainder100 !== 11) return `${value}st`;
  if (remainder10 === 2 && remainder100 !== 12) return `${value}nd`;
  if (remainder10 === 3 && remainder100 !== 13) return `${value}rd`;
  return `${value}th`;
}

export function formatPercentage(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";

  return `${value}%`;
}

export function formatNaira(
  value: number | string | null | undefined,
  options: FormatNairaOptions = {},
): string {
  const { decimals = 2, fallback = "\u20A60", compact = false } = options;
  const showDecimals = compact
    ? (options.showDecimals ?? true)
    : (options.showDecimals ?? false);

  if (value === null || value === undefined) return fallback;

  const numericValue = typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(numericValue)) return fallback;
  if (!Number.isFinite(numericValue)) return fallback;

  if (compact) {
    return formatCompactNaira(numericValue, showDecimals, decimals);
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: showDecimals ? decimals : 0,
    maximumFractionDigits: showDecimals ? decimals : 0,
  }).format(numericValue);
}

function formatCompactNaira(
  value: number,
  showDecimals: boolean,
  decimals: number,
): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  const format = (num: number) => {
    if (!showDecimals) return Math.round(num).toString();
    const fixed = num.toFixed(decimals);
    return fixed.replace(/\.?0+$/, "");
  };

  if (abs >= 1_000_000_000) {
    return `${sign}\u20A6${format(abs / 1_000_000_000)}B`;
  }

  if (abs >= 1_000_000) {
    return `${sign}\u20A6${format(abs / 1_000_000)}M`;
  }

  if (abs >= 1_000) {
    return `${sign}\u20A6${format(abs / 1_000)}K`;
  }

  return `${sign}\u20A6${format(abs)}`;
}

export function buildQueryString(queryParams: { [key: string]: any }) {
  return queryParams
    ? "?" +
        Object.entries(queryParams)
          .filter(([, value]) => Boolean(value))
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
          )
          .join("&")
    : "";
}

export function truncateWithEllipses(
  text: string | undefined,
  limit: number,
): string {
  if (!text) return "";

  if (text.length <= limit) return text;

  const trimmed = text.slice(0, limit);
  const lastSpace = trimmed.lastIndexOf(" ");
  const cutText = lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed;

  return cutText + "...";
}
