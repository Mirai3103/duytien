import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  search: z.string().optional(),
});

export const Route = createFileRoute("/admin/_admin/orders")({
  component: RouteComponent,
  validateSearch: searchSchema,
});

import { Download, Search, Calendar, Filter, X, Loader2 } from "lucide-react";
import { OrderStats } from "@/components/admin/order/order-stats";
import { OrdersTable } from "@/components/admin/order/orders-table";
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
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/use-debounce";

type OrderStatus = "pending" | "shipping" | "delivered" | "cancelled";
type PaymentMethod = "cod" | "vnpay" | "momo";
type PaymentStatus = "pending" | "success" | "failed";

export default function OrdersPage() {
  const searchParams = Route.useSearch();
  const [search, setSearch] = useState(searchParams.search || "");
  const debouncedSearch = useDebounce(search, 500);
  const isSearching = search !== debouncedSearch;
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([]);

  // Update search when query params change
  useEffect(() => {
    if (searchParams.search) {
      setSearch(searchParams.search);
    }
  }, [searchParams.search]);
  const [paymentMethod, setPaymentMethod] = useState<
    PaymentMethod | undefined
  >();
  const [paymentStatus, setPaymentStatus] = useState<
    PaymentStatus | undefined
  >();
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  } | null>(null);

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "Chờ xác nhận" },
    { value: "shipping", label: "Đang giao" },
    { value: "delivered", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
    { value: "cod", label: "COD" },
    { value: "vnpay", label: "VNPay" },
    { value: "momo", label: "MoMo" },
  ];

  const paymentStatusOptions: { value: PaymentStatus; label: string }[] = [
    { value: "pending", label: "Chờ thanh toán" },
    { value: "success", label: "Đã thanh toán" },
    { value: "failed", label: "Thất bại" },
  ];

  const toggleStatus = (status: OrderStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedStatuses([]);
    setPaymentMethod(undefined);
    setPaymentStatus(undefined);
    setDateRange(null);
  };

  const hasActiveFilters =
    debouncedSearch ||
    selectedStatuses.length > 0 ||
    paymentMethod ||
    paymentStatus ||
    dateRange;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý đơn hàng
          </h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi và xử lý đơn hàng của khách hàng
          </p>
        </div>
        <Button variant="outline" className="border-border bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Stats */}
      <OrderStats />

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
              placeholder="Tìm kiếm đơn hàng, khách hàng..."
              className="pl-10 bg-card border-border text-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-border bg-transparent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Trạng thái
                {selectedStatuses.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 rounded-full px-2 py-0 text-xs"
                  >
                    {selectedStatuses.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-card border-border">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-foreground">
                  Lọc theo trạng thái
                </h4>
                <div className="space-y-2">
                  {statusOptions.map((status) => (
                    <div
                      key={status.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`status-${status.value}`}
                        checked={selectedStatuses.includes(status.value)}
                        onCheckedChange={() => toggleStatus(status.value)}
                      />
                      <Label
                        htmlFor={`status-${status.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {status.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-border bg-transparent"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Ngày đặt
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

          {/* Payment Method Filter */}
          <Select
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          >
            <SelectTrigger className="w-[180px] bg-transparent border-border">
              <SelectValue placeholder="Phương thức" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                onClick={() => setPaymentMethod(undefined)}
              >
                Tất cả phương thức
              </SelectItem>
              {paymentMethodOptions.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Payment Status Filter */}
          <Select
            value={paymentStatus}
            onValueChange={(value) => setPaymentStatus(value as PaymentStatus)}
          >
            <SelectTrigger className="w-[180px] bg-transparent border-border">
              <SelectValue placeholder="Thanh toán" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                onClick={() => setPaymentStatus(undefined)}
              >
                Tất cả trạng thái
              </SelectItem>
              {paymentStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
        {(selectedStatuses.length > 0 || dateRange) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Đang lọc:</span>
            {selectedStatuses.map((status) => (
              <Badge key={status} variant="secondary" className="gap-1">
                {statusOptions.find((s) => s.value === status)?.label}
                <button
                  onClick={() => toggleStatus(status)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {dateRange && (
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
            )}
          </div>
        )}
      </div>

      {/* Orders Table */}
      <OrdersTable
        search={debouncedSearch}
        status={selectedStatuses.length > 0 ? selectedStatuses : undefined}
        paymentMethod={paymentMethod}
        paymentStatus={paymentStatus}
        dateRange={dateRange}
      />
    </div>
  );
}

function RouteComponent() {
  return <OrdersPage />;
}
