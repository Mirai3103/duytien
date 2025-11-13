import { useState, useMemo, useEffect, useCallback } from "react";
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
    categories: Array.isArray(searchParams.categoryId)
      ? searchParams.categoryId.map(String)
      : searchParams.categoryId
      ? [String(searchParams.categoryId)]
      : [],
    brands: Array.isArray(searchParams.brandId)
      ? searchParams.brandId.map(String)
      : searchParams.brandId
      ? [String(searchParams.brandId)]
      : [],
    priceRange: [
      searchParams.priceMin ?? DEFAULT_FILTER_STATE.priceRange[0],
      searchParams.priceMax ?? DEFAULT_FILTER_STATE.priceRange[1],
    ] as [number, number],
    minRating: searchParams.minRating?.toString() ?? DEFAULT_FILTER_STATE.minRating,
    keyword: "",
  };
}

function convertFiltersToUrlParams(filters: FilterState) {
  const params: Record<string, any> = {};

  if (filters.brands.length > 0) {
    params.brandId = filters.brands.map(Number);
  }

  if (filters.categories.length > 0) {
    params.categoryId = filters.categories.map(Number);
  }

  if (filters.priceRange[0] !== DEFAULT_FILTER_STATE.priceRange[0]) {
    params.priceMin = filters.priceRange[0];
  }

  if (filters.priceRange[1] !== DEFAULT_FILTER_STATE.priceRange[1]) {
    params.priceMax = filters.priceRange[1];
  }

  if (filters.minRating !== DEFAULT_FILTER_STATE.minRating) {
    params.minRating = filters.minRating;
  }
  if (filters.keyword) {
    params.keyword = filters.keyword;
  }

  return params;
}

