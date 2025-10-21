import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useProductVariants } from "./hooks/useProductVariants";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const {
    selectedVariant,
    attrs,
    handleAttributeChange,
    isAttributeAvailable,
  } = useProductVariants(product);

  if (product.variants.length === 0) {
    console.log(product);
  }

  const originalPrice = parseInt(selectedVariant.price, 10);
  const totalVariants = product.variants.length;

  const handleCardClick = () => {
    navigate({
      to: "/product/$id",
      params: { id: selectedVariant.id },
      search: { isSpu: false },
    });
  };

  const isColorAttribute = (attrName: string) => {
    return (
      attrName.toLowerCase().includes("màu") ||
      attrName.toLowerCase().includes("color")
    );
  };

  return (
    <Card
      onClick={handleCardClick}
      className="group hover:shadow-lg transition-all duration-300 hover:border-primary cursor-pointer overflow-hidden"
    >
      <CardContent className="p-3">
        <ProductImage src={selectedVariant.image!} alt={selectedVariant.name} />

        <ProductInfo name={selectedVariant.name} price={originalPrice} />

        {totalVariants > 1 && (
          <VariantSelector
            attrs={attrs}
            selectedVariant={selectedVariant}
            onAttributeChange={handleAttributeChange}
            isAttributeAvailable={isAttributeAvailable}
            isColorAttribute={isColorAttribute}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface ProductImageProps {
  src: string;
  alt: string;
}

function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="relative mb-3">
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
  price: number;
}

function ProductInfo({ name, price }: ProductInfoProps) {
  return (
    <>
      <h3 className="font-medium text-sm mb-2 line-clamp-2 min-h-[40px]">
        {name}
      </h3>
      <div className="space-y-1 mb-3">
        <div className="text-lg font-bold text-primary">
          {price.toLocaleString("vi-VN")}đ
        </div>
      </div>
    </>
  );
}

interface VariantSelectorProps {
  attrs: Array<{
    name: string;
    values: Array<{
      value: string;
      displayValue: string;
      code: string | null;
    }>;
  }>;
  selectedVariant: any;
  onAttributeChange: (attrName: string, attrValue: string) => void;
  isAttributeAvailable: (attrName: string, attrValue: string) => boolean;
  isColorAttribute: (attrName: string) => boolean;
}

function VariantSelector({
  attrs,
  selectedVariant,
  onAttributeChange,
  isAttributeAvailable,
  isColorAttribute,
}: VariantSelectorProps) {
  return (
    <div className="space-y-3 mb-3">
      {attrs.map((attr) => (
        <div key={attr.name}>
          <div className="text-xs font-medium text-muted-foreground mb-1">
            {attr.name}
          </div>
          <div className="flex flex-wrap gap-1">
            {attr.values.map((value) => {
              const isSelected = selectedVariant.variantValues.some(
                (vv: any) =>
                  vv.value.attribute.name === attr.name &&
                  vv.value.value === value.value
              );
              const isAvailable = isAttributeAvailable(attr.name, value.value);

              if (isColorAttribute(attr.name)) {
                return (
                  <ColorSwatch
                    key={value.value}
                    value={value}
                    isSelected={isSelected}
                    isAvailable={isAvailable}
                    onClick={() => onAttributeChange(attr.name, value.value)}
                  />
                );
              }

              return (
                <TextOption
                  key={value.value}
                  value={value}
                  isSelected={isSelected}
                  isAvailable={isAvailable}
                  onClick={() => onAttributeChange(attr.name, value.value)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
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
  onClick: () => void;
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
        variant-swatch w-6 h-6 rounded-full border-2
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
