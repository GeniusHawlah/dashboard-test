"use client";

import * as React from "react";
import { Icon } from "@iconify-icon/react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TagListInputProps = {
  label: string;
  value: string[];
  suggestions: readonly string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  description?: string;
  className?: string;
};

function normalizeTagValue(value: string) {
  return value.trim().toLowerCase();
}

function scoreSuggestion(suggestion: string, query: string) {
  const normalizedSuggestion = normalizeTagValue(suggestion);
  const normalizedQuery = normalizeTagValue(query);

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
  const query = normalizeTagValue(value);

  if (!query) return [];

  const seen = new Set<string>();

  return suggestions
    .map((suggestion, index) => ({
      suggestion,
      index,
      score: scoreSuggestion(suggestion, query),
    }))
    .filter(({ suggestion, score }) => {
      const normalizedSuggestion = normalizeTagValue(suggestion);
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

function TagListInput({
  label,
  value,
  suggestions,
  onValueChange,
  placeholder,
  description,
  className,
}: TagListInputProps) {
  const listboxId = React.useId();
  const [draft, setDraft] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const matches = React.useMemo(
    () => getSuggestionMatches(suggestions, draft, 6),
    [draft, suggestions],
  );
  const showSuggestions = isFocused && matches.length > 0;

  React.useEffect(() => {
    setActiveIndex(0);
  }, [draft, matches.length]);

  function addTag(nextValue: string) {
    const normalized = nextValue.trim();

    if (!normalized) return;

    const existing = new Set(value.map((item) => normalizeTagValue(item)));
    if (existing.has(normalizeTagValue(normalized))) {
      setDraft("");
      return;
    }

    onValueChange([...value, normalized]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onValueChange(value.filter((item) => normalizeTagValue(item) !== normalizeTagValue(tag)));
  }

  function selectSuggestion(suggestion: string) {
    addTag(suggestion);
    setIsFocused(false);
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-medium sm:text-sm">{label}</label>
        {description ? (
          <p className="text-[11px] text-slate-500">{description}</p>
        ) : null}
      </div>

      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300 focus-within:border-slate-300">
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                aria-label={`Remove ${tag}`}
              >
                <Icon icon="mdi:close" className="text-[11px]" />
              </button>
            </span>
          ))}
        </div>

        <div className="relative mt-2">
          <Input
            value={draft}
            onChange={(event) => {
              setIsFocused(true);
              setDraft(event.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(event) => {
              if (showSuggestions && event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((current) => (current + 1) % matches.length);
                return;
              }

              if (showSuggestions && event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex(
                  (current) => (current - 1 + matches.length) % matches.length,
                );
                return;
              }

              if (event.key === "Enter") {
                event.preventDefault();
                const selectedSuggestion = matches[activeIndex] ?? draft;
                addTag(selectedSuggestion);
                return;
              }

              if (event.key === ",") {
                event.preventDefault();
                addTag(draft);
              }
            }}
            placeholder={placeholder}
            className="h-9 border-0 px-0 text-xs shadow-none focus-visible:ring-0 sm:text-sm"
          />

          {showSuggestions ? (
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
                  onMouseDown={(event) => {
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
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { TagListInput };
