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
  Star,
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewModal } from "@/components/review/ReviewModal";
import { toast } from "sonner";

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
const paymentStatusConfig: Record<
  "pending" | "success" | "failed",
  { label: string; color: string; icon: any; variant: any }
> = {
  pending: {
    label: "Chờ thanh toán",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: Clock,
    variant: "secondary",
  },
  success: {
    label: "Đã thanh toán",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: CheckCircle2,
    variant: "default",
  },
  failed: {
    label:  "Chưa thanh toán",
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
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const limit = 10;

  // Fetch orders from tRPC
  const { data, isLoading, isError } = useQuery(
    trpc.orders.getOrders.queryOptions({ page, limit })
  );

  const orders = data?.orders || [];
  const totalPages = (data as any)?.totalPages || 1;
  const total = data?.total || 0;

  // Payment mutation
  const paymentMutation = useMutation(trpc.payment.createPayment.mutationOptions({
    onSuccess: (data) => {
      if ((data as any).success && (data as any).redirectUrl) {
        window.location.href = (data as any).redirectUrl;
      } else {
        toast.error(data.message || "Không thể tạo thanh toán");
      }
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi tạo thanh toán");
      console.error(error);
    },
  }));
  const queryClient = useQueryClient();
  const cancelOrderMutation = useMutation(trpc.orders.cancelOrder.mutationOptions({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Đơn hàng đã được hủy");
        queryClient.invalidateQueries(trpc.orders.getOrders.queryOptions({ page, limit }));
      } else {
        toast.error(data.message || "Không thể hủy đơn hàng");
      }
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
      console.error(error);
    },
  }));

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

  const handleOpenReviewDialog = (item: any) => {
    setSelectedReviewItem(item);
    setReviewDialogOpen(true);
  };

  const handlePayment = (orderId: number) => {
    paymentMutation.mutate({ orderId: orderId.toString() });
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
              console.log(order.lastPayment?.status != "success" && 
                order.lastPayment?.method != "cod");
              const config =
                statusConfig[order.status as OrderStatus] ||
                statusConfig.pending;
              const StatusIcon = config.icon;
              const orderNumber = order.code
              const paymentConfig =
                paymentStatusConfig[order.lastPayment?.status as "pending" | "success" | "failed"] ||
                paymentStatusConfig.pending;
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
                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={config.color}>{config.label}</Badge>
                        <Badge className={paymentConfig.color} variant={paymentConfig.variant as any}>
                          {paymentConfig.label}
                        </Badge>
                      </div>
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
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Tổng tiền
                        </p>
                        <p className="text-xl font-bold text-primary">
                          {Number(order.totalAmount).toLocaleString("vi-VN")}đ
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground uppercase">
                            {order.paymentMethod}
                          </p>
                          {order.voucher && (
                            <Badge variant="secondary" className="text-xs">
                              🎫 {order.voucher.code}
                            </Badge>
                          )}
                        </div>
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
                        {order.lastPayment?.status != "success" && 
                         order.lastPayment?.method != "cod" && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handlePayment(order.id)}
                            disabled={paymentMutation.isPending}
                          >
                            {paymentMutation.isPending ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                            )}
                            Thanh toán
                          </Button>
                        )}
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Mua lại
                          </Button>
                        )}
                        {order.status === "pending" && (order.lastPayment?.status != "success" && order.lastPayment?.method != "cod") && (
                          <Button variant="destructive" size="sm" onClick={() => cancelOrderMutation.mutate({ id: order.id })} disabled={cancelOrderMutation.isPending}>
                            {cancelOrderMutation.isPending ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Trạng thái đơn hàng</p>
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
                <div>
                  <p className="text-sm font-medium mb-2">Trạng thái thanh toán</p>
                  <Badge
                    className={
                      (
                        paymentStatusConfig[selectedOrder.lastPayment?.status as "pending" | "success" | "failed"] ||
                        paymentStatusConfig.pending
                      ).color
                    }
                  >
                    {
                      (
                        paymentStatusConfig[selectedOrder.lastPayment?.status as "pending" | "success" | "failed"] ||
                        paymentStatusConfig.pending
                      ).label
                    }
                  </Badge>
                </div>
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
                        className="flex gap-4 items-start"
                      >
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
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
                          {selectedOrder.status === "delivered" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => handleOpenReviewDialog(item)}
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Đánh giá
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Payment & Voucher */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">
                    Phương thức thanh toán
                  </p>
                  <p className="text-sm uppercase">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
                {selectedOrder.voucher && (
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Mã giảm giá
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {selectedOrder.voucher.code}
                    </Badge>
                  </div>
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

      {/* Review Dialog */}
      <ReviewModal
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        variantId={selectedReviewItem?.variantId || null}
        productName={
          selectedReviewItem?.variant?.product?.name ||
          selectedReviewItem?.variant?.name ||
          "Sản phẩm"
        }
        productId={selectedReviewItem?.variant?.product?.id}
      />
    </div>
  );
}
