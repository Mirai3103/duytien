import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProductVariants } from "@/components/pages/search/hooks/useProductVariants";

interface CompareProductCardProps {
  product: any; // Product from getProductsWithVariants
  isSelected: boolean;
  canAdd: boolean;
  onAdd: (variantId: number) => void;
  isVariantSelected: (variantId: number) => boolean;
}

export function CompareProductCard({
  product,
  isSelected,
  canAdd,
  onAdd,
  isVariantSelected,
}: CompareProductCardProps) {
  const {
    selectedVariant,
    attrs,
    handleAttributeChange,
    isAttributeAvailable,
  } = useProductVariants(product);

  // Check if the currently selected variant is in the comparison list
  const isCurrentVariantSelected = isVariantSelected(selectedVariant.id);

  const isColorAttribute = (attrName: string) => {
    return (
      attrName.toLowerCase().includes("màu") ||
      attrName.toLowerCase().includes("color")
    );
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(selectedVariant.id);
  };

  return (
    <Card
      className={`cursor-pointer transition-all ${
        isCurrentVariantSelected
          ? "border-primary ring-2 ring-primary/20"
          : "hover:shadow-md"
      }`}
    >
      <CardContent className="p-3">
        <div className="relative mb-2">
          <img
            src={selectedVariant.image!}
            alt={selectedVariant.name}
            className="w-full aspect-square object-contain"
          />
          {isCurrentVariantSelected && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>

        <h3 className="font-medium text-xs line-clamp-2 mb-2 min-h-[32px]">
          {selectedVariant.name}
        </h3>

        <div className="text-sm font-bold text-primary mb-3">
          {Number(selectedVariant.price).toLocaleString("vi-VN")}đ
        </div>

        {/* Variant Selection */}
        {product.variantsAggregate!.length > 1 && (
          <div className="space-y-2 mb-3">
            {attrs.map((attr) => (
              <div key={attr.name}>
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {attr.name}
                </div>
                <div className="flex flex-wrap gap-1">
                  {attr.values.map((value) => {
                    const isSelectedValue = selectedVariant.variantValues.some(
                      (vv: any) =>
                        vv.value.attribute.name === attr.name &&
                        vv.value.value === value.value
                    );
                    const isAvailable = isAttributeAvailable(
                      attr.name,
                      value.value
                    );

                    if (isColorAttribute(attr.name)) {
                      return (
                        <ColorSwatch
                          key={value.value}
                          value={value}
                          isSelected={isSelectedValue}
                          isAvailable={isAvailable}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAttributeChange(attr.name, value.value);
                          }}
                        />
                      );
                    }

                    return (
                      <TextOption
                        key={value.value}
                        value={value}
                        isSelected={isSelectedValue}
                        isAvailable={isAvailable}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAttributeChange(attr.name, value.value);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          size="sm"
          className="w-full"
          variant={isCurrentVariantSelected ? "secondary" : "default"}
          disabled={!canAdd && !isCurrentVariantSelected}
          onClick={handleAddClick}
        >
          {isCurrentVariantSelected ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Đã chọn
            </>
          ) : (
            "Thêm để so sánh"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

interface VariantOptionProps {
  value: {
    value: string;
    displayValue: string;
    code: string | null;
  };
  isSelected: boolean;
  isAvailable: boolean;
  onClick: (e: React.MouseEvent) => void;
}

function ColorSwatch({
  value,
  isSelected,
  isAvailable,
  onClick,
}: VariantOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isAvailable}
      className={`
        relative variant-swatch w-6 h-6 rounded-full border-2
        ${
          isSelected
            ? "border-primary ring-2 ring-primary/20"
            : "border-gray-300 hover:border-gray-400"
        }
        ${!isAvailable ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
      `}
      style={{ backgroundColor: value.code || "#e5e7eb" }}
      title={value.displayValue}
    >
      {isSelected && (
        <Check className="absolute inset-0 m-auto w-3 h-3 text-white drop-shadow-sm" />
      )}
    </button>
  );
}

function TextOption({
  value,
  isSelected,
  isAvailable,
  onClick,
}: VariantOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isAvailable}
      className={`
        variant-option px-2 py-1 text-xs rounded-md border
        ${
          isSelected
            ? "border-primary bg-primary/10 text-primary font-medium"
            : "border-gray-300 hover:border-gray-400"
        }
        ${!isAvailable ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {value.displayValue}
    </button>
  );
}
