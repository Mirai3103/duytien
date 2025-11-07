import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/vouchers")({
  component: RouteComponent,
});

import { Search, Plus, X, Loader2, Percent, DollarSign } from "lucide-react";
import { VouchersTable } from "@/components/admin/voucher/vouchers-table";
import { VoucherFormModal } from "@/components/admin/voucher/voucher-form-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export default function VouchersPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const isSearching = search !== debouncedSearch;
  const [type, setType] = useState<"percentage" | "fixed" | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  const clearAllFilters = () => {
    setSearch("");
    setType(undefined);
  };

  const hasActiveFilters = debouncedSearch || type;

  const handleEdit = (voucher: any) => {
    setSelectedVoucher(voucher);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý Voucher
          </h1>
          <p className="text-muted-foreground mt-1">
            Tạo và quản lý mã giảm giá cho khách hàng
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo voucher
        </Button>
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
              placeholder="Tìm kiếm theo mã voucher..."
              className="pl-10 bg-card border-border text-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <Select
            value={type || "all"}
            onValueChange={(value) =>
              setType(
                value === "all" ? undefined : (value as "percentage" | "fixed")
              )
            }
          >
            <SelectTrigger className="w-[200px] bg-transparent border-border">
              <SelectValue placeholder="Loại voucher" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="percentage">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Phần trăm
                </div>
              </SelectItem>
              <SelectItem value="fixed">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Cố định
                </div>
              </SelectItem>
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
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Đang lọc:</span>
            {type && (
              <Badge variant="secondary" className="gap-1">
                {type === "percentage" ? (
                  <>
                    <Percent className="w-3 h-3" />
                    Phần trăm
                  </>
                ) : (
                  <>
                    <DollarSign className="w-3 h-3" />
                    Cố định
                  </>
                )}
                <button
                  onClick={() => setType(undefined)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Vouchers Table */}
      <VouchersTable search={debouncedSearch} type={type} onEdit={handleEdit} />

      {/* Create Modal */}
      <VoucherFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        mode="create"
      />

      {/* Edit Modal */}
      <VoucherFormModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        voucher={selectedVoucher}
        mode="edit"
      />
    </div>
  );
}

function RouteComponent() {
  return <VouchersPage />;
}
