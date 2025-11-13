import { Check } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface VariantValue {
  value: string;
  displayValue: string;
  code: string | null;
}

interface ProductAttribute {
  name: string;
  values: VariantValue[];
}

interface VariantSelectorProps {
  attrs: ProductAttribute[];
  currentVariant: any;
  allVariants: any[];
}

export function ProductVariantSelector({
  attrs,
  currentVariant,
  allVariants,
}: VariantSelectorProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {attrs.map((attr) => (
        <div key={attr.name}>
          <h3 className="text-base font-semibold mb-3">{attr.name}:</h3>
          <div className="flex flex-wrap gap-2">
            {attr.values.map((value) => {
              const isSelected = currentVariant.variantValues.some(
                (vv: any) =>
                  vv.value.attribute.name === attr.name &&
                  vv.value.value === value.value
              );

              const otherSelectedValues = currentVariant.variantValues.filter(
                (vv: any) => vv.value.attribute.name !== attr.name
              );

              const targetVariant = allVariants.find((v: any) => {
                const hasThisValue = v.variantValues.some(
                  (vv: any) =>
                    vv.value.attribute.name === attr.name &&
                    vv.value.value === value.value
                );
                if (!hasThisValue) return false;

                return otherSelectedValues.every((osv: any) =>
                  v.variantValues.some(
                    (vv: any) =>
                      vv.value.attribute.name === osv.value.attribute.name &&
                      vv.value.value === osv.value.value
                  )
                );
              });

              const isOutOfStock =
                !targetVariant || (targetVariant.stock ?? 0) <= 0;

              const handleVariantChange = () => {
                if (targetVariant && !isSelected) {
                  navigate({
                    to: "/product/$id",
                    params: { id: targetVariant.id.toString() },
                    replace: true,
                    search: { isSpu: false },
                  });
                }
              };

              if (
                attr.name.toLowerCase().includes("màu") ||
                attr.name.toLowerCase().includes("color")
              ) {
                // Color swatches
                return (
                  <button
                    key={value.value}
                    onClick={handleVariantChange}
                    disabled={isOutOfStock}
                    className={`
                      relative variant-swatch w-12 h-12 rounded-full border-2 transition-all
                      ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-gray-300"
                      }
                      ${
                        isOutOfStock
                          ? "cursor-not-allowed opacity-50"
                          : "hover:border-gray-400 cursor-pointer"
                      }
                    `}
                    style={{
                      backgroundColor: value.code || "#e5e7eb",
                    }}
                    title={`${value.displayValue}${
                      isOutOfStock ? " (Hết hàng)" : ""
                    }`}
                  >
                    {isSelected && (
                      <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-sm" />
                    )}
                    {isOutOfStock && (
                      <div
                        className="absolute inset-0 bg-black/40"
                        style={{
                          clipPath:
                            "polygon(0 0, 2px 0, 100% calc(100% - 2px), 100% 100%, calc(100% - 2px) 100%, 0 2px, 0 0)",
                        }}
                      />
                    )}
                  </button>
                );
              } else {
                // Text options (capacity, size, etc.)
                return (
                  <button
                    key={value.value}
                    onClick={handleVariantChange}
                    disabled={isOutOfStock}
                    className={`
                      relative variant-option px-4 py-2 text-sm rounded-md border
                      ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-gray-300"
                      }
                      ${
                        isOutOfStock
                          ? "cursor-not-allowed opacity-50 text-muted-foreground"
                          : "hover:border-gray-400 cursor-pointer"
                      }
                    `}
                    title={`${value.displayValue}${
                      isOutOfStock ? " (Hết hàng)" : ""
                    }`}
                  >
                    {value.displayValue}
                    {isOutOfStock && (
                      <div className="absolute bottom-1/2 left-[5%] right-[5%] h-px bg-slate-400" />
                    )}
                  </button>
                );
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

