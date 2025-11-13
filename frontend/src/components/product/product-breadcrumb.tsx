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
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <span className="hover:text-primary cursor-pointer">Trang chủ</span>
      {categoryName && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-primary cursor-pointer">
            {categoryName}
          </span>
        </>
      )}
      {brandName && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-primary cursor-pointer">{brandName}</span>
        </>
      )}
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground">{productName}</span>
    </div>
  );
}

