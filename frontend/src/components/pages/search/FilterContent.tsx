import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FilterState } from "./types";
import { MAX_PRICE, PRICE_STEP, INITIAL_ITEMS_DISPLAY } from "./types";

interface Category {
  id: number;
  name: string;
  children?: Category[];
}

interface Brand {
  id: number;
  name: string;
}

interface FilterContentProps {
  pendingFilters: FilterState;
  setPendingFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  togglePendingCategory: (categoryId: string) => void;
  togglePendingBrand: (brandId: string) => void;
  applyFilters: () => void;
  categoriesData?: Category[];
  brandsData?: Brand[];
}

export function FilterContent({
  pendingFilters,
  setPendingFilters,
  togglePendingCategory,
  togglePendingBrand,
  applyFilters,
  categoriesData,
  brandsData,
}: FilterContentProps) {
  return (
    <div className="space-y-4">
      <CategoryFilter
        categoriesData={categoriesData}
        selectedCategories={pendingFilters.categories}
        onToggleCategory={togglePendingCategory}
      />

      <BrandFilter
        brandsData={brandsData}
        selectedBrands={pendingFilters.brands}
        onToggleBrand={togglePendingBrand}
      />

      <PriceRangeFilter
        priceRange={pendingFilters.priceRange}
        onPriceRangeChange={(value) =>
          setPendingFilters((prev) => ({
            ...prev,
            priceRange: value as [number, number],
          }))
        }
      />

      {/* <RatingFilter
        minRating={pendingFilters.minRating}
        onRatingChange={(value) =>
          setPendingFilters((prev) => ({ ...prev, minRating: value }))
        }
      /> */}

      <div className="pt-2 border-t">
        <Button onClick={applyFilters} className="w-full">
          Áp dụng bộ lọc
        </Button>
      </div>
    </div>
  );
}

interface CategoryFilterProps {
  categoriesData?: Category[];
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
}

