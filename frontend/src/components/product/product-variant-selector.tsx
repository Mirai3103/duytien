import { Check } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { GetProductsWithVariantsResponse } from "@/types/backend/trpc/routes/products.route";

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
  currentVariant: Required<NonNullable<GetProductsWithVariantsResponse[number]["variantsAggregate"]>[number]>;
  allVariants: Required<NonNullable<GetProductsWithVariantsResponse[number]["variantsAggregate"]>>;
}

type Variant = VariantSelectorProps["allVariants"][number];

export function ProductVariantSelector({
  attrs,
  currentVariant,
  allVariants,
}: VariantSelectorProps) {
  const navigate = useNavigate();

  const isColorAttribute = (attrName: string) => {
    const normalized = attrName.toLowerCase();
    return normalized.includes("màu") || normalized.includes("color");
  };

  const isValueSelected = (attrName: string, value: string) => {
    return currentVariant.variantValues.some(
      (vv) => vv.value.attribute.name === attrName && vv.value.value === value
    );
  };

  // Lấy các giá trị đã chọn từ các attribute trước đó
  const getSelectedValuesBeforeAttribute = (targetAttrName: string) => {
    const targetIndex = attrs.findIndex(attr => attr.name === targetAttrName);
    if (targetIndex <= 0) return [];
    
    const previousAttrs = attrs.slice(0, targetIndex);
    return currentVariant.variantValues.filter(vv => 
      previousAttrs.some(attr => attr.name === vv.value.attribute.name)
    );
  };

  // Lọc các giá trị có sẵn dựa trên các lựa chọn trước đó
  const getAvailableValues = (attrName: string): VariantValue[] => {
    const attribute = attrs.find(attr => attr.name === attrName);
    if (!attribute) return [];

    const selectedValuesBeforeThis = getSelectedValuesBeforeAttribute(attrName);
    
    // Nếu không có attribute nào được chọn trước đó, hiển thị tất cả
    if (selectedValuesBeforeThis.length === 0) {
      return attribute.values;
    }

    // Lọc các giá trị có variant tương ứng với các lựa chọn trước đó
    const availableValues = attribute.values.filter(value => {
      return allVariants.some(variant => {
        // Variant phải có giá trị này
        const hasThisValue = variant.variantValues.some(
          vv => vv.value.attribute.name === attrName && vv.value.value === value.value
        );
        
        if (!hasThisValue) return false;

        // Variant phải khớp với tất cả các lựa chọn trước đó
        return selectedValuesBeforeThis.every(selectedValue =>
          variant.variantValues.some(
            vv =>
              vv.value.attribute.name === selectedValue.value.attribute.name &&
              vv.value.value === selectedValue.value.value
          )
        );
      });
    });

    return availableValues;
  };

  const findTargetVariant = (attrName: string, value: string, force: boolean = false): Variant | undefined => {
   
    const otherSelectedValues = currentVariant.variantValues.filter(
      (vv) => vv.value.attribute.name !== attrName
    );
  
    // Tìm variant khớp tất cả attributes
    const exactMatch = allVariants.find((variant) => {
      const hasTargetValue = variant.variantValues.some(
        (vv) => vv.value.attribute.name === attrName && vv.value.value === value
      );
  
      if (!hasTargetValue) return false;
  
      return otherSelectedValues.every((selectedValue) =>
        variant.variantValues.some(
          (vv) =>
            vv.value.attribute.name === selectedValue.value.attribute.name &&
            vv.value.value === selectedValue.value.value
        )
      );
    });
  
    // Nếu tìm thấy exact match hoặc không force, return kết quả
    if (exactMatch || !force) {
      console.log(exactMatch, attrName, value, currentVariant, allVariants);
      return exactMatch;
    }
  
    // Nếu force = true và không tìm thấy exact match, tìm variant đầu tiên có attribute đó
    const fallbackVariant = allVariants.find((variant) =>
      variant.variantValues.some(
        (vv) => vv.value.attribute.name === attrName && vv.value.value === value
      )
    );
  
    console.log(fallbackVariant, attrName, value, currentVariant, allVariants);
    return fallbackVariant;
  };

  const handleVariantChange = (variant: Variant | undefined, isSelected: boolean) => {
    if (variant && !isSelected) {
      navigate({
        to: "/product/$id",
        params: { id: variant.id.toString() },
        replace: true,
        search: { isSpu: false },
      });
    }
  };

  return (
    <div className="space-y-4">
      {attrs.map((attr) => (
        <AttributeGroup
          key={attr.name}
          attribute={attr}
          availableValues={getAvailableValues(attr.name)}
          isColorAttribute={isColorAttribute(attr.name)}
          isValueSelected={(value) => isValueSelected(attr.name, value)}
          findTargetVariant={(value) => findTargetVariant(attr.name, value, true)}
          onVariantChange={handleVariantChange}
        />
      ))}
    </div>
  );
}

interface AttributeGroupProps {
  attribute: ProductAttribute;
  availableValues: VariantValue[];
  isColorAttribute: boolean;
  isValueSelected: (value: string) => boolean;
  findTargetVariant: (value: string) => Variant | undefined;
  onVariantChange: (variant: Variant | undefined, isSelected: boolean) => void;
}

function AttributeGroup({
  attribute,
  availableValues,
  isColorAttribute,
  isValueSelected,
  findTargetVariant,
  onVariantChange,
}: AttributeGroupProps) {
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">{attribute.name}:</h3>
      <div className="flex flex-wrap gap-2">
        {availableValues.map((value) => {
          const isSelected = isValueSelected(value.value);
          const targetVariant = findTargetVariant(value.value);

          return isColorAttribute ? (
            <ColorSwatch
              key={value.value}
              value={value}
              isSelected={isSelected}
              onClick={() => onVariantChange(targetVariant, isSelected)}
            />
          ) : (
            <TextOption
              key={value.value}
              value={value}
              isSelected={isSelected}
              onClick={() => onVariantChange(targetVariant, isSelected)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface VariantOptionProps {
  value: VariantValue;
  isSelected: boolean;
  onClick: () => void;
}

function ColorSwatch({ value, isSelected, onClick }: VariantOptionProps) {
  const hasColorCode = !!value.code;
  
  return (
    <button
      onClick={onClick}
      className={`
        relative w-12 h-12 rounded-full border-2 transition-all cursor-pointer
        ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-gray-300 hover:border-gray-400"}
        ${!hasColorCode ? "flex items-center justify-center text-xs font-medium" : ""}
      `}
      style={hasColorCode ? { backgroundColor: value.code as any } : undefined}
      title={value.displayValue}
    >
      {!hasColorCode && (
        <span className="text-gray-700 truncate px-1">{value.displayValue}</span>
      )}
      {isSelected && hasColorCode && (
        <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-sm" />
      )}
    </button>
  );
}

function TextOption({ value, isSelected, onClick }: VariantOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-2 text-sm rounded-md border cursor-pointer
        ${isSelected ? "border-primary bg-primary/10 text-primary font-medium" : "border-gray-300 hover:border-gray-400"}
      `}
      title={value.displayValue}
    >
      {value.displayValue}
    </button>
  );
}