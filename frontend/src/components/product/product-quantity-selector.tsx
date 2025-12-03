import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProductQuantitySelectorProps {
  quantity: number;
  stock: number;
  onQuantityChange: (value: number) => void;
}

export function ProductQuantitySelector({
  quantity,
  stock,
  onQuantityChange,
}: ProductQuantitySelectorProps) {
  const maxQuantity = Math.min(stock, 999);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= maxQuantity) {
      onQuantityChange(value);
    }
  };

  return (
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
              max={maxQuantity}
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
              disabled={quantity >= maxQuantity}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {stock > 0 ? (
          <p className="text-sm text-muted-foreground text-right mt-2">
            {stock} sản phẩm có sẵn
          </p>
        ) : (
          <p className="text-sm text-destructive text-right mt-2">
            Hết hàng
          </p>
        )}
      </CardContent>
    </Card>
  );
}

