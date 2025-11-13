import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { SORT_OPTIONS, type FilterState } from "./types";

interface SearchBarProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  showMobileFilters: boolean;
  onMobileFiltersChange: (show: boolean) => void;
  onClearFilters: () => void;
  filterContent: React.ReactNode;
  applyFilters: () => void;
  setPendingFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export function SearchBar({
  sortBy,
  onSortChange,
  hasActiveFilters,
  activeFilterCount,
  showMobileFilters,
  onMobileFiltersChange,
  onClearFilters,
  filterContent,
  applyFilters,
  setPendingFilters,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPendingFilters((prev) => ({
        ...prev,
        keyword: searchQuery,
      }));
      applyFilters();
    
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
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

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-[240px]">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.label} value={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <MobileFilterSheet
        show={showMobileFilters}
        onShowChange={onMobileFiltersChange}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
        onClearFilters={onClearFilters}
      >
        {filterContent}
      </MobileFilterSheet>
    </div>
  );
}

interface MobileFilterSheetProps {
  show: boolean;
  onShowChange: (show: boolean) => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onClearFilters: () => void;
  children: React.ReactNode;
}

function MobileFilterSheet({
  show,
  onShowChange,
  hasActiveFilters,
  activeFilterCount,
  onClearFilters,
  children,
}: MobileFilterSheetProps) {
  return (
    <Sheet open={show} onOpenChange={onShowChange}>
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
              onClick={onClearFilters}
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Xóa tất cả
            </Button>
          </div>
        </SheetHeader>
        <div className="mt-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
