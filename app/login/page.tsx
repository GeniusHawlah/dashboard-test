import { redirect } from "next/navigation";

import { RelativeRoutes } from "@/utils/enum";

export default function LoginPage() {
  redirect(RelativeRoutes.HOMEPAGE);
}
