"use client";

import { TooltipHintIcon } from "@/components/ui/app-tooltip";
import { useLayoutEffect, useRef, useState } from "react";

export function TruncatedTooltipText({
  text,
  className = "",
  tooltipClassName = "",
}: {
  text: string;
  className?: string;
  tooltipClassName?: string;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useLayoutEffect(() => {
    const element = textRef.current;

    if (!element) return;

    const updateTooltipVisibility = () => {
      setShowTooltip(element.scrollWidth > element.clientWidth + 1);
    };

    updateTooltipVisibility();

    const resizeObserver = new ResizeObserver(updateTooltipVisibility);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [text]);

  return (
    <span className={["flex min-w-0 items-center gap-1", className].join(" ")}>
      <span ref={textRef} className="min-w-0 truncate">
        {text}
      </span>
      {showTooltip ? (
        <TooltipHintIcon
          content={text}
          className={tooltipClassName || "h-3.5 w-3.5 text-slate-400 hover:text-slate-700"}
        />
      ) : null}
    </span>
  );
}
