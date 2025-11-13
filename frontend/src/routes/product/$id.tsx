import {
  createFileRoute,
  notFound,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { ProductBreadcrumb } from "@/components/product/product-breadcrumb";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { ProductInfoHeader } from "@/components/product/product-info-header";
import { ProductPriceCard } from "@/components/product/product-price-card";
import { ProductVariantSelector } from "@/components/product/product-variant-selector";
import { ProductHighlights } from "@/components/product/product-highlights";
import { ProductQuantitySelector } from "@/components/product/product-quantity-selector";
import { ProductBuyButtons } from "@/components/product/product-buy-buttons";
import { ProductPolicies } from "@/components/product/product-policies";
import { ProductDetailsTabs } from "@/components/product/product-details-tabs";

export const Route = createFileRoute("/product/$id")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      isSpu: Boolean(search?.isSpu ?? false),
    };
  },
  loaderDeps: ({ search: { isSpu = false } }) => ({ isSpu }),
  loader: async ({ context, params, deps: { isSpu } }) => {
    const { id } = params;
    const { trpc, queryClient, trpcClient } = context;
    if (isSpu) {
      const data = await trpcClient.variants.getDefaultVariantDetail.query(
        parseInt(id, 10)
      );
      if (data) {
        throw redirect({
          to: "/product/$id",
          params: { id: data.id.toString() },
          search: { isSpu: false },
          replace: true,
        });
      } else {
        throw notFound();
      }
    }
    try {
      const data = await queryClient.ensureQueryData(
        trpc.variants.getVariantDetail.queryOptions(parseInt(id, 10))
      );
      const product = await queryClient.ensureQueryData(
        trpc.products.getProductDetail.queryOptions(data!.productId!)
      );
      return { product: product!, variant: data! };
    } catch (_error) {
      throw notFound();
    }
  },
});

import _ from "lodash";
import { useTRPC } from "@/lib/trpc";
import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useCompareStore } from "@/store/compare";
import { useSession } from "@/lib/auth-client";
import {
  getDiscountPercentage,
  getFinalPrice,
  getReducePrice,
} from "@/lib/utils";

const FAKE_HIGHLIGHTS: string[] = [
  "Chip A17 Pro mạnh mẽ với GPU 6 lõi",
  "Camera chính 48MP, zoom quang học 5x",
  "Màn hình Super Retina XDR 6.7 inch",
  "Khung Titan chuẩn hàng không vũ trụ",
  "Nút Action có thể tùy chỉnh",
  "Cổng USB-C hỗ trợ USB 3.0",
];

function RouteComponent() {
  const { product, variant } = Route.useLoaderData();
  const reducedPrice = getFinalPrice(
    Number(variant.price),
    Number(product.discount)
  );
  const reducePrice = getReducePrice(
    Number(variant.price),
    Number(product.discount)
  );
  const discountPercentage = Number(
    getDiscountPercentage(Number(variant.price), Number(product.discount))
  );
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { addVariantId, isVariantIdSelected, variantIds } = useCompareStore();
  const user = useSession();

  const mutateAddToCart = useMutation(
    trpc.cart.addToCart.mutationOptions({
      onSuccess: () => {
        toast.success("Thêm vào giỏ hàng thành công");
        setQuantity(1);
        queryClient.invalidateQueries(trpc.cart.countCartItems.queryOptions());
        queryClient.invalidateQueries(trpc.cart.getCart.queryOptions());
      },
      onError: () => {
        toast.error("Thêm vào giỏ hàng thất bại");
      },
    })
  );

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!user.data?.session?.id) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate({ to: "/auth", search: { redirect: window.location.pathname } });
      return;
    }
    mutateAddToCart.mutate({
      variantId: variant.id,
      quantity: quantity,
    });
  };

  const handleAddToCompare = () => {
    if (variantIds.length >= 3 && !isVariantIdSelected(variant.id)) {
      toast.error("Chỉ có thể so sánh tối đa 3 sản phẩm");
      return;
    }
    addVariantId(variant.id);
    toast.success("Đã thêm vào danh sách so sánh");
    navigate({ to: "/compare" });
  };

  const isInCompare = isVariantIdSelected(variant.id);

  // Fetch review stats for display
  const { data: reviewStats } = useQuery(
    trpc.review.getProductReviewStats.queryOptions({ productId: product.id })
  );

  const attrs = React.useMemo(() => {
    function extractAttrs(product: any) {
      const grouped = _.flatMap(product.variants, "variantValues");
      const groupedByAttr = _.groupBy(grouped, (vv) => vv.value.attribute.name);
      return _.map(groupedByAttr, (arr, attrName) => ({
        name: attrName,
        values: _.uniqBy(arr, (vv) => vv.value.value).map((vv) => ({
          value: vv.value.value,
          displayValue: vv.value.metadata?.displayValue ?? vv.value.value,
          code: vv.value.metadata?.code ?? null,
        })),
      }));
    }
    return extractAttrs(product);
  }, [product]);
  const specs = React.useMemo(() => {
    const variantSpecs = variant.specs;
    const productSpecs = product.specs;
    const combinedSpecs = [...variantSpecs, ...productSpecs];
    function transformSpecs(data: typeof combinedSpecs) {
      return _(data)
        .groupBy((item) => item.value.key.group.id)
        .map((items, groupId) => ({
          groupId: Number(groupId),
          groupName: _.get(items, "[0].value.key.group.name", ""),
          specs: items
            .filter((i) => i.value?.value) // <── BỎ NHỮNG SPEC TRỐNG
            .map((i) => ({
              specName: _.get(i, "value.key.name", ""),
              specValue: _.get(i, "value.value", ""),
            })),
        }))
        .value();
    }
    return transformSpecs(combinedSpecs);
  }, [variant.specs, product.specs]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <ProductBreadcrumb
            categoryName={product.category?.name}
            brandName={product.brand?.name}
            productName={product.name}
          />

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Product Images */}
            <div className="space-y-4">
              <ProductImageGallery
                images={variant.images}
                mainImage={variant.image!}
                variantName={variant.name}
                discountPercentage={discountPercentage}
              />

              {/* Share & Favorite & Compare */}
              <ProductActions
                isInCompare={isInCompare}
                onAddToCompare={handleAddToCompare}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <ProductInfoHeader
                variantName={variant.name}
                reviewStats={reviewStats}
                stock={variant.stock || 0}
              />

              <ProductPriceCard
                price={Number(variant.price)}
                reducedPrice={reducedPrice}
                reducePrice={reducePrice}
                discountPercentage={discountPercentage}
              />

              {/* Variant Selection */}
              <ProductVariantSelector
                attrs={attrs}
                currentVariant={variant}
                allVariants={product.variants}
              />

              {/* Key Features */}
              <ProductHighlights highlights={FAKE_HIGHLIGHTS} />

              {/* Quantity Selection */}
              <ProductQuantitySelector
                quantity={quantity}
                stock={variant.stock || 0}
                onQuantityChange={handleQuantityChange}
              />

              {/* Action Buttons */}
              <ProductBuyButtons
                stock={variant.stock ?? 0}
                isAddingToCart={mutateAddToCart.isPending}
                onAddToCart={handleAddToCart}
              />

              {/* Policies */}
              <ProductPolicies />
            </div>
          </div>

          {/* Product Details Tabs */}
          <ProductDetailsTabs
            productId={product.id}
            variantId={variant.id}
            productName={product.name}
            description={product.description ?? ""}
            specs={specs}
            reviewCount={reviewStats?.totalReviews || 0}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
