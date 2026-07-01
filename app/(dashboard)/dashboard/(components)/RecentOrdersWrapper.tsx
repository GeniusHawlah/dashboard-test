import { getRecentOrders } from "@/utils/fetch-functions/getRecentOrders";
import RecentOrdersSection from "./RecentOrdersSection";

export default async function RecentOrdersWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const query = await searchParams;
  const recentOrdersResponse = await getRecentOrders({
    month: query.month,
  });

  if (!recentOrdersResponse.success) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
        <p className="text-sm font-semibold text-slate-950">Recent Orders</p>
        <p className="mt-2 text-sm text-slate-500">
          {recentOrdersResponse.error.message}
        </p>
      </section>
    );
  }

  return <RecentOrdersSection data={recentOrdersResponse.success.data} />;
}
