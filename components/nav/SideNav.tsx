import { DASHBOARD_NAV_ITEMS } from "@/utils/constants";
import { getCachedSession } from "@/utils/getCachedSession";
import { NavItemsInterface } from "@/utils/types";
import SideNavContent from "./SideNavContent";

async function SideNav() {
  await getCachedSession();

  const navItems: NavItemsInterface[] = DASHBOARD_NAV_ITEMS;

  return <SideNavContent navItems={navItems} />;
}

export default SideNav;
