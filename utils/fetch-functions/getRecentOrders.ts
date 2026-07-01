"use server";

import { logActionFailure, logActionSuccess } from "@/utils/ordinaryConsoleLogger";
import { cacheTag } from "next/cache";

export type RecentOrderStatus =
  | "active"
  | "pending"
  | "accepted"
  | "delivered"
  | "cancelled";

export interface RecentOrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  pickupLocation: string;
  destination: string;
  orderedAt: string;
  status: RecentOrderStatus;
  amount: number;
}

export interface RecentOrdersChartPoint {
  dateKey: string;
  label: string;
  orders: number;
}

export interface RecentOrdersMonthOption {
  value: string;
  label: string;
}

export interface RecentOrdersDashboardData {
  selectedMonth: string;
  selectedMonthLabel: string;
  monthOptions: RecentOrdersMonthOption[];
  summary: {
    totalOrders: number;
    activeOrders: number;
    pendingOrders: number;
    acceptedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    completionRate: number;
    totalValue: number;
  };
  chart: RecentOrdersChartPoint[];
  recentOrders: RecentOrderItem[];
}

export type RecentOrdersResponse =
  | {
      success: {
        message: string;
        data: RecentOrdersDashboardData;
      };
      error?: never;
    }
  | {
      error: {
        message: string;
        statusCode?: number;
      };
      success?: never;
    };

const RECENT_ORDER_DATA: RecentOrderItem[] = [
  {
    id: "ord_001",
    orderNumber: "ORDER001",
    customerName: "Raj Industries",
    pickupLocation: "41 Sector 15, Set, Delhi",
    destination: "G5, Shah Colony, Mumbai",
    orderedAt: "2026-07-17T08:40:00.000Z",
    status: "delivered",
    amount: 24500,
  },
  {
    id: "ord_002",
    orderNumber: "ORDER002",
    customerName: "Blue Ridge Trading",
    pickupLocation: "Lekki Phase 1, Lagos",
    destination: "Mushin Warehouse, Lagos",
    orderedAt: "2026-07-14T11:15:00.000Z",
    status: "active",
    amount: 18200,
  },
  {
    id: "ord_003",
    orderNumber: "ORDER003",
    customerName: "Northwind Cargo",
    pickupLocation: "Airport Road, Abuja",
    destination: "Port Harcourt Yard, Rivers",
    orderedAt: "2026-07-09T13:05:00.000Z",
    status: "pending",
    amount: 40250,
  },
  {
    id: "ord_004",
    orderNumber: "ORDER004",
    customerName: "Eko Supplies",
    pickupLocation: "Ikeja GRA, Lagos",
    destination: "Apapa Port, Lagos",
    orderedAt: "2026-07-04T09:25:00.000Z",
    status: "accepted",
    amount: 26300,
  },
  {
    id: "ord_005",
    orderNumber: "ORDER005",
    customerName: "Zion Retail",
    pickupLocation: "Wuse 2, Abuja",
    destination: "Aminu Kano Crescent, Abuja",
    orderedAt: "2026-06-28T10:55:00.000Z",
    status: "delivered",
    amount: 15700,
  },
  {
    id: "ord_006",
    orderNumber: "ORDER006",
    customerName: "Prime Haulage",
    pickupLocation: "Onitsha Main Market, Anambra",
    destination: "Mile 2, Lagos",
    orderedAt: "2026-06-22T15:45:00.000Z",
    status: "cancelled",
    amount: 19800,
  },
  {
    id: "ord_007",
    orderNumber: "ORDER007",
    customerName: "Greenline Farms",
    pickupLocation: "Sango-Ota, Ogun",
    destination: "Agege, Lagos",
    orderedAt: "2026-06-18T07:20:00.000Z",
    status: "active",
    amount: 22400,
  },
  {
    id: "ord_008",
    orderNumber: "ORDER008",
    customerName: "Metro Parts",
    pickupLocation: "Trade Fair, Lagos",
    destination: "Yaba, Lagos",
    orderedAt: "2026-05-29T12:10:00.000Z",
    status: "accepted",
    amount: 29100,
  },
  {
    id: "ord_009",
    orderNumber: "ORDER009",
    customerName: "Summit Foods",
    pickupLocation: "Oniru, Lagos",
    destination: "Benin City, Edo",
    orderedAt: "2026-05-21T14:30:00.000Z",
    status: "delivered",
    amount: 33400,
  },
  {
    id: "ord_010",
    orderNumber: "ORDER010",
    customerName: "Harbor Logistics",
    pickupLocation: "Tin Can Island, Lagos",
    destination: "Aba Industrial Layout, Abia",
    orderedAt: "2026-05-12T06:50:00.000Z",
    status: "pending",
    amount: 41300,
  },
  {
    id: "ord_011",
    orderNumber: "ORDER011",
    customerName: "Crown Mart",
    pickupLocation: "Victoria Island, Lagos",
    destination: "Gwarinpa, Abuja",
    orderedAt: "2026-04-30T10:05:00.000Z",
    status: "delivered",
    amount: 27100,
  },
  {
    id: "ord_012",
    orderNumber: "ORDER012",
    customerName: "Riverbend Traders",
    pickupLocation: "Maitama, Abuja",
    destination: "Uyo Town, Akwa Ibom",
    orderedAt: "2026-04-14T16:25:00.000Z",
    status: "cancelled",
    amount: 17600,
  },
  {
    id: "ord_013",
    orderNumber: "ORDER013",
    customerName: "Starlight Goods",
    pickupLocation: "Asaba, Delta",
    destination: "Enugu North, Enugu",
    orderedAt: "2026-03-27T08:15:00.000Z",
    status: "accepted",
    amount: 31800,
  },
  {
    id: "ord_014",
    orderNumber: "ORDER014",
    customerName: "Delta Freight",
    pickupLocation: "Warri, Delta",
    destination: "Lekki, Lagos",
    orderedAt: "2026-03-09T13:40:00.000Z",
    status: "active",
    amount: 28600,
  },
  {
    id: "ord_015",
    orderNumber: "ORDER015",
    customerName: "Urban Supply",
    pickupLocation: "Magodo, Lagos",
    destination: "Kaduna Central, Kaduna",
    orderedAt: "2026-02-20T12:30:00.000Z",
    status: "delivered",
    amount: 36250,
  },
  {
    id: "ord_016",
    orderNumber: "ORDER016",
    customerName: "Fresh Lane",
    pickupLocation: "Ikoyi, Lagos",
    destination: "Owerri, Imo",
    orderedAt: "2026-02-06T09:45:00.000Z",
    status: "pending",
    amount: 21400,
  },
];

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabelFromKey(value: string) {
  const [yearPart, monthPart] = value.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);

  if (!year || !month) return value;

  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dayLabel(date: Date) {
  return date.getDate().toString();
}

