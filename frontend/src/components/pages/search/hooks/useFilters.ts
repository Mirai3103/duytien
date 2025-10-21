import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { FilterState } from "../types";
import { DEFAULT_FILTER_STATE, MAX_PRICE } from "../types";

interface Category {
  id: number;
  name: string;
  children?: Category[];
}

interface UseFiltersProps {
  categoriesData?: Category[];
}

function getInitialFiltersFromParams(searchParams: any): FilterState {
  return {
    categories: (searchParams.categoryId?.map(String) ?? []) as string[],
    brands: (searchParams.brandId?.map(String) ?? []) as string[],
    priceRange: [
      searchParams.priceMin ?? 0,
      searchParams.priceMax ?? MAX_PRICE,
    ] as [number, number],
    minRating: "0", // Rating filter is not in URL params yet
  };
}

function convertFiltersToUrlParams(filters: FilterState) {
  return {
    brandId: filters.brands.length > 0 ? filters.brands.map(Number) : undefined,
    categoryId:
      filters.categories.length > 0
        ? filters.categories.map(Number)
        : undefined,
    priceMin: filters.priceRange[0] !== 0 ? filters.priceRange[0] : undefined,
    priceMax:
      filters.priceRange[1] !== MAX_PRICE ? filters.priceRange[1] : undefined,
  };
}

export function useFilters({ categoriesData }: UseFiltersProps) {
  const searchParams = useSearch({ from: "/_storefront/search" });
  const navigate = useNavigate();

  const [pendingFilters, setPendingFilters] = useState<FilterState>(() =>
    getInitialFiltersFromParams(searchParams)
  );
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(() =>
    getInitialFiltersFromParams(searchParams)
  );

  // Restore filters from URL params when they change
  useEffect(() => {
    const filtersFromParams = getInitialFiltersFromParams(searchParams);
    setAppliedFilters(filtersFromParams);
    setPendingFilters(filtersFromParams);
  }, [
    searchParams.categoryId,
    searchParams.brandId,
    searchParams.priceMin,
    searchParams.priceMax,
  ]);

  const togglePendingCategory = (categoryId: string) => {
    setPendingFilters((prev) => {
      const isCurrentlySelected = prev.categories.includes(categoryId);
      let newCategories = [...prev.categories];

      const parentCategory = categoriesData?.find(
        (cat) => cat.id.toString() === categoryId
      );

      if (parentCategory?.children) {
        const childrenIds = parentCategory.children.map((child) =>
          child.id.toString()
        );

        if (isCurrentlySelected) {
          newCategories = newCategories.filter(
            (c) => c !== categoryId && !childrenIds.includes(c)
          );
        } else {
          newCategories = [
            ...newCategories.filter(
              (c) => c !== categoryId && !childrenIds.includes(c)
            ),
            categoryId,
            ...childrenIds,
          ];
        }
      } else {
        if (isCurrentlySelected) {
          newCategories = newCategories.filter((c) => c !== categoryId);
        } else {
          newCategories.push(categoryId);
        }

        const parent = categoriesData?.find((parent) =>
          parent.children?.some((child) => child.id.toString() === categoryId)
        );

        if (parent) {
          const parentId = parent.id.toString();
          const allChildrenIds =
            parent.children?.map((c) => c.id.toString()) || [];
          const allChildrenSelected = allChildrenIds.every((id) =>
            newCategories.includes(id)
          );

          if (allChildrenSelected && !newCategories.includes(parentId)) {
            newCategories.push(parentId);
          } else if (!allChildrenSelected && newCategories.includes(parentId)) {
            newCategories = newCategories.filter((c) => c !== parentId);
          }
        }
      }

      return { ...prev, categories: newCategories };
    });
  };

  const togglePendingBrand = (brandId: string) => {
    setPendingFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter((b) => b !== brandId)
        : [...prev.brands, brandId],
    }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...pendingFilters });
    navigate({
      to: "/search",
      search: {
        ...searchParams,
        ...convertFiltersToUrlParams(pendingFilters),
        page: 1,
      },
    });
  };

  const clearFilters = () => {
    setPendingFilters(DEFAULT_FILTER_STATE);
    setAppliedFilters(DEFAULT_FILTER_STATE);
    navigate({
      to: "/search",
      search: {
        page: 1,
        limit: searchParams.limit,
      },
    });
  };

  const removeAppliedFilter = (type: keyof FilterState, value: string) => {
    const newFilters = { ...appliedFilters };

    if (type === "categories") {
      const parentCategory = categoriesData?.find(
        (cat) => cat.id.toString() === value
      );

      if (parentCategory?.children) {
        const childrenIds = parentCategory.children.map((child) =>
          child.id.toString()
        );
        newFilters.categories = newFilters.categories.filter(
          (c) => c !== value && !childrenIds.includes(c)
        );
      } else {
        newFilters.categories = newFilters.categories.filter(
          (v) => v !== value
        );

        const parent = categoriesData?.find((parent) =>
          parent.children?.some((child) => child.id.toString() === value)
        );

        if (parent) {
          const parentId = parent.id.toString();
          newFilters.categories = newFilters.categories.filter(
            (c) => c !== parentId
          );
        }
      }
    } else if (type === "brands") {
      newFilters.brands = newFilters.brands.filter((v) => v !== value);
    } else if (type === "minRating") {
      newFilters.minRating = "0";
    }

    setAppliedFilters(newFilters);
    setPendingFilters(newFilters);

    // Update URL params
    navigate({
      to: "/search",
      search: {
        ...searchParams,
        ...convertFiltersToUrlParams(newFilters),
        page: 1,
      },
    });
  };

  const hasActiveFilters =
    appliedFilters.categories.length > 0 ||
    appliedFilters.brands.length > 0 ||
    appliedFilters.minRating !== "0" ||
    appliedFilters.priceRange[0] !== 0 ||
    appliedFilters.priceRange[1] !== 50000000;

  const activeFilterCount = useMemo(() => {
    let count = 0;

    const uniqueCategories = appliedFilters.categories.filter((catId) => {
      const isChild = categoriesData?.some((parent) =>
        parent.children?.some((child) => child.id.toString() === catId)
      );

      if (isChild) {
        const parent = categoriesData?.find((parent) =>
          parent.children?.some((child) => child.id.toString() === catId)
        );
        return !(
          parent && appliedFilters.categories.includes(parent.id.toString())
        );
      }
      return true;
    });
    count += uniqueCategories.length;
    count += appliedFilters.brands.length;
    if (appliedFilters.minRating !== "0") count += 1;

    return count;
  }, [appliedFilters, categoriesData]);

  return {
    pendingFilters,
    appliedFilters,
    setPendingFilters,
    togglePendingCategory,
    togglePendingBrand,
    applyFilters,
    clearFilters,
    removeAppliedFilter,
    hasActiveFilters,
    activeFilterCount,
  };
}
