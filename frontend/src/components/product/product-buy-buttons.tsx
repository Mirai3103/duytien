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
    <div className="flex gap-3">
      <RippleButton
        size="lg"
        className="flex-1 text-lg h-14"
        disabled={isOutOfStock}
        onClick={onBuyNow}
      >
        {isOutOfStock ? "Hết hàng" : "Mua ngay"}
      </RippleButton>
      <RippleButton
        size="lg"
        variant="outline"
        className="flex-1 text-lg h-14"
        onClick={onAddToCart}
        disabled={isAddingToCart || isOutOfStock}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
      </RippleButton>
    </div>
  );
}

