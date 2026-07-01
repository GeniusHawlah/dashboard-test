"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { globalStore } from "@/store/zustand/globalStore";
import { VisuallyHidden } from "@radix-ui/themes";

export function GeneralLoadingModal() {
  const generalLoading = globalStore((state) => state.generalLoading);

  return (
    <Dialog open={generalLoading}>
      <DialogContent
        showCloseButton={false}
        className="
          bg-transparent
          rounded-md
          border-none
          shadow-none
          top-20
          left-1/2
          w-auto
          max-w-[calc(100vw-2rem)]
          -translate-x-1/2
          translate-y-0
          px-6
          
          sm:px-8
          
        "
      >
        <DialogTitle>
          <VisuallyHidden>Modal</VisuallyHidden>
        </DialogTitle>
        <DialogDescription>
          <VisuallyHidden>Loading dialog content.</VisuallyHidden>
        </DialogDescription>

        <div className="flex items-center justify-center overflow-hidden rounded-md bg-white px-6 py-4 sm:px-8">
          <p className="text-sm font-medium tracking-wide text-slate-600">
            Loading
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
