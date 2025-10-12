import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  Star,
  Shield,
  Truck,
  RefreshCw,
  Heart,
  Share2,
  ChevronRight,
  Check,
} from "lucide-react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/product/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { id } = params;
    const { trpc, queryClient } = context;

    try {
      const data = await queryClient.ensureQueryData(
        trpc.variants.getVariantDetail.queryOptions(parseInt(id))
      );
      const product = await queryClient.ensureQueryData(
        trpc.products.getProductDetail.queryOptions(data!.productId!)
      );
      return { product: product!, variant: data! };
    } catch (error) {
      throw notFound();
    }
    throw notFound();
  },
});

// Mock Product Data
const mockProduct = {
  id: 1,
  name: "iPhone 15 Pro Max 256GB",
  brand: "Apple",
  price: 29990000,
  oldPrice: 34990000,
  discount: 14,
  rating: 4.8,
  reviewCount: 1247,
  soldCount: 2456,
  images: [
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_2.png",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_1.png",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_4.png",
  ],
  colors: [
    { id: "natural", name: "Titan Tự Nhiên", color: "#F5F5DC" },
    { id: "blue", name: "Titan Xanh", color: "#4A5568" },
    { id: "white", name: "Titan Trắng", color: "#E8E8E8" },
    { id: "black", name: "Titan Đen", color: "#1A1A1A" },
  ],
  storage: [
    { id: "256gb", size: "256GB", price: 29990000, oldPrice: 34990000 },
    { id: "512gb", size: "512GB", price: 34990000, oldPrice: 39990000 },
    { id: "1tb", size: "1TB", price: 39990000, oldPrice: 44990000 },
  ],
  highlights: [
    "Chip A17 Pro mạnh mẽ với GPU 6 lõi",
    "Camera chính 48MP, zoom quang học 5x",
    "Màn hình Super Retina XDR 6.7 inch",
    "Khung Titan chuẩn hàng không vũ trụ",
    "Nút Action có thể tùy chỉnh",
    "Cổng USB-C hỗ trợ USB 3.0",
  ],
  description: `iPhone 15 Pro Max là đỉnh cao công nghệ của Apple với thiết kế khung titan cao cấp, chip A17 Pro mạnh mẽ nhất từ trước đến nay. Màn hình Super Retina XDR 6.7 inch cho trải nghiệm hình ảnh tuyệt vời. Camera chính 48MP cùng zoom quang học 5x mang đến khả năng chụp ảnh chuyên nghiệp.

Chip A17 Pro được sản xuất trên tiến trình 3nm tiên tiến nhất, mang lại hiệu năng vượt trội và tiết kiệm năng lượng. Hệ thống camera Pro với 3 ống kính cho phép bạn sáng tạo không giới hạn.

Khung titan chuẩn hàng không vũ trụ vừa nhẹ vừa bền, tạo cảm giác cao cấp trong tay. Nút Action mới có thể tùy chỉnh cho các tác vụ nhanh.`,
  specifications: {
    "Màn hình": {
      "Công nghệ màn hình": "Super Retina XDR OLED",
      "Độ phân giải": "2796 x 1290 pixels",
      "Màn hình rộng": "6.7 inch",
      "Tần số quét": "120Hz ProMotion",
      "Độ sáng tối đa": "2000 nits",
    },
    "Camera sau": {
      "Camera chính": "48MP f/1.78",
      "Camera góc siêu rộng": "12MP f/2.2",
      "Camera tele": "12MP f/2.8 (zoom quang 5x)",
      "Quay video": "4K 60fps, ProRes, Action Mode",
      "Tính năng": "Night mode, Deep Fusion, Smart HDR 5",
    },
    "Camera trước": {
      "Độ phân giải": "12MP f/1.9",
      "Tính năng": "Night mode, 4K 60fps, Cinematic mode",
    },
    "Vi xử lý": {
      Chip: "Apple A17 Pro (3nm)",
      CPU: "6 nhân",
      GPU: "6 nhân",
      "Neural Engine": "16 nhân",
    },
    "Pin & Sạc": {
      "Dung lượng pin": "4422 mAh",
      "Loại pin": "Li-Ion",
      "Sạc nhanh": "27W (USB-C)",
      "Sạc không dây": "MagSafe 15W, Qi 7.5W",
    },
    "Kết nối": {
      "Mạng di động": "5G",
      SIM: "2 eSIM + 1 Nano SIM",
      Wifi: "Wi-Fi 6E",
      Bluetooth: "v5.3",
      "Cổng kết nối": "USB-C (USB 3.0)",
    },
    "Thiết kế & Chất liệu": {
      "Kích thước": "159.9 x 76.7 x 8.25 mm",
      "Trọng lượng": "221g",
      "Chất liệu": "Khung Titan, mặt lưng kính",
      "Kháng nước": "IP68",
    },
  },
  policies: [
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
  ],
  reviews: [
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
  ],
  ratingDistribution: {
    5: 75,
    4: 15,
    3: 6,
    2: 2,
    1: 2,
  },
};
import _ from "lodash";
function RouteComponent() {
  const { product, variant } = Route.useLoaderData(); // TODO: Use this to fetch actual product data
  const reducedPrice = Number(variant.metadata.reducedPrice);
  const reducePrice = Number(variant.price) - reducedPrice;
  const discountPercentage = Number(variant.metadata.discountPercentage);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

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

  const totalReviews = Object.values(mockProduct.ratingDistribution).reduce(
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
                    {mockProduct.discount > 0 && (
                      <Badge className="absolute top-4 left-4 z-10 bg-primary text-lg px-3 py-1">
                        -{mockProduct.discount}%
                      </Badge>
                    )}
                    <img
                      src={variant.image!}
                      alt={variant.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {mockProduct.images.map((image, index) => (
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
                          src={variant.image!}
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
                            star <= mockProduct.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{mockProduct.rating}</span>
                    <span className="text-muted-foreground">
                      ({mockProduct.reviewCount} đánh giá)
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-muted-foreground">
                    Đã bán {mockProduct.soldCount}
                  </span>
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
                  <p className="text-sm text-muted-foreground">
                    Tiết kiệm {reducePrice.toLocaleString("vi-VN")}đ
                  </p>
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

                        if (
                          attr.name.toLowerCase().includes("màu") ||
                          attr.name.toLowerCase().includes("color")
                        ) {
                          // Color swatches
                          return (
                            <button
                              key={value.value}
                              onClick={() => {
                                // Find variant with this attribute value
                                const targetVariant = product.variants.find(
                                  (v: any) =>
                                    v.variantValues.some(
                                      (vv: any) =>
                                        vv.value.attribute.name === attr.name &&
                                        vv.value.value === value.value
                                    )
                                );
                                if (targetVariant) {
                                  navigate({
                                    to: "/product/$id",
                                    params: { id: targetVariant.id.toString() },
                                  });
                                }
                              }}
                              className={`
                                variant-swatch w-12 h-12 rounded-full border-2
                                ${
                                  isSelected
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-gray-300 hover:border-gray-400"
                                }
                                cursor-pointer
                              `}
                              style={{
                                backgroundColor: value.code || "#e5e7eb",
                              }}
                              title={value.displayValue}
                            >
                              {isSelected && (
                                <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-sm" />
                              )}
                            </button>
                          );
                        } else {
                          // Text options (capacity, size, etc.)
                          return (
                            <button
                              key={value.value}
                              onClick={() => {
                                // Find variant with this attribute value
                                const targetVariant = product.variants.find(
                                  (v: any) =>
                                    v.variantValues.some(
                                      (vv: any) =>
                                        vv.value.attribute.name === attr.name &&
                                        vv.value.value === value.value
                                    )
                                );
                                if (targetVariant) {
                                  navigate({
                                    to: "/product/$id",
                                    params: { id: targetVariant.id.toString() },
                                  });
                                }
                              }}
                              className={`
                                variant-option px-4 py-2 text-sm rounded-md border
                                ${
                                  isSelected
                                    ? "border-primary bg-primary/10 text-primary font-medium"
                                    : "border-gray-300 hover:border-gray-400"
                                }
                                cursor-pointer
                              `}
                            >
                              {value.displayValue}
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
                  <ul className="grid grid-cols-2 gap-2">
                    {mockProduct.highlights.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="text-primary mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button size="lg" className="flex-1 text-lg h-14">
                  Mua ngay
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 text-lg h-14"
                >
                  Thêm vào giỏ
                </Button>
              </div>

              {/* Policies */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {mockProduct.policies.map((policy, index) => (
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
                  <TabsTrigger value="reviews">
                    Đánh giá ({mockProduct.reviewCount})
                  </TabsTrigger>
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
                    {Object.entries(mockProduct.specifications).map(
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
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Rating Summary */}
                    <div className="lg:col-span-1">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-5xl font-bold mb-2">
                            {mockProduct.rating}
                          </div>
                          <div className="flex justify-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= mockProduct.rating
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
                                    (mockProduct.ratingDistribution[
                                      rating as keyof typeof mockProduct.ratingDistribution
                                    ] /
                                      totalReviews) *
                                    100
                                  }
                                  className="flex-1"
                                />
                                <span className="text-sm text-muted-foreground w-12 text-right">
                                  {
                                    mockProduct.ratingDistribution[
                                      rating as keyof typeof mockProduct.ratingDistribution
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
                      {mockProduct.reviews.map((review) => (
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
