import { useState, useMemo } from "react";
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

      <RatingFilter
        minRating={pendingFilters.minRating}
        onRatingChange={(value) =>
          setPendingFilters((prev) => ({ ...prev, minRating: value }))
        }
      />

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

function PriceRangeFilter({
  priceRange,
  onPriceRangeChange,
}: PriceRangeFilterProps) {
  return (
    <div>
      <h3 className="font-semibold text-base mb-2">Khoảng giá</h3>
      <div className="px-2">
        <Slider
          value={priceRange}
          onValueChange={onPriceRangeChange}
          max={MAX_PRICE}
          step={PRICE_STEP}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{(priceRange[0] / 1000000).toFixed(0)}tr</span>
          <span>{(priceRange[1] / 1000000).toFixed(0)}tr</span>
        </div>
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
