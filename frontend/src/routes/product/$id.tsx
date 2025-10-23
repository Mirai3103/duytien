import {
  createFileRoute,
  notFound,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const fake_highlights: string[] = [
  "Chip A17 Pro mạnh mẽ với GPU 6 lõi",
  "Camera chính 48MP, zoom quang học 5x",
  "Màn hình Super Retina XDR 6.7 inch",
  "Khung Titan chuẩn hàng không vũ trụ",
  "Nút Action có thể tùy chỉnh",
  "Cổng USB-C hỗ trợ USB 3.0",
];
const fake_policies: {
  icon: React.ElementType;
  title: string;
  description: string;
}[] = [
  {
    icon: Shield,
    title: "Bảo hành chính hãng 12 tháng",
    description: "Bảo hành tại các trung tâm Apple ủy quyền",
  },
  {
    icon: Truck,
    title: "Giao hàng miễn phí toàn quốc",
    description: "Giao hàng trong 2-3 ngày",
  },
  {
    icon: RefreshCw,
    title: "Đổi trả trong 7 ngày",
    description: "Nếu có lỗi từ nhà sản xuất",
  },
  {
    icon: Shield,
    title: "1 đổi 1 trong 30 ngày",
    description: "Với sản phẩm lỗi từ nhà sản xuất",
  },
];
const fake_reviews = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    rating: 5,
    date: "2024-10-01",
    comment:
      "Sản phẩm tuyệt vời! Hiệu năng mạnh mẽ, camera chụp ảnh đẹp. Rất hài lòng với lựa chọn của mình.",
    helpful: 45,
  },
  {
    id: 2,
    user: "Trần Thị B",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    rating: 5,
    date: "2024-09-28",
    comment:
      "iPhone 15 Pro Max xứng đáng là flagship 2024. Màn hình đẹp, pin trâu, chip A17 Pro quá mượt.",
    helpful: 32,
  },
  {
    id: 3,
    user: "Lê Văn C",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    rating: 4,
    date: "2024-09-25",
    comment:
      "Máy đẹp, chạy mượt. Tuy nhiên giá hơi cao. Nhưng chất lượng Apple thì không phải bàn.",
    helpful: 28,
  },
  {
    id: 4,
    user: "Phạm Thị D",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    rating: 5,
    date: "2024-09-20",
    comment:
      "Camera quá đỉnh, zoom 5x rõ nét lắm. Chơi game cũng không bị nóng máy. 10 điểm!",
    helpful: 56,
  },
];
const fake_ratingDistribution = {
  5: 75,
  4: 15,
  3: 6,
  2: 2,
  1: 2,
};
import _ from "lodash";
import { useTRPC } from "@/lib/trpc";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";

