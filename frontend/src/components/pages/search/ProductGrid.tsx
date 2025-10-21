import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "./ProductCard";
import { Pagination } from "./Pagination";
import type { GetProductsWithVariantsResponse } from "@/types/backend/trpc/routes/products.route";

interface ProductGridProps {
  products: GetProductsWithVariantsResponse;
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export function ProductGrid({
  products,
  total,
  currentPage,
  totalPages,
  onPageChange,
  onClearFilters,
}: ProductGridProps) {
  return (
    <div className="flex-1">
      <div className="mb-4 text-sm text-muted-foreground">
        Tìm thấy {total} sản phẩm
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState onClearFilters={onClearFilters} />
      )}
    </div>
  );
}

interface EmptyStateProps {
  onClearFilters: () => void;
}

function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground text-lg">
        Không tìm thấy sản phẩm phù hợp
      </p>
      <Button onClick={onClearFilters} variant="outline" className="mt-4">
        Xóa bộ lọc
      </Button>
    </div>
  );
}

interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 10 }: ProductGridSkeletonProps) {
  return (
    <div className="flex-1">
      <Skeleton className="h-5 w-32 mb-4" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        {/* Image skeleton */}
        <Skeleton className="w-full aspect-square mb-3" />

        {/* Title skeleton (2 lines) */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-3" />

        {/* Price skeleton */}
        <Skeleton className="h-6 w-24 mb-3" />

        {/* Variant options skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 mb-1" />
          <div className="flex gap-1">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
