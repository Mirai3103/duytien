import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: any; variant: any }
> = {
  pending: {
    label: "Chờ xác nhận",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: Clock,
    variant: "secondary",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: Package,
    variant: "default",
  },
  shipping: {
    label: "Đang giao",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    icon: Truck,
    variant: "default",
  },
  delivered: {
    label: "Đã giao",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: CheckCircle2,
    variant: "default",
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: XCircle,
    variant: "destructive",
  },
};

export function OrdersTab() {
  const trpc = useTRPC();
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const limit = 10;

  // Fetch orders from tRPC
  const { data, isLoading, isError } = useQuery(
    trpc.orders.getOrders.queryOptions({ page, limit })
  );

  const orders = data?.orders || [];
  const totalPages = (data as any)?.totalPages || 1;
  const total = data?.total || 0;

  // Filter orders by status (client-side for now)
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const handleViewDetail = (order: any) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Lịch sử đơn hàng</h2>
        <p className="text-muted-foreground">
          Xem và quản lý các đơn hàng của bạn
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => {
            setFilterStatus("all");
            setPage(1);
          }}
          size="sm"
          disabled={isLoading}
        >
          Tất cả ({total})
        </Button>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => {
                setFilterStatus(status as OrderStatus);
                setPage(1);
              }}
              size="sm"
              disabled={isLoading}
            >
              {config.label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Đang tải đơn hàng...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Card className="text-center py-12">
          <CardContent>
            <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h3>
            <p className="text-muted-foreground mb-4">
              Không thể tải danh sách đơn hàng
            </p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      {!isLoading && !isError && (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Không có đơn hàng nào
                </h3>
                <p className="text-muted-foreground mb-4">
                  {filterStatus === "all"
                    ? "Bạn chưa có đơn hàng nào"
                    : `Không có đơn hàng ${statusConfig[filterStatus as OrderStatus]?.label.toLowerCase()}`}
                </p>
                <Link to="/">
                  <Button>Mua sắm ngay</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order: any) => {
              const config =
                statusConfig[order.status as OrderStatus] ||
                statusConfig.pending;
              const StatusIcon = config.icon;
              const orderNumber = `DH${order.id.toString().padStart(8, "0")}`;

              return (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-5 w-5" />
                          <div>
                            <p className="font-semibold">{orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Badge className={config.color}>{config.label}</Badge>
                    </div>

                    <Separator className="mb-4" />

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items?.map((item: any) => {
                        const variantValues = item.variant?.variantValues || [];
                        const variantName =
                          variantValues
                            .map((vv: any) => vv.value?.value || "")
                            .filter(Boolean)
                            .join(" - ") ||
                          item.variant?.name ||
                          "N/A";

                        return (
                          <div
                            key={item.variantId || Math.random()}
                            className="flex gap-4"
                          >
                            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  item.variant?.image ||
                                  item.variant?.product?.image ||
                                  "/placeholder.png"
                                }
                                alt={
                                  item.variant?.product?.name ||
                                  item.variant?.name ||
                                  "Product"
                                }
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium line-clamp-1">
                                {item.variant?.product?.name ||
                                  item.variant?.name ||
                                  "Sản phẩm"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {variantName}
                              </p>
                              <p className="text-sm">x{item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {Number(item.price).toLocaleString("vi-VN")}đ
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator className="mb-4" />

                    {/* Order Footer */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Tổng tiền
                        </p>
                        <p className="text-xl font-bold text-primary">
                          {Number(order.totalAmount).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Mua lại
                          </Button>
                        )}
                        {order.status === "pending" && (
                          <Button variant="destructive" size="sm">
                            Hủy đơn
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}

          {/* Pagination */}
          {!isLoading &&
            !isError &&
            filteredOrders.length > 0 &&
            totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => {
                      // Show first page, last page, current page and pages around current
                      if (
                        p === 1 ||
                        p === totalPages ||
                        (p >= page - 1 && p <= page + 1)
                      ) {
                        return (
                          <Button
                            key={p}
                            variant={p === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(p)}
                            className="min-w-[40px]"
                          >
                            {p}
                          </Button>
                        );
                      } else if (p === page - 2 || p === page + 2) {
                        return (
                          <span key={p} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
            <DialogDescription>
              Mã đơn hàng: DH{selectedOrder?.id.toString().padStart(8, "0")}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Status */}
              <div>
                <p className="text-sm font-medium mb-2">Trạng thái</p>
                <Badge
                  className={
                    (
                      statusConfig[selectedOrder.status as OrderStatus] ||
                      statusConfig.pending
                    ).color
                  }
                >
                  {
                    (
                      statusConfig[selectedOrder.status as OrderStatus] ||
                      statusConfig.pending
                    ).label
                  }
                </Badge>
              </div>

              <Separator />

              {/* Items */}
              <div>
                <p className="text-sm font-medium mb-3">Sản phẩm</p>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any) => {
                    const variantValues = item.variant?.variantValues || [];
                    const variantName =
                      variantValues
                        .map((vv: any) => vv.value?.value || "")
                        .filter(Boolean)
                        .join(" - ") ||
                      item.variant?.name ||
                      "N/A";

                    return (
                      <div
                        key={item.variantId || Math.random()}
                        className="flex gap-4"
                      >
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                          <img
                            src={
                              item.variant?.image ||
                              item.variant?.product?.image ||
                              "/placeholder.png"
                            }
                            alt={
                              item.variant?.product?.name ||
                              item.variant?.name ||
                              "Product"
                            }
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {item.variant?.product?.name ||
                              item.variant?.name ||
                              "Sản phẩm"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {variantName}
                          </p>
                          <p className="text-sm">Số lượng: {item.quantity}</p>
                          <p className="font-semibold text-primary">
                            {Number(item.price).toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Payment */}
              <div>
                <p className="text-sm font-medium mb-2">
                  Phương thức thanh toán
                </p>
                <p className="text-sm text-muted-foreground uppercase">
                  {selectedOrder.paymentMethod}
                </p>
                {selectedOrder.payments &&
                  selectedOrder.payments.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Trạng thái:{" "}
                      <span
                        className={
                          selectedOrder.payments[0].status === "completed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {selectedOrder.payments[0].status === "completed"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </span>
                    </p>
                  )}
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {Number(selectedOrder.totalAmount).toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
