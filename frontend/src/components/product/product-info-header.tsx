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
      <h1 className="text-xl md:text-3xl font-bold mb-2">{variantName}</h1>
      <div className="flex items-center gap-2 md:gap-4 flex-wrap text-sm md:text-base">
        {reviewStats && reviewStats.totalReviews > 0 && (
          <>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 md:h-5 md:w-5 ${
                      star <= Math.round(reviewStats.averageRating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-sm md:text-base">
                {reviewStats.averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground text-xs md:text-sm">
                ({reviewStats.totalReviews} đánh giá)
              </span>
            </div>
            <Separator orientation="vertical" className="h-3 md:h-4" />
          </>
        )}
        <span className="text-muted-foreground text-xs md:text-sm">Kho: {stock || 0}</span>
      </div>
    </div>
  );
}

