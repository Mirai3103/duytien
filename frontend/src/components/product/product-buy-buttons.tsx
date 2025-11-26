import { ShoppingCart } from "lucide-react";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";

interface ProductBuyButtonsProps {
  stock: number;
  isAddingToCart: boolean;
  onBuyNow?: () => void;
  onAddToCart: () => void;
}

export function ProductBuyButtons({
  stock,
  isAddingToCart,
  onBuyNow,
  onAddToCart,
}: ProductBuyButtonsProps) {
  const isOutOfStock = stock <= 0;

  return (
    <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
      <RippleButton
        size="lg"
        className="flex-1 text-base md:text-lg h-11 md:h-14"
        disabled={isOutOfStock}
        onClick={onBuyNow}
      >
        {isOutOfStock ? "Hết hàng" : "Mua ngay"}
      </RippleButton>
      <RippleButton
        size="lg"
        variant="outline"
        className="flex-1 text-base md:text-lg h-11 md:h-14"
        onClick={onAddToCart}
        disabled={isAddingToCart || isOutOfStock}
      >
        <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 mr-2" />
        {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
      </RippleButton>
    </div>
  );
}

