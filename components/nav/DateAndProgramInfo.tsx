import { getNavbarProgramInfo } from "@/utils/fetch-functions/getNavbarProgramInfo";
import { getCachedSession } from "@/utils/getCachedSession";
import { UserRole } from "@/utils/prisma";
import DateAndProgramInfoPanel from "./DateAndProgramInfoPanel";

export default async function DateAndProgramInfo() {
  const session = await getCachedSession();
  const info = await getNavbarProgramInfo({
    userId: session?.user?.id,
    userRole: session?.user?.role as UserRole | undefined,
  });

  return <DateAndProgramInfoPanel {...info} />;
}
