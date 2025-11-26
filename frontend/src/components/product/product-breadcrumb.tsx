import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbProps {
  categoryName?: string;
  brandName?: string;
  productName: string;
}

export function ProductBreadcrumb({
  categoryName,
  brandName,
  productName,
}: ProductBreadcrumbProps) {
  return (
    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground mb-3 md:mb-6 overflow-x-auto pb-2 scrollbar-hide">
      <span className="hover:text-primary cursor-pointer whitespace-nowrap">Trang chủ</span>
      {categoryName && (
        <>
          <ChevronRight className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
          <span className="hover:text-primary cursor-pointer whitespace-nowrap">
            {categoryName}
          </span>
        </>
      )}
      {brandName && (
        <>
          <ChevronRight className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
          <span className="hover:text-primary cursor-pointer whitespace-nowrap">{brandName}</span>
        </>
      )}
      <ChevronRight className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
      <span className="text-foreground truncate max-w-[200px] md:max-w-none">{productName}</span>
    </div>
  );
}

