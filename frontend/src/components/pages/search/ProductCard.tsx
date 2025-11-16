import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GetProductsWithVariantsResponse } from "@/types/backend/trpc/routes/products.route";
import { getFinalPrice, getDiscountPercentage } from "@/lib/utils";

interface ProductCardProps {
  product: GetProductsWithVariantsResponse[number];
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  // Lấy variant đầu tiên làm đại diện cho SPU
  const representativeVariant = product.variantsAggregate![0];

  if (product.variantsAggregate!.length === 0) {
    console.log(product);
  }

  const originalPrice = parseInt(representativeVariant.price, 10);
  const discount = Number(product.discount);
  const finalPrice = getFinalPrice(originalPrice, discount);
  const discountPercentage = getDiscountPercentage(originalPrice, discount);
  const hasDiscount = discount > 0;

  const handleCardClick = () => {
    navigate({
      to: "/product/$id",
      params: { id: product.id.toString() },
      search: { isSpu: true },
    });
  };

  return (
    <Card
      onClick={handleCardClick}
      className="group hover:shadow-lg transition-all duration-300 hover:border-primary cursor-pointer overflow-hidden"
    >
      <CardContent className="p-3 relative">
        <ProductImage 
          src={representativeVariant.image!} 
          alt={representativeVariant.name}
          discountPercentage={hasDiscount ? discountPercentage.toString() : null}
        />

        {product.brand && (
          <div className="mb-1">
            <span className="text-xs text-muted-foreground font-medium">
              {product.brand.name}
            </span>
          </div>
        )}

        <ProductInfo
          name={representativeVariant.name}
          originalPrice={originalPrice}
          finalPrice={finalPrice}
          hasDiscount={hasDiscount}
        />
      </CardContent>
    </Card>
  );
}

interface ProductImageProps {
  src: string;
  alt: string;
  discountPercentage: string | null;
}

function ProductImage({ src, alt, discountPercentage }: ProductImageProps) {
  return (
    <div className="relative mb-3">
      {discountPercentage && (
        <Badge 
          variant="destructive" 
          className="absolute top-2 right-2 z-10 font-bold shadow-md"
        >
          -{discountPercentage}%
        </Badge>
      )}
      <img
        src={src}
        alt={alt}
        className="w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
}

interface ProductInfoProps {
  name: string;
  originalPrice: number;
  finalPrice: number;
  hasDiscount: boolean;
}

function ProductInfo({ name, originalPrice, finalPrice, hasDiscount }: ProductInfoProps) {
  return (
    <>
      <h3 className="font-medium text-sm mb-2 line-clamp-2 min-h-[40px]">
        {name}
      </h3>
      <div className="space-y-1">
        <div className="flex  flex-col gap-2">

            <div className="text-sm text-muted-foreground line-through min-h-[20px]">
             { hasDiscount && <span className="line-through">{originalPrice.toLocaleString("vi-VN")}đ</span>}
            </div>
          <div className="text-lg font-bold text-primary">
            {finalPrice.toLocaleString("vi-VN")}đ
          </div>
       
        </div>
      </div>
    </>
  );
}