function RouteComponent() {
  const { product, variant } = Route.useLoaderData(); // TODO: Use this to fetch actual product data
  const reducedPrice = Number(variant.metadata?.reducedPrice) || 0;
  const reducePrice = Number(variant.price) - reducedPrice;
  const discountPercentage = Number(variant.metadata?.discountPercentage) || 0;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const mutateAddToCart = useMutation(
    trpc.cart.addToCart.mutationOptions({
      onSuccess: () => {
        toast.success("Thêm vào giỏ hàng thành công");
        setQuantity(1); // Reset quantity after adding to cart
        queryClient.invalidateQueries(trpc.cart.countCartItems.queryOptions());
        queryClient.invalidateQueries(trpc.cart.getCart.queryOptions());
      },
      onError: () => {
        toast.error("Thêm vào giỏ hàng thất bại");
      },
    })
  );

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 999) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    mutateAddToCart.mutate({
      variantId: variant.id,
      quantity: quantity,
    });
  };
  console.log(product.specs);

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

  const totalReviews = Object.values(fake_ratingDistribution).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <span className="hover:text-primary cursor-pointer">Trang chủ</span>
            <ChevronRight className="h-4 w-4" />
            <span className="hover:text-primary cursor-pointer">
              {product.category?.name}
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="hover:text-primary cursor-pointer">
              {product.brand?.name}
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Product Images */}
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="relative aspect-square bg-muted/30 rounded-lg overflow-hidden mb-4">
                    {discountPercentage > 0 && (
                      <Badge className="absolute top-4 left-4 z-10 bg-primary text-lg px-3 py-1">
                        -{discountPercentage}%
                      </Badge>
                    )}
                    <img
                      src={variant.image!}
                      alt={variant.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {variant.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square border-2 rounded-lg overflow-hidden transition-all ${
                          selectedImage === index
                            ? "border-primary"
                            : "border-muted hover:border-muted-foreground"
                        }`}
                      >
                        <img
                          src={image.image!}
                          alt={`${variant.name} ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Share & Favorite */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Yêu thích
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{variant.name}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            true
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">4</span>
                    <span className="text-muted-foreground">
                      ({2000} đánh giá)
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-muted-foreground">Đã bán {2000}</span>
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-primary">
                      {Number(variant.price).toLocaleString("vi-VN")}đ
                    </span>
                    {discountPercentage > 0 && (
                      <span className="text-xl text-muted-foreground line-through">
                        {Number(reducedPrice).toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>
                  {reducePrice > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Tiết kiệm {reducePrice.toLocaleString("vi-VN")}đ
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Variant Selection */}
              <div className="space-y-4">
                {attrs.map((attr) => (
                  <div key={attr.name}>
                    <h3 className="text-base font-semibold mb-3">
                      {attr.name}:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {attr.values.map((value) => {
                        const isSelected = variant.variantValues.some(
                          (vv: any) =>
                            vv.value.attribute.name === attr.name &&
                            vv.value.value === value.value
                        );

                        const otherSelectedValues =
                          variant.variantValues.filter(
                            (vv: any) => vv.value.attribute.name !== attr.name
                          );

                        const targetVariant = product.variants.find(
                          (v: any) => {
                            const hasThisValue = v.variantValues.some(
                              (vv: any) =>
                                vv.value.attribute.name === attr.name &&
                                vv.value.value === value.value
                            );
                            if (!hasThisValue) return false;

                            return otherSelectedValues.every((osv: any) =>
                              v.variantValues.some(
                                (vv: any) =>
                                  vv.value.attribute.name ===
                                    osv.value.attribute.name &&
                                  vv.value.value === osv.value.value
                              )
                            );
                          }
                        );

                        const isOutOfStock =
                          !targetVariant || (targetVariant.stock ?? 0) <= 0;

                        const handleVariantChange = () => {
                          if (targetVariant && !isSelected) {
                            navigate({
                              to: "/product/$id",
                              params: { id: targetVariant.id.toString() },
                              replace: true,
                              search: { isSpu: false },
                            });
                          }
                        };

                        if (
                          attr.name.toLowerCase().includes("màu") ||
                          attr.name.toLowerCase().includes("color")
                        ) {
                          // Color swatches
                          return (
                            <button
                              key={value.value}
                              onClick={handleVariantChange}
                              disabled={isOutOfStock}
                              className={`
                                relative variant-swatch w-12 h-12 rounded-full border-2 transition-all
                                ${
                                  isSelected
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-gray-300"
                                }
                                ${
                                  isOutOfStock
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:border-gray-400 cursor-pointer"
                                }
                              `}
                              style={{
                                backgroundColor: value.code || "#e5e7eb",
                              }}
                              title={`${value.displayValue}${
                                isOutOfStock ? " (Hết hàng)" : ""
                              }`}
                            >
                              {isSelected && (
                                <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-sm" />
                              )}
                              {isOutOfStock && (
                                <div
                                  className="absolute inset-0 bg-black/40"
                                  style={{
                                    clipPath:
                                      "polygon(0 0, 2px 0, 100% calc(100% - 2px), 100% 100%, calc(100% - 2px) 100%, 0 2px, 0 0)",
                                  }}
                                />
                              )}
                            </button>
                          );
                        } else {
                          // Text options (capacity, size, etc.)
                          return (
                            <button
                              key={value.value}
                              onClick={handleVariantChange}
                              disabled={isOutOfStock}
                              className={`
                                relative variant-option px-4 py-2 text-sm rounded-md border
                                ${
                                  isSelected
                                    ? "border-primary bg-primary/10 text-primary font-medium"
                                    : "border-gray-300"
                                }
                                ${
                                  isOutOfStock
                                    ? "cursor-not-allowed opacity-50 text-muted-foreground"
                                    : "hover:border-gray-400 cursor-pointer"
                                }
                              `}
                              title={`${value.displayValue}${
                                isOutOfStock ? " (Hết hàng)" : ""
                              }`}
                            >
                              {value.displayValue}
                              {isOutOfStock && (
                                <div className="absolute bottom-1/2 left-[5%] right-[5%] h-px bg-slate-400" />
                              )}
                            </button>
                          );
                        }
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Features */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Thông số nổi bật</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    {fake_highlights.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Quantity Selection */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Số lượng:</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="h-10 w-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max="999"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(parseInt(e.target.value) || 1)
                        }
                        className="w-20 h-10 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= 999}
                        className="h-10 w-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {(variant.stock || 0) > 0 ? (
                    <p className="text-sm text-muted-foreground text-right mt-2">
                      {variant.stock} sản phẩm có sẵn
                    </p>
                  ) : null}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <RippleButton
                  size="lg"
                  className="flex-1 text-lg h-14"
                  disabled={(variant.stock ?? 0) <= 0}
                >
                  {(variant.stock ?? 0) > 0 ? "Mua ngay" : "Hết hàng"}
                </RippleButton>
                <RippleButton
                  size="lg"
                  variant="outline"
                  className="flex-1 text-lg h-14"
                  onClick={handleAddToCart}
                  disabled={
                    mutateAddToCart.isPending || (variant.stock ?? 0) <= 0
                  }
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {mutateAddToCart.isPending ? "Đang thêm..." : "Thêm vào giỏ"}
                </RippleButton>
              </div>

              {/* Policies */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {fake_policies.map((policy, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <policy.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{policy.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {policy.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
                  <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
                  <TabsTrigger value="specifications">
                    Thông số kỹ thuật
                  </TabsTrigger>
                  <TabsTrigger value="reviews">Đánh giá ({2000})</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-bold mb-4">
                      Giới thiệu {product.name}
                    </h3>
                    <div
                      className="text-muted-foreground whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: product.description ?? "",
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="specifications" className="mt-6">
                  <div className="space-y-6">
                    {/* {Object.entries(mockProduct.specifications).map(
                      ([category, specs]) => (
                        <div key={category}>
                          <h3 className="text-lg font-bold mb-3 text-primary">
                            {category}
                          </h3>
                          <div className="border rounded-lg overflow-hidden">
                            {Object.entries(specs).map(
                              ([key, value], index) => (
                                <div
                                  key={key}
                                  className={`grid grid-cols-2 gap-4 p-3 ${
                                    index % 2 === 0 ? "bg-muted/30" : ""
                                  }`}
                                >
                                  <span className="font-medium">{key}</span>
                                  <span className="text-muted-foreground">
                                    {value}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )
                    )} */}
                    {specs.map((spec) => (
                      <div key={spec.groupId + spec.groupName}>
                        <h3 className="text-lg font-bold mb-3 text-primary">
                          {spec.groupName}
                        </h3>
                        <div className="border rounded-lg overflow-hidden">
                          {spec.specs.map((spec, index) => (
                            <div
                              key={spec.specName + index}
                              className={`grid grid-cols-2 gap-4 p-3 ${
                                index % 2 === 0 ? "bg-muted/30" : ""
                              }`}
                            >
                              <span className="font-medium">
                                {spec.specName}
                              </span>
                              <span className="text-muted-foreground">
                                {spec.specValue}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Rating Summary */}
                    <div className="lg:col-span-1">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-5xl font-bold mb-2">4</div>
                          <div className="flex justify-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= 4
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {totalReviews} đánh giá
                          </p>

                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <div
                                key={rating}
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm w-6">{rating}★</span>
                                <Progress
                                  value={
                                    (fake_ratingDistribution[
                                      rating as unknown as keyof typeof fake_ratingDistribution
                                    ] /
                                      totalReviews) *
                                    100
                                  }
                                  className="flex-1"
                                />
                                <span className="text-sm text-muted-foreground w-12 text-right">
                                  {
                                    fake_ratingDistribution[
                                      rating as unknown as keyof typeof fake_ratingDistribution
                                    ]
                                  }
                                  %
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-2 space-y-4">
                      {fake_reviews.map((review: any) => (
                        <Card key={review.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={review.avatar} />
                                <AvatarFallback>
                                  {review.user[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">
                                    {review.user}
                                  </h4>
                                  <span className="text-sm text-muted-foreground">
                                    {review.date}
                                  </span>
                                </div>
                                <div className="flex mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? "fill-yellow-500 text-yellow-500"
                                          : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-muted-foreground mb-3">
                                  {review.comment}
                                </p>
                                <Button variant="ghost" size="sm">
                                  👍 Hữu ích ({review.helpful})
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
