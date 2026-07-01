"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SuggestionInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange"
> & {
  value: string;
  suggestions: readonly string[];
  onValueChange: (value: string) => void;
  maxSuggestions?: number;
};

function normalizeSuggestionValue(value: string) {
  return value.trim().toLowerCase();
}

function scoreSuggestion(suggestion: string, query: string) {
  const normalizedSuggestion = normalizeSuggestionValue(suggestion);
  const normalizedQuery = normalizeSuggestionValue(query);

  if (normalizedSuggestion.startsWith(normalizedQuery)) {
    return 0;
  }

  if (
    normalizedSuggestion
      .split(/[\s./_-]+/)
      .some((word) => word.startsWith(normalizedQuery))
  ) {
    return 1;
  }

  if (normalizedSuggestion.includes(normalizedQuery)) {
    return 2;
  }

  return -1;
}

function getSuggestionMatches(
  suggestions: readonly string[],
  value: string,
  maxSuggestions: number,
) {
  const query = normalizeSuggestionValue(value);

  if (!query) {
    return [];
  }

  const seen = new Set<string>();

  return suggestions
    .map((suggestion, index) => ({
      suggestion,
      index,
      score: scoreSuggestion(suggestion, query),
    }))
    .filter(({ suggestion, score }) => {
      const normalizedSuggestion = normalizeSuggestionValue(suggestion);
      const isVisible = score >= 0 && normalizedSuggestion !== query;

      if (!isVisible || seen.has(normalizedSuggestion)) {
        return false;
      }

      seen.add(normalizedSuggestion);
      return true;
    })
    .sort(
      (first, second) => first.score - second.score || first.index - second.index,
    )
    .slice(0, maxSuggestions)
    .map(({ suggestion }) => suggestion);
}

function SuggestionInput({
  value,
  suggestions,
  onValueChange,
  maxSuggestions = 6,
  className,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: SuggestionInputProps) {
  const listboxId = React.useId();
  const [isFocused, setIsFocused] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const matches = React.useMemo(
    () => getSuggestionMatches(suggestions, value, maxSuggestions),
    [maxSuggestions, suggestions, value],
  );
  const showSuggestions = isFocused && matches.length > 0;

  React.useEffect(() => {
    setActiveIndex(0);
  }, [value, matches.length]);

  function selectSuggestion(suggestion: string) {
    onValueChange(suggestion);
    setIsFocused(false);
  }

  return (
    <div className="relative">
      <Input
        {...props}
        value={value}
        onChange={(event) => {
          setIsFocused(true);
          onValueChange(event.target.value);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        onKeyDown={(event) => {
          if (showSuggestions && event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((current) => (current + 1) % matches.length);
          }

          if (showSuggestions && event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex(
              (current) => (current - 1 + matches.length) % matches.length,
            );
          }

          if (showSuggestions && event.key === "Enter") {
            event.preventDefault();
            const selectedSuggestion = matches[activeIndex] ?? matches[0];

            if (selectedSuggestion) {
              selectSuggestion(selectedSuggestion);
            }
          }

          if (showSuggestions && event.key === "Escape") {
            event.preventDefault();
            setIsFocused(false);
          }

          onKeyDown?.(event);
        }}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-controls={showSuggestions ? listboxId : undefined}
        aria-activedescendant={
          showSuggestions ? `${listboxId}-${activeIndex}` : undefined
        }
        className={className}
      />

      {showSuggestions && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-[calc(100%+0.25rem)] left-0 z-50 max-h-52 w-full overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg shadow-slate-950/10"
        >
          {matches.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              id={`${listboxId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onPointerDown={(event) => {
                event.preventDefault();
                selectSuggestion(suggestion);
              }}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "flex w-full cursor-pointer items-center rounded px-2.5 py-2 text-left text-xs text-slate-700 transition sm:text-sm",
                index === activeIndex
                  ? "bg-slate-100 text-slate-950"
                  : "hover:bg-slate-50",
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { SuggestionInput };
