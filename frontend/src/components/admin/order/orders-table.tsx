import {
  Eye,
  MoreHorizontal,
  Truck,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from "@tanstack/react-table";
import React, { useState, useEffect, useCallback } from "react";
import { useTRPC } from "@/lib/trpc";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import OrderDetailModal from "./detail-model";

type Order = {
  id: number;
  code: string | null;
  userId: string;
  totalAmount: string;
  totalItems: number;
  status: "pending" | "shipping" | "delivered" | "cancelled";
  paymentMethod: "cod" | "vnpay" | "momo";
  payType?: "full" | "partial";
  remainingInstallments?: number;
  installmentCount?: number;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null;
  lastPayment: {
    status: "pending" | "success" | "failed";
  } | null;
};

interface OrdersTableProps {
  search?: string;
  status?: Array<"pending" | "shipping" | "delivered" | "cancelled">;
  paymentMethod?: "cod" | "vnpay" | "momo";
  paymentStatus?: "pending" | "success" | "failed";
  dateRange?: {
    from?: Date;
    to?: Date;
  } | null;
}

const statusConfig = {
  pending: { 
    label: "Chờ xác nhận", 
    variant: "outline" as const,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  },
  shipping: { 
    label: "Đang giao", 
    variant: "default" as const,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
  },
  delivered: { 
    label: "Hoàn thành", 
    variant: "default" as const,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  },
  cancelled: { 
    label: "Đã hủy", 
    variant: "destructive" as const,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  },
  confirmed: { 
    label: "Đã xác nhận", 
    variant: "default" as const,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  },
};

const paymentStatusConfig = {
  pending: { 
    label: "Chờ thanh toán", 
    variant: "outline" as const,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  },
  success: { 
    label: "Đã thanh toán", 
    variant: "default" as const,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  },
  failed: { 
    label: "Thất bại", 
    variant: "destructive" as const,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  },
};

const paymentMethodConfig = {
  cod: { label: "COD" },
  vnpay: { label: "VNPay" },
  momo: { label: "MoMo" },
};

export function OrdersTable({
  search,
  status,
  paymentMethod,
  paymentStatus,
  dateRange,
}: OrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentOrderId, setSelectedPaymentOrderId] = useState<number | null>(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState<"pending" | "success" | "failed">("pending");

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, paymentMethod, paymentStatus, dateRange]);

  const handleViewDetail = useCallback((orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  }, []);

  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.orders.searchOrders.queryOptions({
      page,
      limit,
      search,
      status,
      paymentMethod,
      paymentStatus,
      dateRange,
      orderBy: sorting[0]?.id as "createdAt" | "totalAmount" | undefined,
      orderDirection: sorting[0]?.desc ? "desc" : "asc",
    })
  );
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation(
    trpc.orders.updateStatus.mutationOptions({
      onSuccess: () => {
        toast.success("Cập nhật trạng thái đơn hàng thành công");
        queryClient.invalidateQueries(
          trpc.orders.searchOrders.queryOptions({
            page,
            limit,
            search,
            status,
            paymentMethod,
            paymentStatus,
            dateRange,
            orderBy: sorting[0]?.id as "createdAt" | "totalAmount" | undefined,
            orderDirection: sorting[0]?.desc ? "desc" : "asc",
          })
        );
        queryClient.invalidateQueries(
          trpc.orders.getStatusStats.queryOptions()
        );
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi xảy ra khi cập nhật trạng thái");
      },
    })
  );

  const handleUpdateStatus = useCallback(
    (orderId: number, newStatus: Order["status"]) => {
      updateStatusMutation.mutate({
        id: orderId,
        status: newStatus,
      });
    },
    [updateStatusMutation]
  );

  const updatePaymentStatusMutation = useMutation(
    trpc.payment.setOrderPaymentStatus.mutationOptions({
      onSuccess: () => {
        toast.success("Cập nhật trạng thái thanh toán thành công");
        setIsPaymentModalOpen(false);
        queryClient.invalidateQueries(
          trpc.orders.searchOrders.queryOptions({
            page,
            limit,
            search,
            status,
            paymentMethod,
            paymentStatus,
            dateRange,
            orderBy: sorting[0]?.id as "createdAt" | "totalAmount" | undefined,
            orderDirection: sorting[0]?.desc ? "desc" : "asc",
          })
        );
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi xảy ra khi cập nhật trạng thái thanh toán");
      },
    })
  );

  const handleOpenPaymentModal = useCallback((orderId: number, currentStatus: "pending" | "success" | "failed") => {
    setSelectedPaymentOrderId(orderId);
    setNewPaymentStatus(currentStatus);
    setIsPaymentModalOpen(true);
  }, []);

  const handleUpdatePaymentStatus = useCallback(() => {
    if (selectedPaymentOrderId) {
      updatePaymentStatusMutation.mutate({
        orderId: selectedPaymentOrderId,
        status: newPaymentStatus,
      });
    }
  }, [selectedPaymentOrderId, newPaymentStatus, updatePaymentStatusMutation]);

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Mã đơn",
        cell: ({ row }) => (
          <span className="font-mono font-medium text-foreground">
            {row.original.orders.code || `#${row.original.orders.id}`}
          </span>
        ),
      },
      {
        accessorKey: "user",
        header: "Khách hàng",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-foreground">
              {row.original.u_table?.name || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              {row.original.u_table?.email || "N/A"}
            </p>
            {row.original.u_table?.phone && (
              <p className="text-xs text-muted-foreground">
                {row.original.u_table.phone}
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "totalItems",
        header: "Sản phẩm",
        cell: ({ row }) => (
          <span className="text-sm text-foreground">
            {row.original.orders.totalItems} sản phẩm
          </span>
        ),
      },
      {
        accessorKey: "totalAmount",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-auto p-0 hover:bg-transparent"
            >
              Tổng tiền
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <span className="font-semibold text-foreground">
            {Number(row.original.orders.totalAmount).toLocaleString("vi-VN")}₫
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <Badge
            className={
              statusConfig[
                row.original.orders.status as keyof typeof statusConfig
              ].color
            }
          >
            {
              statusConfig[
                row.original.orders.status as keyof typeof statusConfig
              ].label
            }
          </Badge>
        ),
      },
      {
        accessorKey: "lastPayment.status",
        header: "Thanh toán",
        cell: ({ row }) => {
          const order = row.original.orders;
          const isOverdue = order?.payType === "partial" && 
                           order?.remainingInstallments > 0 && 
                           order?.nextPayDay && 
                           new Date(order.nextPayDay) < new Date();
          
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={
                    row.original.payments?.status
                      ? paymentStatusConfig[
                          row.original.payments
                            ?.status as keyof typeof paymentStatusConfig
                        ].color
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }
                >
                  {row.original.payments?.status
                    ? paymentStatusConfig[
                        row.original.payments
                          ?.status as keyof typeof paymentStatusConfig
                      ].label
                    : "Chưa thanh toán"}
                </Badge>
                {order?.payType === "partial" && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                    Trả góp
                  </Badge>
                )}
                {isOverdue && (
                  <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300 text-xs animate-pulse">
                    Trễ hạn
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {paymentMethodConfig[
                  row.original.payments
                    ?.method as keyof typeof paymentMethodConfig
                ]?.label || "Chưa thanh toán"}
              </p>
              {order?.payType === "partial" && order?.remainingInstallments > 0 && (
                <p className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-blue-600'}`}>
                  Còn {order.remainingInstallments} kỳ
                  {isOverdue && order.nextPayDay && (
                    <span className="block text-red-500">
                      Quá hạn: {new Date(order.nextPayDay).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </p>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-auto p-0 hover:bg-transparent"
            >
              Ngày đặt
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {new Date(row.original.orders.createdAt).toLocaleDateString(
              "vi-VN"
            )}
          </span>
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
                onClick={() => handleViewDetail(row.original.orders.id)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem chi tiết
              </DropdownMenuItem>
              {row.original.payments?.status !== "success" && <DropdownMenuItem
                className="text-foreground hover:bg-secondary"
                onClick={() => handleOpenPaymentModal(
                  row.original.orders.id,
                    row.original.payments?.status || "pending"
                  )}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Thanh toán
                </DropdownMenuItem>
              }
              {row.original.orders.status === "pending" && (
                <DropdownMenuItem
                  className="text-foreground hover:bg-secondary"
                  onClick={() =>
                    handleUpdateStatus(row.original.orders.id, "shipping")
                  }
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Xác nhận & giao hàng
                </DropdownMenuItem>
              )}
              {row.original.orders.status === "shipping" && (
                <DropdownMenuItem
                  className="text-foreground hover:bg-secondary"
                  onClick={() =>
                    handleUpdateStatus(row.original.orders.id, "delivered")
                  }
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Đánh dấu hoàn thành
                </DropdownMenuItem>
              )}
              {(row.original.orders.status === "pending" ||
                row.original.orders.status === "shipping") && (
                <DropdownMenuItem
                  className="text-red-500 hover:bg-secondary"
                  onClick={() =>
                    handleUpdateStatus(row.original.orders.id, "cancelled")
                  }
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy đơn hàng
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleUpdateStatus, handleViewDetail, handleOpenPaymentModal]
  );

  const table = useReactTable({
    data: data?.orders ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    manualPagination: true,
    pageCount: data?.totalPages ?? 0,
  });

  if (isLoading) {
    return (
      <>
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

        <OrderDetailModal
          orderId={selectedOrderId}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        />
      </>
    );
  }

  return (
    <>
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
                      Không tìm thấy đơn hàng nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Hiển thị {data?.orders.length ?? 0} trong tổng số{" "}
              {data?.total ?? 0} đơn hàng
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
                Trang {page} / {data?.totalPages ?? 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= (data?.totalPages ?? 1)}
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <OrderDetailModal
        orderId={selectedOrderId}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />

      {/* Payment Status Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái thanh toán</DialogTitle>
            <DialogDescription>
              Thay đổi trạng thái thanh toán cho đơn hàng #{selectedPaymentOrderId}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-status">Trạng thái thanh toán</Label>
              <Select
                value={newPaymentStatus}
                onValueChange={(value: "pending" | "success" | "failed") =>
                  setNewPaymentStatus(value)
                }
              >
                <SelectTrigger id="payment-status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ thanh toán</SelectItem>
                  <SelectItem value="success">Đã thanh toán</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentModalOpen(false)}
              disabled={updatePaymentStatusMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdatePaymentStatus}
              disabled={updatePaymentStatusMutation.isPending}
            >
              {updatePaymentStatusMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
