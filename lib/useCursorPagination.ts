"use client";

import { useState } from "react";

export function useCursorPagination() {
  const [page, setPage] = useState(1);
  const [cursorMap, setCursorMap] = useState<Record<number, string | null>>({});

  const saveNextCursor = (pageNumber: number, cursor: string | null) => {
    setCursorMap((prev) => ({ ...prev, [pageNumber]: cursor }));
  };

  const getCursorForPage = (pageNumber: number) => {
    return cursorMap[pageNumber] || null;
  };

  const hasNext = (pageNumber: number) => {
    return cursorMap[pageNumber] !== null;
  };

  const hasPrevious = (pageNumber: number) => {
    return pageNumber > 1;
  };

  return {
    page,
    setPage,
    saveNextCursor,
    getCursorForPage,
    hasPrevious: hasPrevious(page),
    hasNext: hasNext(page),
  };
}
