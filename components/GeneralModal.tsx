"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { globalStore } from "@/store/zustand/globalStore";
import { VisuallyHidden } from "@radix-ui/themes";
import { useEffect } from "react";

export interface GeneralModalProps {
  position?: string;
  size?: string;
  className?: string;
}

export function GeneralModal() {
  const modalIsOpen = globalStore((state) => state.modalIsOpen);
  const closeModal = globalStore((state) => state.closeModal);
  const content = globalStore((state) => state.content);
  const modalProps = globalStore((state) => state.modalProps);

  useEffect(() => {
    if (!modalIsOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalScrollbarGutter = document.body.style.scrollbarGutter;
    const handlePopState = () => {
      globalStore.setState({
        modalIsOpen: false,
        content: null,
        modalProps: {},
      });
    };

    document.body.style.scrollbarGutter = "stable";
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.body.style.overflow = originalOverflow;
      document.body.style.scrollbarGutter = originalScrollbarGutter;
    };
  }, [modalIsOpen]);

  return (
    <Dialog open={modalIsOpen} onOpenChange={closeModal}>
      <DialogContent
        className={`
          p-0!
          font-inter!
          border-none
          bg-transparent
          shadow-none
          max-w-[calc(100vw-0.75rem)]
          sm:max-w-[calc(100vw-2rem)]
         
          ${mapModalSize(modalProps?.size)}
          ${mapModalPosition(modalProps?.position)}
          ${modalProps?.className ?? ""}
        `}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            closeModal();
          }
        }}
        onPointerDownOutside={() => closeModal()}
        onInteractOutside={() => closeModal()}
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>Modal</DialogTitle>
          <DialogDescription>General modal dialog content.</DialogDescription>
        </VisuallyHidden>

        {content}
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- helpers ---------------- */

function mapModalSize(size?: string) {
  switch (size) {
    case "xs":
      return "max-w-xs";
    case "sm":
      return "max-w-sm";
    case "md":
      return "max-w-md";
    case "lg":
      return "max-w-lg";
    case "xl":
      return "max-w-xl";
    case "2xl":
      return "max-w-2xl";
    case "3xl":
      return "max-w-3xl";
    case "4xl":
      return "max-w-4xl";
    case "5xl":
      return "max-w-5xl";
    case "6xl":
      return "max-w-6xl";
    case "7xl":
      return "max-w-7xl";
    default:
      return "max-w-md";
  }
}

function mapModalPosition(position?: string) {
  switch (position) {
    case "top-left":
      return "items-start justify-start";
    case "top-center":
      return "items-start justify-center";
    case "top-right":
      return "items-start justify-end";
    case "center-left":
      return "items-center justify-start";
    case "center":
      return "items-center justify-center";
    case "center-right":
      return "items-center justify-end";
    case "bottom-left":
      return "items-end justify-start";
    case "bottom-center":
      return "items-end justify-center";
    case "bottom-right":
      return "items-end justify-end";
    default:
      return "items-center justify-center";
  }
}
