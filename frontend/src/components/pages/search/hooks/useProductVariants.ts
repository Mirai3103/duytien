import { useState, useMemo } from "react";
import _ from "lodash";
import type { GetProductsWithVariantsResponse } from "@/types/backend/trpc/routes/products.route";

interface VariantValue {
  value: {
    attribute: {
      name: string;
    };
    value: string;
    metadata?: {
      displayValue?: string;
      code?: string;
    };
  };
}

interface Variant {
  variantValues: VariantValue[];
}

interface ProductAttribute {
  name: string;
  values: Array<{
    value: string;
    displayValue: string;
    code: string | null;
  }>;
}

export function useProductVariants(
  product: GetProductsWithVariantsResponse[number]
) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variantsAggregate![0]
  );

  const attrs = useMemo<ProductAttribute[]>(() => {
    const grouped = _.flatMap(product.variantsAggregate!, "variantValues");
    const groupedByAttr = _.groupBy(grouped, (vv) => vv.value.attribute.name);
    return _.map(groupedByAttr, (arr, attrName) => ({
      name: attrName,
      values: _.uniqBy(arr, (vv) => vv.value.value).map((vv) => ({
        value: vv.value.value,
        displayValue: vv.value.metadata?.displayValue ?? vv.value.value,
        code: vv.value.metadata?.code ?? null,
      })),
    }));
  }, [product]);

  const getCurrentSelection = (variant: Variant) => {
    return variant.variantValues.reduce(
      (acc: Record<string, string>, vv: VariantValue) => {
        acc[vv.value.attribute.name] = vv.value.value;
        return acc;
      },
      {}
    );
  };

  const findMatchingVariant = (selection: Record<string, string>) => {
    return product.variantsAggregate!.find((variant: any) => {
      const variantAttrs = getCurrentSelection(variant);
      return Object.keys(selection).every(
        (key) => variantAttrs[key] === selection[key]
      );
    });
  };

  const handleAttributeChange = (attrName: string, attrValue: string) => {
    const currentSelection = getCurrentSelection(selectedVariant as Variant);
    currentSelection[attrName] = attrValue;

    const matchingVariant = findMatchingVariant(currentSelection);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  const isAttributeAvailable = (attrName: string, attrValue: string) => {
    const currentSelection = getCurrentSelection(selectedVariant as Variant);
    const tempSelection = { ...currentSelection, [attrName]: attrValue };
    return !!findMatchingVariant(tempSelection);
  };

  return {
    selectedVariant,
    attrs,
    handleAttributeChange,
    isAttributeAvailable,
  };
}
