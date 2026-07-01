import { redirect } from "next/navigation";

import { RelativeRoutes } from "@/utils/enum";

export default function Home() {
  redirect(RelativeRoutes.LOGIN_PAGE);
}
