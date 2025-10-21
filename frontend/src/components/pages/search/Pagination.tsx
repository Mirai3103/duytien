import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <div className="flex justify-center items-center gap-2">
      <PaginationButton
        direction="prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {pageNumbers.map((page, index) =>
        page === -1 ? (
          <Ellipsis key={`ellipsis-${index}`} />
        ) : (
          <PageButton
            key={page}
            page={page}
            isActive={currentPage === page}
            onClick={() => onPageChange(page)}
          />
        )
      )}

      <PaginationButton
        direction="next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </div>
  );
}

function generatePageNumbers(
  currentPage: number,
  totalPages: number
): number[] {
  const pageNumbers: number[] = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow + 2) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  pageNumbers.push(1);

  if (currentPage > 3) {
    pageNumbers.push(-1); // Ellipsis
  }

  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 3) {
    start = 2;
    end = 4;
  }
  if (currentPage >= totalPages - 2) {
    start = totalPages - 3;
    end = totalPages - 1;
  }

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  if (currentPage < totalPages - 2) {
    pageNumbers.push(-1); // Ellipsis
  }

  pageNumbers.push(totalPages);

  return pageNumbers;
}

interface PaginationButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}

function PaginationButton({
  direction,
  onClick,
  disabled,
}: PaginationButtonProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <Button variant="outline" size="icon" onClick={onClick} disabled={disabled}>
      <Icon className="h-4 w-4" />
    </Button>
  );
}

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

function PageButton({ page, isActive, onClick }: PageButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      onClick={onClick}
    >
      {page}
    </Button>
  );
}

function Ellipsis() {
  return <span className="px-1 text-muted-foreground">...</span>;
}