function CategoryFilter({
  categoriesData,
  selectedCategories,
  onToggleCategory,
}: CategoryFilterProps) {
  const [categorySearch, setCategorySearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
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

  const flattenedCategories = useMemo(() => {
    const result: Array<{
      id: number;
      name: string;
      parentId: number | null;
      level: number;
      hasChildren: boolean;
    }> = [];

    categoriesData?.forEach((parent) => {
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
  }, [categoriesData]);

  const filteredCategories = useMemo(() => {
    if (!categorySearch) return flattenedCategories;
    return flattenedCategories.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [flattenedCategories, categorySearch]);

  const displayedCategories = showAllCategories
    ? filteredCategories
    : filteredCategories.slice(0, INITIAL_ITEMS_DISPLAY);

  return (
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
            const isExpanded = expandedCategories.has(category.id.toString());
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
                    onClick={() => toggleCategoryExpand(category.id.toString())}
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
                  checked={selectedCategories.includes(category.id.toString())}
                  onCheckedChange={() =>
                    onToggleCategory(category.id.toString())
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
      {filteredCategories.length > INITIAL_ITEMS_DISPLAY && (
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
              Xem thêm ({filteredCategories.length - INITIAL_ITEMS_DISPLAY})
            </>
          )}
        </Button>
      )}
    </div>
  );
}

interface BrandFilterProps {
  brandsData?: Brand[];
  selectedBrands: string[];
  onToggleBrand: (brandId: string) => void;
}

function BrandFilter({
  brandsData,
  selectedBrands,
  onToggleBrand,
}: BrandFilterProps) {
  const [brandSearch, setBrandSearch] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);

  const filteredBrands = useMemo(() => {
    if (!brandSearch) return brandsData ?? [];
    return (brandsData ?? []).filter((brand) =>
      brand.name.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [brandsData, brandSearch]);

  const displayedBrands = showAllBrands
    ? filteredBrands
    : filteredBrands.slice(0, INITIAL_ITEMS_DISPLAY);

  return (
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
                checked={selectedBrands.includes(brand.id.toString())}
                onCheckedChange={() => onToggleBrand(brand.id.toString())}
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
      {filteredBrands.length > INITIAL_ITEMS_DISPLAY && (
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
              Xem thêm ({filteredBrands.length - INITIAL_ITEMS_DISPLAY})
            </>
          )}
        </Button>
      )}
    </div>
  );
}

interface PriceRangeFilterProps {
  priceRange: [number, number];
  onPriceRangeChange: (value: number[]) => void;
}


function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function parseCurrency(value: string): number {
  // Remove all non-digit characters
  const cleanValue = value.replace(/\D/g, "");
  return cleanValue ? parseInt(cleanValue, 10) : 0;
}

function PriceRangeFilter({
  priceRange,
  onPriceRangeChange,
}: PriceRangeFilterProps) {
  // Local state for input values (formatted strings)
  const [minValue, setMinValue] = useState(formatCurrency(priceRange[0]));
  const [maxValue, setMaxValue] = useState(formatCurrency(priceRange[1]));
  const [error, setError] = useState<string>("");

  // Update local state when priceRange prop changes
  useEffect(() => {
    setMinValue(formatCurrency(priceRange[0]));
    setMaxValue(formatCurrency(priceRange[1]));
  }, [priceRange[0], priceRange[1]]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinValue(value);
    setError("");

    const numericValue = parseCurrency(value);
    const maxNumeric = parseCurrency(maxValue);

    if (numericValue > maxNumeric) {
      setError("Giá tối thiểu không được lớn hơn giá tối đa");
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxValue(value);
    setError("");

    const minNumeric = parseCurrency(minValue);
    const numericValue = parseCurrency(value);

    if (numericValue < minNumeric && numericValue !== 0) {
      setError("Giá tối đa không được nhỏ hơn giá tối thiểu");
    }
  };

  const handleMinBlur = () => {
    const numericValue = parseCurrency(minValue);
    const maxNumeric = parseCurrency(maxValue);

    // Format the value
    setMinValue(formatCurrency(numericValue));

    // Validate and update
    if (numericValue <= maxNumeric) {
      onPriceRangeChange([numericValue, maxNumeric]);
      setError("");
    } else {
      // Reset to previous valid value
      setMinValue(formatCurrency(priceRange[0]));
      setError("");
    }
  };

  const handleMaxBlur = () => {
    const minNumeric = parseCurrency(minValue);
    const numericValue = parseCurrency(maxValue);

    // Format the value
    setMaxValue(formatCurrency(numericValue));

    // Validate and update
    if (numericValue >= minNumeric || numericValue === 0) {
      onPriceRangeChange([minNumeric, numericValue]);
      setError("");
    } else {
      // Reset to previous valid value
      setMaxValue(formatCurrency(priceRange[1]));
      setError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow Enter to trigger blur (which will format and validate)
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-base mb-3">Khoảng giá</h3>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="min-price" className="text-sm text-muted-foreground">
            Từ
          </Label>
          <div className="relative">
            <Input
              id="min-price"
              type="text"
              inputMode="numeric"
              value={minValue}
              onChange={handleMinChange}
              onBlur={handleMinBlur}
              onKeyDown={handleKeyDown}
              placeholder="0"
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₫
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-price" className="text-sm text-muted-foreground">
            Đến
          </Label>
          <div className="relative">
            <Input
              id="max-price"
              type="text"
              inputMode="numeric"
              value={maxValue}
              onChange={handleMaxChange}
              onBlur={handleMaxBlur}
              onKeyDown={handleKeyDown}
              placeholder="0"
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₫
            </span>
          </div>
        </div>

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        {!error && priceRange[0] > 0 && priceRange[1] > 0 && (
          <p className="text-xs text-muted-foreground">
            Khoảng giá: {formatCurrency(priceRange[0])}₫ - {formatCurrency(priceRange[1])}₫
          </p>
        )}
      </div>
    </div>
  );
}

interface RatingFilterProps {
  minRating: string;
  onRatingChange: (value: string) => void;
}

function RatingFilter({ minRating, onRatingChange }: RatingFilterProps) {
  const ratingOptions = ["4.5", "4", "3.5", "3", "0"];

  return (
    <div>
      <h3 className="font-semibold text-base mb-2">Đánh giá</h3>
      <RadioGroup value={minRating} onValueChange={onRatingChange}>
        <div className="space-y-1.5">
          {ratingOptions.map((rating) => (
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
  );
}
