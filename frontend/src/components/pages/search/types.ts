import type { GetProductsWithVariantsResponse } from "@/types/backend/trpc/routes/products.route";

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  minRating: string;
}

export interface SortOption {
  label: string;
  value: {
    field: string;
    direction: string;
  };
}

export const SORT_OPTIONS: SortOption[] = [
  { label: "Mới nhất", value: { field: "createdAt", direction: "desc" } },
  { label: "Giá tăng dần", value: { field: "price", direction: "asc" } },
  { label: "Giá giảm dần", value: { field: "price", direction: "desc" } },
  { label: "Nổi bật", value: { field: "name", direction: "desc" } },
];

export const DEFAULT_FILTER_STATE: FilterState = {
  categories: [],
  brands: [],
  priceRange: [0, 50000000],
  minRating: "0",
};

export const MAX_PRICE = 50000000;
export const PRICE_STEP = 1000000;
export const INITIAL_ITEMS_DISPLAY = 8;
