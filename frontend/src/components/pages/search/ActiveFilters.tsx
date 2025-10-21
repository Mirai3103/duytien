import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FilterState } from "./types";
import { MAX_PRICE } from "./types";

interface Category {
  id: number;
  name: string;
  children?: Category[];
}

interface Brand {
  id: number;
  name: string;
}

interface ActiveFiltersProps {
  appliedFilters: FilterState;
  categoriesData?: Category[];
  brandsData?: Brand[];
  onRemoveFilter: (type: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
}

export function ActiveFilters({
  appliedFilters,
  categoriesData,
  brandsData,
  onRemoveFilter,
  onClearFilters,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    appliedFilters.categories.length > 0 ||
    appliedFilters.brands.length > 0 ||
    appliedFilters.minRating !== "0" ||
    appliedFilters.priceRange[0] !== 0 ||
    appliedFilters.priceRange[1] !== MAX_PRICE;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <CategoryBadges
        selectedCategories={appliedFilters.categories}
        categoriesData={categoriesData}
        onRemove={(catId) => onRemoveFilter("categories", catId)}
      />

      <BrandBadges
        selectedBrands={appliedFilters.brands}
        brandsData={brandsData}
        onRemove={(brandId) => onRemoveFilter("brands", brandId)}
      />

      {appliedFilters.minRating !== "0" && (
        <Badge variant="secondary" className="gap-1">
          Từ {appliedFilters.minRating} sao
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onRemoveFilter("minRating", "")}
          />
        </Badge>
      )}

      {(appliedFilters.priceRange[0] !== 0 ||
        appliedFilters.priceRange[1] !== MAX_PRICE) && (
        <Badge variant="secondary" className="gap-1">
          {(appliedFilters.priceRange[0] / 1000000).toFixed(0)}tr -{" "}
          {(appliedFilters.priceRange[1] / 1000000).toFixed(0)}tr
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearFilters}
        className="h-6 text-xs"
      >
        Xóa tất cả
      </Button>
    </div>
  );
}

interface CategoryBadgesProps {
  selectedCategories: string[];
  categoriesData?: Category[];
  onRemove: (categoryId: string) => void;
}

function CategoryBadges({
  selectedCategories,
  categoriesData,
  onRemove,
}: CategoryBadgesProps) {
  return (
    <>
      {selectedCategories.map((catId) => {
        const isChild = categoriesData?.some((parent) =>
          parent.children?.some((child) => child.id.toString() === catId)
        );

        if (isChild) {
          const parent = categoriesData?.find((parent) =>
            parent.children?.some((child) => child.id.toString() === catId)
          );

          if (parent && selectedCategories.includes(parent.id.toString())) {
            return null;
          }
        }

        const category = categoriesData
          ?.flatMap((parent) => [parent, ...(parent.children || [])])
          .find((cat) => cat.id.toString() === catId);

        return (
          <Badge key={catId} variant="secondary" className="gap-1">
            {category?.name || catId}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onRemove(catId)}
            />
          </Badge>
        );
      })}
    </>
  );
}

interface BrandBadgesProps {
  selectedBrands: string[];
  brandsData?: Brand[];
  onRemove: (brandId: string) => void;
}

function BrandBadges({
  selectedBrands,
  brandsData,
  onRemove,
}: BrandBadgesProps) {
  return (
    <>
      {selectedBrands.map((brandId) => {
        const brand = brandsData?.find((b) => b.id.toString() === brandId);
        return (
          <Badge key={brandId} variant="secondary" className="gap-1">
            {brand?.name || brandId}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onRemove(brandId)}
            />
          </Badge>
        );
      })}
    </>
  );
}
