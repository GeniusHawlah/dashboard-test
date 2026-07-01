"use client";

import type { RecentOrdersDashboardData } from "@/utils/fetch-functions/getRecentOrders";
import LoadingOverlay from "@/components/LoadingOverlay";
import { globalStore } from "@/store/zustand/globalStore";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

const STATUS_STYLES: Record<
  "active" | "pending" | "accepted" | "delivered" | "cancelled",
  string
> = {
  active: "bg-sky-50 text-sky-700",
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-emerald-50 text-emerald-700",
  delivered: "bg-blue-50 text-blue-700",
  cancelled: "bg-rose-50 text-rose-700",
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function statusLabel(status: keyof typeof STATUS_STYLES) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export default function RecentOrdersSection({
  data,
}: {
  data: RecentOrdersDashboardData;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const setIsRouting = globalStore((state) => state.setIsRouting);

  useEffect(() => {
    setIsRouting(isPending);
  }, [isPending, setIsRouting]);

  const chartData = {
    labels: data.chart.map((point) => point.label),
    datasets: [
      {
        label: "Orders",
        data: data.chart.map((point) => point.orders),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.08)",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: "#eef2f7" },
        ticks: { color: "#64748b", font: { size: 10 } },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#64748b", font: { size: 10 }, precision: 0 },
        grid: { color: "#eef2f7" },
      },
    },
  };

  function handleMonthChange(nextMonth: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextMonth) {
      params.set("month", nextMonth);
    } else {
      params.delete("month");
    }

    const nextQuery = params.toString();
    startTransition(() => {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    });
  }

  return (
    <section className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
      {isPending ? <LoadingOverlay /> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">Recent Orders</p>
          <p className="mt-1 text-xs text-slate-500">
            {data.selectedMonthLabel} view
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={data.selectedMonth}
            onChange={(event) => handleMonthChange(event.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-slate-300"
          >
            {data.monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-2.5">
          <MetricCard label="Active Orders" value={data.summary.activeOrders} />
          <MetricCard
            label="Pending Requests"
            value={data.summary.pendingOrders}
          />
          <MetricCard
            label="Accepted Orders"
            value={data.summary.acceptedOrders}
          />
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
              Completion Rate
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-950">
              {data.summary.completionRate}%
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {data.summary.deliveredOrders} delivered out of{" "}
              {data.summary.totalOrders} orders.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                Activity graph
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                Order flow for {data.selectedMonthLabel}
              </p>
            </div>
            <div className="rounded-full bg-white px-2.5 py-1 text-[11px] text-slate-500 shadow-sm">
              {data.summary.totalOrders} orders
            </div>
          </div>

          <div className="mt-3 h-48 w-full lg:h-56">
            <Line data={chartData} options={options} />
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                Delivered
              </p>
              <p className="mt-1 text-base font-semibold text-slate-950">
                {data.summary.deliveredOrders}
              </p>
            </div>
            <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                Cancelled
              </p>
              <p className="mt-1 text-base font-semibold text-slate-950">
                {data.summary.cancelledOrders}
              </p>
            </div>
            <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                Total Value
              </p>
              <p className="mt-1 text-base font-semibold text-slate-950">
                {formatAmount(data.summary.totalValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {data.recentOrders.slice(0, 3).map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-2 rounded-xl bg-slate-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-950">
                {order.orderNumber}
              </p>
              <p className="truncate text-xs text-slate-500">
                {order.customerName} - {order.pickupLocation}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{formatAmount(order.amount)}</span>
              <span className="text-slate-300">-</span>
              <span>
                {new Date(order.orderedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[order.status]}`}
              >
                {statusLabel(order.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
