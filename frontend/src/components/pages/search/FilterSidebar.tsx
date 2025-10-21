import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FilterSidebarProps {
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onClearFilters: () => void;
  children: React.ReactNode;
}

export function FilterSidebar({
  hasActiveFilters,
  activeFilterCount,
  onClearFilters,
  children,
}: FilterSidebarProps) {
  return (
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
                onClick={onClearFilters}
                className="h-7 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Xóa tất cả
              </Button>
            )}
          </div>
          {children}
        </CardContent>
      </Card>
    </aside>
  );
}
