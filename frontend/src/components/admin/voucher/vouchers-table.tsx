import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Tag,
  Percent,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface VouchersTableProps {
  search?: string;
  type?: "percentage" | "fixed";
  onEdit: (voucher: any) => void;
}

export function VouchersTable({ search, type, onEdit }: VouchersTableProps) {
  const [page, setPage] = useState(1);
  const limit = 20;

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, type]);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    trpc.vouchers.getVouchers.queryOptions({
      page,
      limit,
      keyword: search,
      type,
    })
  );

  const toggleStatusMutation = useMutation(
    trpc.vouchers.toggleVoucherStatus.mutationOptions({
      onSuccess: () => {
        toast.success("Cập nhật trạng thái voucher thành công");
        queryClient.invalidateQueries(
          trpc.vouchers.getVouchers.queryOptions({})
        );
      },
      onError: (error: any) => {
        toast.error(error.message || "Có lỗi xảy ra");
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.vouchers.deleteVoucher.mutationOptions({
      onSuccess: () => {
        toast.success("Xóa voucher thành công");
        queryClient.invalidateQueries(
          trpc.vouchers.getVouchers.queryOptions({})
        );
      },
      onError: (error: any) => {
        toast.error(error.message || "Có lỗi xảy ra khi xóa voucher");
      },
    })
  );

  const handleToggleStatus = (id: number) => {
    toggleStatusMutation.mutate({ id });
  };

  const handleDelete = (id: number, code: string) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa voucher "${code}"? Hành động này không thể hoàn tác.`
      )
    ) {
      deleteMutation.mutate({ id });
    }
  };

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Mã voucher",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <span className="font-mono font-semibold text-foreground">
              {row.original.code}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Tên",
        cell: ({ row }) => (
          <span className="text-sm text-foreground">
            {row.original.name || row.original.code}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: "Loại",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.type === "percentage" ? (
              <>
                <Percent className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Phần trăm</span>
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-sm">Cố định</span>
              </>
            )}
          </div>
        ),
      },
      {
        accessorKey: "discount",
        header: "Giảm giá",
        cell: ({ row }) => (
          <div className="font-semibold text-foreground">
            {row.original.type === "percentage"
              ? `${Number(row.original.discount)}%`
              : `${Number(row.original.discount).toLocaleString("vi-VN")}₫`}
            {row.original.maxDiscount && row.original.type === "percentage" && (
              <div className="text-xs text-muted-foreground">
                Max: {Number(row.original.maxDiscount).toLocaleString("vi-VN")}₫
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "minOrderAmount",
        header: "Đơn tối thiểu",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.minOrderAmount
              ? `${Number(row.original.minOrderAmount).toLocaleString("vi-VN")}₫`
              : "Không"}
          </span>
        ),
      },
      {
        accessorKey: "usageCount",
        header: "Đã dùng",
        cell: ({ row }) => (
          <div className="text-sm">
            <span className="font-semibold">
              {row.original.usageCount || 0}
            </span>
            {row.original.maxUsage && (
              <span className="text-muted-foreground">
                /{row.original.maxUsage}
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Trạng thái",
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? "default" : "secondary"}>
            {row.original.isActive ? "Hoạt động" : "Tạm dừng"}
          </Badge>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem
                className="text-foreground hover:bg-secondary"
                onClick={() => onEdit(row.original)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-foreground hover:bg-secondary"
                onClick={() => handleToggleStatus(row.original.id)}
              >
                {row.original.isActive ? (
                  <>
                    <ToggleLeft className="w-4 h-4 mr-2" />
                    Tạm dừng
                  </>
                ) : (
                  <>
                    <ToggleRight className="w-4 h-4 mr-2" />
                    Kích hoạt
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 hover:bg-secondary"
                onClick={() => handleDelete(row.original.id, row.original.code)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onEdit]
  );

  const table = useReactTable({
    data: data?.vouchers ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.total ?? 0) / limit),
  });

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không tìm thấy voucher nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Hiển thị {data?.vouchers.length ?? 0} trong tổng số{" "}
            {data?.total ?? 0} voucher
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>
            <div className="text-sm text-muted-foreground">
              Trang {page} / {Math.ceil((data?.total ?? 0) / limit) || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={
                page >= Math.ceil((data?.total ?? 0) / limit) ||
                (data?.vouchers.length ?? 0) < limit
              }
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
