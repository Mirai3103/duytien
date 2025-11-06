import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/customers")({
  component: RouteComponent,
});

import { Search, Calendar, X, Loader2 } from "lucide-react";
import { CustomersTable } from "@/components/admin/customer/customers-table";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const isSearching = search !== debouncedSearch;
  const [emailVerified, setEmailVerified] = useState<boolean | undefined>();
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  } | null>(null);

  const clearAllFilters = () => {
    setSearch("");
    setEmailVerified(undefined);
    setDateRange(null);
  };

  const hasActiveFilters =
    debouncedSearch || emailVerified !== undefined || dateRange;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý khách hàng
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin và lịch sử mua hàng của khách hàng
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            )}
            <Input
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              className="pl-10 bg-card border-border text-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Email Verified Filter */}
          <Select
            value={
              emailVerified === undefined
                ? "all"
                : emailVerified
                  ? "verified"
                  : "unverified"
            }
            onValueChange={(value) => {
              if (value === "all") setEmailVerified(undefined);
              else if (value === "verified") setEmailVerified(true);
              else setEmailVerified(false);
            }}
          >
            <SelectTrigger className="w-[180px] bg-transparent border-border">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="verified">Đã xác thực</SelectItem>
              <SelectItem value="unverified">Chưa xác thực</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-border bg-transparent"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Ngày tham gia
                {dateRange && (
                  <Badge
                    variant="secondary"
                    className="ml-2 rounded-full px-2 py-0 text-xs"
                  >
                    1
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-card border-border">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-foreground">
                  Chọn khoảng thời gian
                </h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="date-from" className="text-sm">
                      Từ ngày
                    </Label>
                    <Input
                      id="date-from"
                      type="date"
                      className="bg-background border-border"
                      value={
                        dateRange?.from
                          ? dateRange.from.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setDateRange({
                          ...dateRange,
                          from: e.target.value
                            ? new Date(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-to" className="text-sm">
                      Đến ngày
                    </Label>
                    <Input
                      id="date-to"
                      type="date"
                      className="bg-background border-border"
                      value={
                        dateRange?.to
                          ? dateRange.to.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setDateRange({
                          ...dateRange,
                          to: e.target.value
                            ? new Date(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setDateRange(null)}
                    >
                      Xóa
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        setDateRange({
                          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                          to: new Date(),
                        })
                      }
                    >
                      30 ngày gần đây
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {dateRange && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Đang lọc:</span>
            <Badge variant="secondary" className="gap-1">
              {dateRange.from?.toLocaleDateString("vi-VN")} -{" "}
              {dateRange.to?.toLocaleDateString("vi-VN")}
              <button
                onClick={() => setDateRange(null)}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <CustomersTable
        search={debouncedSearch}
        emailVerified={emailVerified}
        dateRange={dateRange}
      />
    </div>
  );
}

function RouteComponent() {
  return <CustomersPage />;
}
