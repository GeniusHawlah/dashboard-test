import { getCachedSession } from "@/utils/getCachedSession";
import LandingNavbarMobileNav from "./LandingNavbarMobileNav";

export default async function LandingNavbarMobileNavWrapper() {
  const session = await getCachedSession();

  return <LandingNavbarMobileNav session={session} />;
}
