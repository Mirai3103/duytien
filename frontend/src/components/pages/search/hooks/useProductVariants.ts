import { useMemo } from "react";
import type { GetProductsWithVariantsResponse } from "@/types/backend/trpc/routes/products.route";

export function useProductVariants(
  product: GetProductsWithVariantsResponse[number]
) {
  // Chỉ trả về variant đầu tiên làm đại diện
  const representativeVariant = useMemo(
    () => product.variantsAggregate![0],
    [product]
  );

  return {
    representativeVariant,
  };
}