export function useFilters({ categoriesData }: UseFiltersProps) {
  const searchParams = useSearch({ from: "/_storefront/search" });
  const navigate = useNavigate();

  // Initialize state from URL params
  const [pendingFilters, setPendingFilters] = useState<FilterState>(() =>
    getInitialFiltersFromParams(searchParams)
  );
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(() =>
    getInitialFiltersFromParams(searchParams)
  );

  // Sync state with URL params whenever they change
  useEffect(() => {
    const filtersFromParams = getInitialFiltersFromParams(searchParams);
    setAppliedFilters(filtersFromParams);
    setPendingFilters(filtersFromParams);
  }, [
    // Watch all search params that affect filters
    JSON.stringify(searchParams.categoryId),
    JSON.stringify(searchParams.brandId),
    searchParams.priceMin,
    searchParams.priceMax,
    // searchParams,
  ]);

  const togglePendingCategory = useCallback(
    (categoryId: string) => {
      setPendingFilters((prev) => {
        const isCurrentlySelected = prev.categories.includes(categoryId);
        let newCategories = [...prev.categories];

        // Find if this is a parent category
        const parentCategory = categoriesData?.find(
          (cat) => cat.id.toString() === categoryId
        );

        if (parentCategory?.children) {
          // This is a parent category
          const childrenIds = parentCategory.children.map((child) =>
            child.id.toString()
          );

          if (isCurrentlySelected) {
            // Unselect parent and all children
            newCategories = newCategories.filter(
              (c) => c !== categoryId && !childrenIds.includes(c)
            );
          } else {
            // Select parent and all children
            newCategories = [
              ...newCategories.filter(
                (c) => c !== categoryId && !childrenIds.includes(c)
              ),
              categoryId,
              ...childrenIds,
            ];
          }
        } else {
          // This is a child category or standalone category
          if (isCurrentlySelected) {
            newCategories = newCategories.filter((c) => c !== categoryId);
          } else {
            newCategories.push(categoryId);
          }

          // Check if we need to update parent selection
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
              // All children selected, add parent
              newCategories.push(parentId);
            } else if (!allChildrenSelected && newCategories.includes(parentId)) {
              // Not all children selected, remove parent
              newCategories = newCategories.filter((c) => c !== parentId);
            }
          }
        }

        return { ...prev, categories: newCategories };
      });
    },
    [categoriesData]
  );

  const togglePendingBrand = useCallback((brandId: string) => {
    setPendingFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter((b) => b !== brandId)
        : [...prev.brands, brandId],
    }));
  }, []);

  const updatePendingPriceRange = useCallback((priceRange: [number, number]) => {
    setPendingFilters((prev) => ({
      ...prev,
      priceRange,
    }));
  }, []);

  const updatePendingRating = useCallback((rating: string) => {
    setPendingFilters((prev) => ({
      ...prev,
      minRating: rating,
    }));
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters({ ...pendingFilters });
    navigate({
      to: "/search",
      search: {
        ...searchParams,
        ...convertFiltersToUrlParams(pendingFilters),
        page: 1, // Reset to first page when filters change
      },
    });
  }, [pendingFilters, navigate, searchParams]);

  const clearFilters = useCallback(() => {
    setPendingFilters(DEFAULT_FILTER_STATE);
    setAppliedFilters(DEFAULT_FILTER_STATE);
    navigate({
      to: "/search",
      search: {
        page: 1,
        limit: searchParams.limit,
        keyword: searchParams.keyword, // Preserve search query
      },
    });
  }, [navigate, searchParams.limit, searchParams.keyword]);

  const removeAppliedFilter = useCallback(
    (type: keyof FilterState, value: string) => {
      const newFilters = { ...appliedFilters };

      if (type === "categories") {
        // Find if this is a parent category
        const parentCategory = categoriesData?.find(
          (cat) => cat.id.toString() === value
        );

        if (parentCategory?.children) {
          // Remove parent and all children
          const childrenIds = parentCategory.children.map((child) =>
            child.id.toString()
          );
          newFilters.categories = newFilters.categories.filter(
            (c) => c !== value && !childrenIds.includes(c)
          );
        } else {
          // Remove the category
          newFilters.categories = newFilters.categories.filter(
            (v) => v !== value
          );

          // Check if we need to remove parent
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
        newFilters.minRating = DEFAULT_FILTER_STATE.minRating;
      } else if (type === "priceRange") {
        newFilters.priceRange = DEFAULT_FILTER_STATE.priceRange;
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
    },
    [appliedFilters, categoriesData, navigate, searchParams]
  );

  const hasActiveFilters = useMemo(
    () =>
      appliedFilters.categories.length > 0 ||
      appliedFilters.brands.length > 0 ||
      appliedFilters.minRating !== DEFAULT_FILTER_STATE.minRating ||
      appliedFilters.priceRange[0] !== DEFAULT_FILTER_STATE.priceRange[0] ||
      appliedFilters.priceRange[1] !== DEFAULT_FILTER_STATE.priceRange[1],
    [appliedFilters]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;

    // Count unique categories (don't count children if parent is selected)
    const uniqueCategories = appliedFilters.categories.filter((catId) => {
      const isChild = categoriesData?.some((parent) =>
        parent.children?.some((child) => child.id.toString() === catId)
      );

      if (isChild) {
        const parent = categoriesData?.find((parent) =>
          parent.children?.some((child) => child.id.toString() === catId)
        );
        // Don't count child if parent is also selected
        return !(
          parent && appliedFilters.categories.includes(parent.id.toString())
        );
      }
      return true;
    });

    count += uniqueCategories.length;
    count += appliedFilters.brands.length;

    if (appliedFilters.minRating !== DEFAULT_FILTER_STATE.minRating) {
      count += 1;
    }

    if (
      appliedFilters.priceRange[0] !== DEFAULT_FILTER_STATE.priceRange[0] ||
      appliedFilters.priceRange[1] !== DEFAULT_FILTER_STATE.priceRange[1]
    ) {
      count += 1;
    }

    return count;
  }, [appliedFilters, categoriesData]);

  const hasPendingChanges = useMemo(
    () => JSON.stringify(pendingFilters) !== JSON.stringify(appliedFilters),
    [pendingFilters, appliedFilters]
  );

  return {
    pendingFilters,
    appliedFilters,
    setPendingFilters,
    togglePendingCategory,
    togglePendingBrand,
    updatePendingPriceRange,
    updatePendingRating,
    applyFilters,
    clearFilters,
    removeAppliedFilter,
    hasActiveFilters,
    activeFilterCount,
    hasPendingChanges,
  };
}