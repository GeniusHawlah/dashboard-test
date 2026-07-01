"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DASHBOARD_SCROLL_CONTAINER_ID = "dashboard-content-scroll-container";

function PaginationButtons({
  currentPage,
  numOfPages,
  handlePagination,
}: {
  currentPage: number;
  numOfPages: number;
  handlePagination: (value: number) => void;
}) {
  const maxVisible = 5;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), numOfPages);
  const halfWindow = Math.floor(maxVisible / 2);
  const start = Math.max(
    1,
    Math.min(safeCurrentPage - halfWindow, numOfPages - maxVisible + 1),
  );
  const end = Math.min(numOfPages, start + maxVisible - 1);

  function handlePageChange(page: number) {
    const scrollContainer = document.getElementById(
      DASHBOARD_SCROLL_CONTAINER_ID,
    );

    scrollContainer?.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    handlePagination(page);
  }

  return (
    <div>
      {numOfPages > 1 && (
        <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground sm:text-sm">
            Page {safeCurrentPage} of {numOfPages}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:justify-end sm:gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              disabled={safeCurrentPage === 1}
              onClick={() => handlePageChange(1)}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              disabled={safeCurrentPage === 1}
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
              (p) => (
                <Button
                  key={p}
                  size="icon-sm"
                  variant={p === safeCurrentPage ? "default" : "outline"}
                  className="h-8 min-w-8 px-0 text-[11px] sm:h-9 sm:min-w-9 sm:text-xs"
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </Button>
              ),
            )}

            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              disabled={safeCurrentPage === numOfPages}
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              disabled={safeCurrentPage === numOfPages}
              onClick={() => handlePageChange(numOfPages)}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaginationButtons;
