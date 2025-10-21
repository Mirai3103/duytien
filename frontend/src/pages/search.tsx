import { useQueries } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import _ from "lodash";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTRPC } from "@/lib/trpc";
import type { GetProductsWithVariantsResponse } from "@/types/backend/trpc/routes/products.route";

// Remove unused Product type
function ProductCard({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  if (product.variants.length === 0) console.log(product);

  const attrs = React.useMemo(() => {
    function extractAttrs(product: any) {
      const grouped = _.flatMap(product.variants, "variantValues");
      const groupedByAttr = _.groupBy(grouped, (vv) => vv.value.attribute.name);
      return _.map(groupedByAttr, (arr, attrName) => ({
        name: attrName,
        values: _.uniqBy(arr, (vv) => vv.value.value).map((vv) => ({
          value: vv.value.value,
          displayValue: vv.value.metadata?.displayValue ?? vv.value.value,
          code: vv.value.metadata?.code ?? null,
        })),
      }));
    }
    return extractAttrs(product);
  }, [product]);

  // Handle variant selection
  const handleAttributeChange = (attrName: string, attrValue: string) => {
    const currentSelection = selectedVariant.variantValues.reduce(
      (acc: any, vv: any) => {
        acc[vv.value.attribute.name] = vv.value.value;
        return acc;
      },
      {} as Record<string, string>
    );

    // Update the selection for this attribute
    currentSelection[attrName] = attrValue;

    // Find variant that matches all current selections
    const matchingVariant = product.variants.find((variant: any) => {
      const variantAttrs = variant.variantValues.reduce(
        (acc: any, vv: any) => {
          acc[vv.value.attribute.name] = vv.value.value;
          return acc;
        },
        {} as Record<string, string>
      );

      return Object.keys(currentSelection).every(
        (key) => variantAttrs[key] === currentSelection[key]
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  // Check if an attribute value is available with current selection
  const isAttributeAvailable = (attrName: string, attrValue: string) => {
    const currentSelection = selectedVariant.variantValues.reduce(
      (acc: any, vv: any) => {
        acc[vv.value.attribute.name] = vv.value.value;
        return acc;
      },
      {} as Record<string, string>
    );

    const tempSelection = { ...currentSelection, [attrName]: attrValue };

    return product.variants.some((variant: any) => {
      const variantAttrs = variant.variantValues.reduce(
        (acc: any, vv: any) => {
          acc[vv.value.attribute.name] = vv.value.value;
          return acc;
        },
        {} as Record<string, string>
      );

      return Object.keys(tempSelection).every(
        (key) => variantAttrs[key] === tempSelection[key]
      );
    });
  };

  const originalPrice = parseInt(selectedVariant.price, 10);

  const navigate = useNavigate();
  const totalVariants = product.variants.length;
  return (
    <Card
      onClick={() =>
        navigate({
          to: "/product/$id",
          params: { id: selectedVariant.id },
          search: { isSpu: false },
        })
      }
      className="group hover:shadow-lg transition-all duration-300 hover:border-primary cursor-pointer overflow-hidden"
    >
      <CardContent className="p-3">
        <div className="relative mb-3">
          {/* {isOnSale && (
            <Badge className="absolute top-2 left-2 z-10 bg-primary text-white shadow-md">
              -{discountPercent}%
            </Badge>
          )} */}
          <img
            src={selectedVariant.image!}
            alt={selectedVariant.name}
            className="w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h3 className="font-medium text-sm mb-2 line-clamp-2 min-h-[40px]">
          {selectedVariant.name}
        </h3>
        <div className="space-y-1 mb-3">
          {/* {isOnSale && (
            <div className="text-xs text-muted-foreground line-through">
              {originalPrice.toLocaleString("vi-VN")}đ
            </div>
          )} */}
          <div className="text-lg font-bold text-primary">
            {originalPrice.toLocaleString("vi-VN")}đ
          </div>
        </div>
        {/* Variant Selection */}
        {totalVariants > 1 && (
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
                    const isAvailable = isAttributeAvailable(
                      attr.name,
                      value.value
                    );

                    if (
                      attr.name.toLowerCase().includes("màu") ||
                      attr.name.toLowerCase().includes("color")
                    ) {
                      // Color swatches
                      return (
                        <button
                          type="button"
                          key={value.value}
                          onClick={() =>
                            handleAttributeChange(attr.name, value.value)
                          }
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
                    } else {
                      // Text options (capacity, size, etc.)
                      return (
                        <button
                          type="button"
                          key={value.value}
                          onClick={() =>
                            handleAttributeChange(attr.name, value.value)
                          }
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
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
interface SearchProductsProps {
  products: GetProductsWithVariantsResponse;
  total: number;
}

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  minRating: string;
}

const sortOptions = [
  { label: "Mới nhất", value: { field: "createdAt", direction: "desc" } },
  { label: "Giá tăng dần", value: { field: "price", direction: "asc" } },
  { label: "Giá giảm dần", value: { field: "price", direction: "desc" } },
  { label: "Nổi bật", value: { field: "name", direction: "desc" } }, //tạm
];

const SearchProducts = ({ products, total }: SearchProductsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Mới nhất");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pending filters (not yet applied)
  const [pendingFilters, setPendingFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 50000000],
    minRating: "0",
  });

  // Applied filters (used for actual filtering)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 50000000],
    minRating: "0",
  });

  const searchParams = useSearch({ from: "/_storefront/search" });
  const totalPages = Math.ceil(total / searchParams.limit);
  const currentPage = searchParams.page;
  const navigate = useNavigate();
  React.useEffect(() => {
    const label = sortBy || "Mới nhất";
    const value = sortOptions.find((option) => option.label === label)?.value;
    if (value) {
      navigate({
        to: "/search",
        search: {
          ...searchParams,
          sortField: value.field as any,
          sortDirection: value.direction as any,
        },
      });
    }
  }, [sortBy, navigate, searchParams]);
  React.useEffect(() => {
    setSortBy(
      sortOptions.find(
        (option) =>
          option.value.field === searchParams.sortField &&
          option.value.direction === searchParams.sortDirection
      )?.label ?? "Mới nhất"
    );
  }, [searchParams.sortField, searchParams.sortDirection]);
  const trpc = useTRPC();
  const [categoriesQuery, brandsQuery] = useQueries({
    queries: [
      trpc.categories.getAllParentCategories.queryOptions(),
      trpc.brands.getAll.queryOptions({ page: 1, limit: 200, search: "" }),
    ],
  });
  const handlePageChange = (page: number) => {
    navigate({
      to: "/search",
      search: {
        ...searchParams,
        page,
      },
    });
  };

  const togglePendingCategory = (categoryId: string) => {
    setPendingFilters((prev) => {
      const isCurrentlySelected = prev.categories.includes(categoryId);
      let newCategories = [...prev.categories];

      // Find the category and its children
      const parentCategory = categoriesQuery.data?.find(
        (cat) => cat.id.toString() === categoryId
      );

      if (parentCategory && parentCategory.children) {
        // This is a parent category with children
        const childrenIds = parentCategory.children.map((child) =>
          child.id.toString()
        );

        if (isCurrentlySelected) {
          // Uncheck parent and all children
          newCategories = newCategories.filter(
            (c) => c !== categoryId && !childrenIds.includes(c)
          );
        } else {
          // Check parent and all children
          newCategories = [
            ...newCategories.filter(
              (c) => c !== categoryId && !childrenIds.includes(c)
            ),
            categoryId,
            ...childrenIds,
          ];
        }
      } else {
        // This is a child category or parent without children
        if (isCurrentlySelected) {
          newCategories = newCategories.filter((c) => c !== categoryId);
        } else {
          newCategories.push(categoryId);
        }

        // Check if this is a child - find its parent
        const parent = categoriesQuery.data?.find((parent) =>
          parent.children?.some((child) => child.id.toString() === categoryId)
        );

        if (parent) {
          const parentId = parent.id.toString();
          const allChildrenIds =
            parent.children?.map((c) => c.id.toString()) || [];
          const allChildrenSelected = allChildrenIds.every((id) =>
            newCategories.includes(id)
          );

          // If all children are selected, also select the parent
          if (allChildrenSelected && !newCategories.includes(parentId)) {
            newCategories.push(parentId);
          } else if (!allChildrenSelected && newCategories.includes(parentId)) {
            // If not all children are selected, uncheck the parent
            newCategories = newCategories.filter((c) => c !== parentId);
          }
        }
      }

      return {
        ...prev,
        categories: newCategories,
      };
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
    setShowMobileFilters(false);
    navigate({
      to: "/search",
      search: {
        ...searchParams,
        brandId: pendingFilters.brands,
        categoryId: pendingFilters.categories,
        priceMin: pendingFilters.priceRange[0],
        priceMax: pendingFilters.priceRange[1],
        page: 1,
      },
    });
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      categories: [],
      brands: [],
      priceRange: [0, 50000000],
      minRating: "0",
    };
    setPendingFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSearchQuery("");
  };

  const removeAppliedFilter = (type: keyof FilterState, value: string) => {
    const newFilters = { ...appliedFilters };

    if (type === "categories") {
      // Check if this is a parent category with children
      const parentCategory = categoriesQuery.data?.find(
        (cat) => cat.id.toString() === value
      );

      if (parentCategory && parentCategory.children) {
        // Remove parent and all children
        const childrenIds = parentCategory.children.map((child) =>
          child.id.toString()
        );
        newFilters.categories = newFilters.categories.filter(
          (c) => c !== value && !childrenIds.includes(c)
        );
      } else {
        // Just remove this category
        newFilters.categories = newFilters.categories.filter(
          (v) => v !== value
        );

        // Check if this is a child - also remove parent if exists
        const parent = categoriesQuery.data?.find((parent) =>
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
  };

  const hasActiveFilters =
    appliedFilters.categories.length > 0 ||
    appliedFilters.brands.length > 0 ||
    appliedFilters.minRating !== "0" ||
    appliedFilters.priceRange[0] !== 0 ||
    appliedFilters.priceRange[1] !== 50000000;

  // Count unique filters (don't count children if parent is selected)
  const activeFilterCount = useMemo(() => {
    let count = 0;

    // Count categories (excluding children if parent is selected)
    const uniqueCategories = appliedFilters.categories.filter((catId) => {
      const isChild = categoriesQuery.data?.some((parent) =>
        parent.children?.some((child) => child.id.toString() === catId)
      );

      if (isChild) {
        const parent = categoriesQuery.data?.find((parent) =>
          parent.children?.some((child) => child.id.toString() === catId)
        );
        return !(
          parent && appliedFilters.categories.includes(parent.id.toString())
        );
      }
      return true;
    });
    count += uniqueCategories.length;

    // Count brands
    count += appliedFilters.brands.length;

    // Count rating
    if (appliedFilters.minRating !== "0") count += 1;

    return count;
  }, [appliedFilters, categoriesQuery.data]);

  const FilterContent = () => {
    const [categorySearch, setCategorySearch] = useState("");
    const [brandSearch, setBrandSearch] = useState("");
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showAllBrands, setShowAllBrands] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
      new Set()
    );

    const toggleCategoryExpand = (categoryId: string) => {
      setExpandedCategories((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(categoryId)) {
          newSet.delete(categoryId);
        } else {
          newSet.add(categoryId);
        }
        return newSet;
      });
    };

    // Flatten categories with children
    const flattenedCategories = useMemo(() => {
      const result: Array<{
        id: number;
        name: string;
        parentId: number | null;
        level: number;
        hasChildren: boolean;
      }> = [];

      categoriesQuery.data?.forEach((parent) => {
        result.push({
          id: parent.id,
          name: parent.name,
          parentId: null,
          level: 0,
          hasChildren: (parent.children?.length ?? 0) > 0,
        });

        parent.children?.forEach((child) => {
          result.push({
            id: child.id,
            name: child.name,
            parentId: parent.id,
            level: 1,
            hasChildren: false,
          });
        });
      });

      return result;
    }, [categoriesQuery.data]);

    const filteredCategories = useMemo(() => {
      if (!categorySearch) return flattenedCategories;
      return flattenedCategories.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
      );
    }, [flattenedCategories, categorySearch]);

    const filteredBrands = useMemo(() => {
      if (!brandSearch) return brandsQuery.data ?? [];
      return (brandsQuery.data ?? []).filter((brand) =>
        brand.name.toLowerCase().includes(brandSearch.toLowerCase())
      );
    }, [brandsQuery.data, brandSearch]);

    const displayedCategories = showAllCategories
      ? filteredCategories
      : filteredCategories.slice(0, 8);

    const displayedBrands = showAllBrands
      ? filteredBrands
      : filteredBrands.slice(0, 8);

    return (
      <div className="space-y-4">
        {/* Categories */}
        <div>
          <h3 className="font-semibold text-base mb-2">Danh mục</h3>
          <Input
            placeholder="Tìm danh mục..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="mb-2 h-9"
          />
          <ScrollArea className="h-[200px] pr-3">
            <div className="space-y-1.5">
              {displayedCategories.map((category) => {
                const isExpanded = expandedCategories.has(
                  category.id.toString()
                );
                const shouldShow =
                  category.level === 0 ||
                  (category.parentId &&
                    expandedCategories.has(category.parentId.toString()));

                if (!shouldShow && !categorySearch) return null;

                return (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                    style={{ paddingLeft: `${category.level * 16}px` }}
                  >
                    {category.hasChildren && !categorySearch && (
                      <button
                        type="button"
                        onClick={() =>
                          toggleCategoryExpand(category.id.toString())
                        }
                        className="p-0.5 hover:bg-muted rounded"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </button>
                    )}
                    {!category.hasChildren &&
                      category.level > 0 &&
                      !categorySearch && <div className="w-4" />}
                    <Checkbox
                      id={`cat-${category.id}`}
                      checked={pendingFilters.categories.includes(
                        category.id.toString()
                      )}
                      onCheckedChange={() =>
                        togglePendingCategory(category.id.toString())
                      }
                    />
                    <Label
                      htmlFor={`cat-${category.id}`}
                      className="text-sm cursor-pointer flex-1 leading-tight"
                    >
                      {category.name}
                    </Label>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          {filteredCategories.length > 8 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="w-full mt-2 h-8 text-xs"
            >
              {showAllCategories ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Thu gọn
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Xem thêm ({filteredCategories.length - 8})
                </>
              )}
            </Button>
          )}
        </div>

        {/* Brands */}
        <div>
          <h3 className="font-semibold text-base mb-2">Thương hiệu</h3>
          <Input
            placeholder="Tìm thương hiệu..."
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="mb-2 h-9"
          />
          <ScrollArea className="h-[200px] pr-3">
            <div className="space-y-1.5">
              {displayedBrands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={pendingFilters.brands.includes(
                      brand.id.toString()
                    )}
                    onCheckedChange={() =>
                      togglePendingBrand(brand.id.toString())
                    }
                  />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm cursor-pointer flex-1 leading-tight"
                  >
                    {brand.name}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
          {filteredBrands.length > 8 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="w-full mt-2 h-8 text-xs"
            >
              {showAllBrands ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Thu gọn
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Xem thêm ({filteredBrands.length - 8})
                </>
              )}
            </Button>
          )}
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold text-base mb-2">Khoảng giá</h3>
          <div className="px-2">
            <Slider
              value={pendingFilters.priceRange}
              onValueChange={(value) =>
                setPendingFilters((prev) => ({
                  ...prev,
                  priceRange: value as [number, number],
                }))
              }
              max={50000000}
              step={1000000}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {(pendingFilters.priceRange[0] / 1000000).toFixed(0)}tr
              </span>
              <span>
                {(pendingFilters.priceRange[1] / 1000000).toFixed(0)}tr
              </span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div>
          <h3 className="font-semibold text-base mb-2">Đánh giá</h3>
          <RadioGroup
            value={pendingFilters.minRating}
            onValueChange={(value) =>
              setPendingFilters((prev) => ({ ...prev, minRating: value }))
            }
          >
            <div className="space-y-1.5">
              {["4.5", "4", "3.5", "3", "0"].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating} id={`rating-${rating}`} />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="text-sm cursor-pointer"
                  >
                    {rating === "0" ? "Tất cả" : `Từ ${rating} sao trở lên`}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Apply Button */}
        <div className="pt-2 border-t">
          <Button onClick={applyFilters} className="w-full">
            Áp dụng bộ lọc
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Search & Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[240px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.label} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Bộ lọc
                  {hasActiveFilters && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="overflow-y-auto w-[300px] sm:w-[350px]"
              >
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    <SheetTitle>Bộ lọc</SheetTitle>
                    <Button
                      onClick={clearFilters}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Xóa tất cả
                    </Button>
                  </div>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {appliedFilters.categories.map((catId) => {
                // Don't show children if parent is also selected
                const isChild = categoriesQuery.data?.some((parent) =>
                  parent.children?.some(
                    (child) => child.id.toString() === catId
                  )
                );

                if (isChild) {
                  const parent = categoriesQuery.data?.find((parent) =>
                    parent.children?.some(
                      (child) => child.id.toString() === catId
                    )
                  );

                  if (
                    parent &&
                    appliedFilters.categories.includes(parent.id.toString())
                  ) {
                    // Parent is selected, don't show this child badge
                    return null;
                  }
                }

                const category = categoriesQuery.data
                  ?.flatMap((parent) => [parent, ...(parent.children || [])])
                  .find((cat) => cat.id.toString() === catId);

                return (
                  <Badge key={catId} variant="secondary" className="gap-1">
                    {category?.name || catId}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeAppliedFilter("categories", catId)}
                    />
                  </Badge>
                );
              })}
              {appliedFilters.brands.map((brandId) => {
                const brand = brandsQuery.data?.find(
                  (b) => b.id.toString() === brandId
                );
                return (
                  <Badge key={brandId} variant="secondary" className="gap-1">
                    {brand?.name || brandId}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeAppliedFilter("brands", brandId)}
                    />
                  </Badge>
                );
              })}
              {appliedFilters.minRating !== "0" && (
                <Badge variant="secondary" className="gap-1">
                  Từ {appliedFilters.minRating} sao
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeAppliedFilter("minRating", "")}
                  />
                </Badge>
              )}
              {(appliedFilters.priceRange[0] !== 0 ||
                appliedFilters.priceRange[1] !== 50000000) && (
                <Badge variant="secondary" className="gap-1">
                  {(appliedFilters.priceRange[0] / 1000000).toFixed(0)}tr -{" "}
                  {(appliedFilters.priceRange[1] / 1000000).toFixed(0)}tr
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 text-xs"
              >
                Xóa tất cả
              </Button>
            </div>
          )}

          <div className="flex gap-6">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden md:block w-72 flex-shrink-0">
              <Card className="sticky top-4">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">Bộ lọc</h2>
                      {hasActiveFilters && (
                        <Badge
                          variant="secondary"
                          className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                          {activeFilterCount}
                        </Badge>
                      )}
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-7 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Xóa tất cả
                      </Button>
                    )}
                  </div>
                  <FilterContent />
                </CardContent>
              </Card>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-4 text-sm text-muted-foreground">
                Tìm thấy {total} sản phẩm
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length > 0 && totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}

              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Không tìm thấy sản phẩm phù hợp
                  </p>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="mt-4"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pageNumbers = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow + 2) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) {
      pageNumbers.push(-1); // Ellipsis
    }
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      start = 2;
      end = 4;
    }
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
      end = totalPages - 1;
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push(-1); // Ellipsis
    }
    pageNumbers.push(totalPages);
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pageNumbers.map((page, index) =>
        page === -1 ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        )
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default SearchProducts;
