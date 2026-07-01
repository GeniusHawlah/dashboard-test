import { getCachedSession } from "@/utils/getCachedSession";
import LandingNavbarUserMenu from "./LandingNavbarUserMenu";

export default async function LandingNavbarUserMenuWrapper() {
  const session = await getCachedSession();

  return <>{session && <LandingNavbarUserMenu session={session} />}</>;
}
