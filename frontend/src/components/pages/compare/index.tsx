import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { X, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTRPC } from "@/lib/trpc";
import { useCompareStore } from "@/store/compare";
import { SearchModal } from "./SearchModal";
import { ComparisonTable } from "./ComparisonTable";
import _ from "lodash";

const CompareProducts = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { variantIds, removeVariantId, clearVariantIds } = useCompareStore();
  const trpc = useTRPC();
  const navigate = useNavigate();

  // Fetch variant details for all selected variants
  const variantQueries = useQueries({
    queries: variantIds.map((id) =>
      trpc.variants.getVariantDetail.queryOptions(id)
    ),
  });

  const productQueries = useQueries({
    queries: variantQueries
      .map((q) => q.data?.productId)
      .filter((id): id is number => id !== undefined)
      .map((productId) =>
        trpc.products.getProductDetail.queryOptions(productId)
      ),
  });

  const isLoading =
    variantQueries.some((q) => q.isLoading) ||
    productQueries.some((q) => q.isLoading);
  const hasError =
    variantQueries.some((q) => q.isError) ||
    productQueries.some((q) => q.isError);

  const variantsData = variantQueries
    .map((q) => q.data)
    .filter((v) => v !== undefined);
  const productsData = productQueries
    .map((q) => q.data)
    .filter((p) => p !== undefined);

  // Combine variant and product specs for each product
  const combinedData = variantsData.map((variant) => {
    const product = productsData.find((p) => p?.id === variant?.productId);
    return { variant, product };
  });

  const handleRemoveProduct = (variantId: number) => {
    removeVariantId(variantId);
  };

  const handleClearAll = () => {
    clearVariantIds();
  };

  const canAddMore = variantIds.length < 3;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate({ to: "/search" })}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">So sánh sản phẩm</h1>
                <p className="text-muted-foreground">
                  So sánh thông số kỹ thuật của các sản phẩm (Tối đa 3 sản phẩm)
                </p>
              </div>
            </div>
            {variantIds.length > 0 && (
              <Button variant="outline" onClick={handleClearAll}>
                Xóa tất cả
              </Button>
            )}
          </div>

          {/* Empty State */}
          {variantIds.length === 0 && (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <div className="text-6xl">📊</div>
                  <h3 className="text-xl font-semibold">
                    Chưa có sản phẩm nào để so sánh
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Thêm sản phẩm vào danh sách so sánh để xem thông số kỹ thuật
                    chi tiết và đưa ra quyết định mua hàng tốt nhất
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setShowSearchModal(true)}
                    className="mt-4"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Thêm sản phẩm
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Selection Cards */}
          {variantIds.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {variantsData.map((variant, index) => {
                  return (
                    <Card key={variant?.id || index}>
                      <CardContent className="p-4">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleRemoveProduct(variant?.id!)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <img
                            src={variant?.image!}
                            alt={variant?.name}
                            className="w-full aspect-square object-contain mb-3"
                          />
                          <h3 className="font-medium text-sm line-clamp-2 mb-2">
                            {variant?.name}
                          </h3>
                          <div className="text-lg font-bold text-primary">
                            {Number(variant?.price).toLocaleString("vi-VN")}đ
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Add More Card */}
                {canAddMore && (
                  <Card className="border-dashed border-2">
                    <CardContent className="flex items-center justify-center h-full min-h-[300px] p-4">
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => setShowSearchModal(true)}
                        className="flex-col h-auto py-8"
                      >
                        <Plus className="h-12 w-12 mb-2" />
                        <span>Thêm sản phẩm</span>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Comparison Table */}
              {isLoading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Đang tải thông tin sản phẩm...
                    </p>
                  </CardContent>
                </Card>
              ) : hasError ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-destructive">
                      Có lỗi xảy ra khi tải thông tin sản phẩm
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ComparisonTable data={combinedData} />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* Search Modal */}
      <SearchModal open={showSearchModal} onOpenChange={setShowSearchModal} />
    </div>
  );
};

export default CompareProducts;
