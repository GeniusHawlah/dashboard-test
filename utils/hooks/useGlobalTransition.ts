"use client";

import { globalStore } from "@/store/zustand/globalStore";
import { useEffect, useTransition } from "react";

export function useGlobalTransition() {
  const [isPending, startTransition] = useTransition();
  const setIsRouting = globalStore((s) => s.setIsRouting);

  useEffect(() => {
    setIsRouting(isPending);
  }, [isPending, setIsRouting]);

  return { isPending, startTransition };
}
