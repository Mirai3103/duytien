import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/lib/trpc";
import { useCompareStore } from "@/store/compare";
import { toast } from "sonner";
import { CompareProductCard } from "./CompareProductCard";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const trpc = useTRPC();
  const { variantIds, addVariantId, isVariantIdSelected } = useCompareStore();

  const limit = 12;

  // Search products
  const { data: productsData, isLoading } = useQuery(
    trpc.products.getProductsWithVariants.queryOptions({
      page,
      limit,
      keyword: keyword || undefined,
    })
  );

  const { data: totalData } = useQuery(
    trpc.products.countProducts.queryOptions({
      page,
      limit,
      keyword: keyword || undefined,
    })
  );

  const products = productsData || [];
  const total = totalData?.[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const handleAddProduct = (variantId: number) => {
    if (variantIds.length >= 3) {
      toast.error("Chỉ có thể so sánh tối đa 3 sản phẩm");
      return;
    }
    addVariantId(variantId);
    toast.success("Đã thêm sản phẩm vào danh sách so sánh");
  };

  const handleSearchChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Tìm kiếm sản phẩm để so sánh</DialogTitle>
          <DialogDescription>
            Tìm và chọn sản phẩm để thêm vào danh sách so sánh (Tối đa 3 sản
            phẩm)
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Selected Count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Đã chọn: {variantIds.length}/3 sản phẩm</span>
          <span>Tìm thấy: {total} sản phẩm</span>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Không tìm thấy sản phẩm nào
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => {
                if (
                  !product.variantsAggregate ||
                  product.variantsAggregate.length === 0
                ) {
                  return null;
                }

                // Check if any variant of this product is selected
                const isAnyVariantSelected = product.variantsAggregate.some(
                  (v: any) => isVariantIdSelected(v.id)
                );
                const canAdd = variantIds.length < 3 || isAnyVariantSelected;

                return (
                  <CompareProductCard
                    key={product.id}
                    product={product}
                    isSelected={isAnyVariantSelected}
                    canAdd={canAdd}
                    onAdd={handleAddProduct}
                    isVariantSelected={isVariantIdSelected}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </Button>
            <span className="text-sm text-muted-foreground">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