function statusLabel(status: RecentOrderStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function isValidMonthKey(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}$/.test(value));
}

function buildMonthOptions(data: RecentOrderItem[]): RecentOrdersMonthOption[] {
  const uniqueMonths = [...new Set(data.map((order) => monthKey(new Date(order.orderedAt))))];

  return uniqueMonths
    .sort((left, right) => right.localeCompare(left))
    .map((value) => ({ value, label: monthLabelFromKey(value) }));
}

function buildChartPoints(
  data: RecentOrderItem[],
  selectedMonth: string,
): RecentOrdersChartPoint[] {
  const [yearPart, monthPart] = selectedMonth.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  const maxDays = new Date(year, month, 0).getDate();
  const points = new Map<string, RecentOrdersChartPoint>();

  for (let day = 1; day <= maxDays; day += 1) {
    const date = new Date(year, month - 1, day);
    const key = dayKey(date);

    points.set(key, {
      dateKey: key,
      label: dayLabel(date),
      orders: 0,
    });
  }

  for (const order of data) {
    const date = new Date(order.orderedAt);
    if (monthKey(date) !== selectedMonth) continue;

    const key = dayKey(date);
    const point = points.get(key);

    if (point) {
      point.orders += 1;
    }
  }

  return [...points.values()];
}

function buildSummary(monthOrders: RecentOrderItem[]) {
  const summary = {
    totalOrders: 0,
    activeOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  };

  let totalValue = 0;

  for (const order of monthOrders) {
    summary.totalOrders += 1;
    totalValue += order.amount;

    switch (order.status) {
      case "active":
        summary.activeOrders += 1;
        break;
      case "pending":
        summary.pendingOrders += 1;
        break;
      case "accepted":
        summary.acceptedOrders += 1;
        break;
      case "delivered":
        summary.deliveredOrders += 1;
        break;
      case "cancelled":
        summary.cancelledOrders += 1;
        break;
    }
  }

  const completionRate = summary.totalOrders
    ? Math.round((summary.deliveredOrders / summary.totalOrders) * 1000) / 10
    : 0;

  return {
    ...summary,
    completionRate,
    totalValue,
  };
}

export async function getRecentOrders({
  month,
}: {
  month?: string;
}): Promise<RecentOrdersResponse> {
  "use cache";

  const monthOptions = buildMonthOptions(RECENT_ORDER_DATA);
  const selectedMonth =
    isValidMonthKey(month) && monthOptions.some((item) => item.value === month)
      ? month
      : monthOptions[0]?.value ?? monthKey(new Date());

  cacheTag(`getRecentOrders-${selectedMonth}`);

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In production, this is where the dashboard would call the orders API,
    // validate the response shape, and translate it into the section payload.
    // Example:
    //
    // const response = await fetch(`${process.env.API_BASE}/orders/recent?month=${selectedMonth}`);
    // if (!response.ok) {
    //   return { error: { message: "Unable to load recent orders" } };
    // }
    //
    // const payload = await response.json();
    // return { success: { message: "Recent orders fetched", data: payload } };

    const monthOrders = RECENT_ORDER_DATA.filter(
      (order) => monthKey(new Date(order.orderedAt)) === selectedMonth,
    ).sort(
      (left, right) =>
        new Date(right.orderedAt).getTime() - new Date(left.orderedAt).getTime(),
    );

    const summary = buildSummary(monthOrders);

    logActionSuccess({
      action: "getRecentOrders",
      message: "Recent orders fetched successfully.",
      context: {
        month: selectedMonth,
        totalOrders: summary.totalOrders,
      },
    });

    return {
      success: {
        message: "Recent orders fetched successfully.",
        data: {
          selectedMonth,
          selectedMonthLabel: monthLabelFromKey(selectedMonth),
          monthOptions,
          summary,
          chart: buildChartPoints(RECENT_ORDER_DATA, selectedMonth),
          recentOrders: monthOrders.slice(0, 5),
        },
      },
    };
  } catch (error) {
    logActionFailure({
      action: "getRecentOrders",
      message:
        error instanceof Error ? error.message : "Failed to load recent orders.",
      context: {
        month: selectedMonth,
      },
    });

    return {
      error: {
        message: "Failed to load recent orders.",
      },
    };
  }
}
