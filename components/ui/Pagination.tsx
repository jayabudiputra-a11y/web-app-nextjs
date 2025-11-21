"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-2 border rounded disabled:opacity-40"
      >
        Previous
      </button>

      <span className="text-sm font-medium">{currentPage} / {totalPages}</span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-2 border rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
