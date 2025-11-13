import { Card, CardContent } from "@/components/ui/card";

interface ProductPriceCardProps {
  price: number;
  reducedPrice: number;
  reducePrice: number;
  discountPercentage: number;
}

export function ProductPriceCard({
  price,
  reducedPrice,
  reducePrice,
  discountPercentage,
}: ProductPriceCardProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-bold text-primary">
            {price.toLocaleString("vi-VN")}đ
          </span>
          {discountPercentage !== 0 && (
            <span className="text-xl text-muted-foreground line-through">
              {reducedPrice.toLocaleString("vi-VN")}đ
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
  );
}

