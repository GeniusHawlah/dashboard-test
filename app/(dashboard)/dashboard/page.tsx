import { Suspense } from "react";
import RecentOrdersSkeleton from "./(components)/RecentOrdersSkeleton";
import RecentOrdersWrapper from "./(components)/RecentOrdersWrapper";

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return (
    <section className="space-y-4">
      <Suspense fallback={<RecentOrdersSkeleton />}>
        <RecentOrdersWrapper searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
