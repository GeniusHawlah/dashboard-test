"use client";

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import { ReactNode, useState } from "react";

export function AppTooltip({
  content,
  children,
  className,
  triggerClassName,
  contentClassName,
  disabled = false,
  enableHover = true,
  enableFocus = true,
  enableClick = true,
}: {
  content?: ReactNode;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  enableHover?: boolean;
  enableFocus?: boolean;
  enableClick?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: disabled || !content ? false : open,
    onOpenChange: setOpen,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [offset(10), flip({ padding: 12 }), shift({ padding: 12 })],
  });

  const hover = useHover(context, {
    move: false,
    enabled: !disabled && Boolean(content) && enableHover,
  });
  const focus = useFocus(context, {
    enabled: !disabled && Boolean(content) && enableFocus,
  });
  const click = useClick(context, {
    enabled: !disabled && Boolean(content) && enableClick,
    ignoreMouse: enableHover,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    click,
    dismiss,
    role,
  ]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span
        ref={refs.setReference}
        className={cn("inline-flex items-center", triggerClassName)}
        {...getReferenceProps({ tabIndex: 0 })}
      >
        {children}
      </span>

      {!disabled && content && open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={cn(
              "z-[120] max-w-72 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs leading-5 text-white shadow-xl",
              contentClassName,
            )}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </span>
  );
}

export function TooltipHintIcon({
  content,
  className,
}: {
  content?: ReactNode;
  className?: string;
}) {
  if (!content) return null;

  return (
    <AppTooltip
      content={content}
      triggerClassName="shrink-0"
      enableHover={false}
      enableFocus={false}
    >
      <button
        type="button"
        className={cn(
          "inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
          className,
        )}
        aria-label="Show more information"
      >
        <CircleAlert className="h-3.5 w-3.5" />
      </button>
    </AppTooltip>
  );
}

export function TooltipLabel({
  label,
  content,
  className,
}: {
  label: string;
  content?: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span>{label}</span>
      <TooltipHintIcon content={content} />
    </span>
  );
}
