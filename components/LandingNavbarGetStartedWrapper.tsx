import { getCachedSession } from "@/utils/getCachedSession";
import LandingNavbarGetStarted from "./LandingNavbarGetStarted";

export default async function LandingNavbarGetStartedWrapper() {
  const session = await getCachedSession();

  return <>{!session && <LandingNavbarGetStarted />}</>;
}
