import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProductInfoHeaderProps {
  variantName: string;
  reviewStats?: {
    averageRating: number;
    totalReviews: number;
  };
  stock: number;
}

export function ProductInfoHeader({
  variantName,
  reviewStats,
  stock,
}: ProductInfoHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{variantName}</h1>
      <div className="flex items-center gap-4 flex-wrap">
        {reviewStats && reviewStats.totalReviews > 0 && (
          <>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(reviewStats.averageRating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">
                {reviewStats.averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({reviewStats.totalReviews} đánh giá)
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
          </>
        )}
        <span className="text-muted-foreground">Kho: {stock || 0}</span>
      </div>
    </div>
  );
}

