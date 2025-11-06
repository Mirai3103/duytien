import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  User,
  CreditCard,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Tag,
} from "lucide-react";

interface OrderDetailModalProps {
  orderId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig = {
  pending: { label: "Chờ xác nhận", variant: "outline" as const },
  shipping: { label: "Đang giao", variant: "default" as const },
  delivered: { label: "Hoàn thành", variant: "default" as const },
  cancelled: { label: "Đã hủy", variant: "destructive" as const },
};

const paymentStatusConfig = {
  pending: { label: "Chờ thanh toán", variant: "outline" as const },
  success: { label: "Đã thanh toán", variant: "default" as const },
  failed: { label: "Thất bại", variant: "destructive" as const },
};

const paymentMethodConfig = {
  cod: { label: "COD (Thanh toán khi nhận hàng)" },
  vnpay: { label: "VNPay" },
  momo: { label: "MoMo" },
};

export default function OrderDetailModal({
  orderId,
  open,
  onOpenChange,
}: OrderDetailModalProps) {
  const trpc = useTRPC();
  const { data: order, isLoading } = useQuery({
    ...trpc.orders.getOrder.queryOptions({ id: orderId! }),
    enabled: !!orderId && open,
  });

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Chi tiết đơn hàng</DialogTitle>
              {order && (
                <p className="text-sm text-muted-foreground mt-1">
                  Mã đơn: {order.code || `#${order.id}`}
                </p>
              )}
            </div>
            {order && (
              <Badge
                variant={
                  statusConfig[order.status as keyof typeof statusConfig]
                    .variant
                }
                className="text-sm px-3 py-1"
              >
                {statusConfig[order.status as keyof typeof statusConfig].label}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="px-6 py-4 space-y-6">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))}
              </div>
            ) : order ? (
              <>
                {/* Thông tin khách hàng */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">
                      Thông tin khách hàng
                    </h3>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {order.user?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {order.user?.email || "N/A"}
                      </span>
                    </div>
                    {order.user?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {order.user.phone}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Đặt hàng lúc:{" "}
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">
                      Sản phẩm ({order.items?.length || 0})
                    </h3>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium">
                              Sản phẩm
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-medium">
                              Phân loại
                            </th>
                            <th className="text-center px-4 py-3 text-sm font-medium">
                              Số lượng
                            </th>
                            <th className="text-right px-4 py-3 text-sm font-medium">
                              Đơn giá
                            </th>
                            <th className="text-right px-4 py-3 text-sm font-medium">
                              Thành tiền
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items?.map((item, index) => {
                            const unitPrice =
                              Number(item.price) / Number(item.quantity);
                            return (
                              <tr
                                key={index}
                                className="border-t hover:bg-muted/30"
                              >
                                <td className="px-4 py-3">
                                  <div className="font-medium">
                                    {item.variant?.product?.name || "N/A"}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-sm text-muted-foreground">
                                    {item.variant?.variantValues
                                      ?.map((vv) => vv.value?.value)
                                      .join(", ") || "Mặc định"}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="font-medium">
                                    {item.quantity}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {unitPrice.toLocaleString("vi-VN")}₫
                                </td>
                                <td className="px-4 py-3 text-right font-semibold">
                                  {Number(item.price).toLocaleString("vi-VN")}₫
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Thông tin thanh toán */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">
                      Thông tin thanh toán
                    </h3>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Phương thức
                      </span>
                      <span className="font-medium">
                        {
                          paymentMethodConfig[
                            order.paymentMethod as keyof typeof paymentMethodConfig
                          ].label
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Trạng thái thanh toán
                      </span>
                      <Badge
                        variant={
                          order.lastPayment
                            ? paymentStatusConfig[
                                order.lastPayment
                                  .status as keyof typeof paymentStatusConfig
                              ].variant
                            : "outline"
                        }
                      >
                        {order.lastPayment
                          ? paymentStatusConfig[
                              order.lastPayment
                                .status as keyof typeof paymentStatusConfig
                            ].label
                          : "Chưa thanh toán"}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Tạm tính
                        </span>
                        <span>
                          {Number(order.totalAmount).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      {order.voucher && (
                        <div className="flex justify-between items-center text-green-600">
                          <span className="text-sm flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            Voucher: {order.voucher.code}
                          </span>
                          <span>
                            -
                            {order.voucher.type === "percentage"
                              ? `${order.voucher.discount}%`
                              : `${Number(order.voucher.discount).toLocaleString("vi-VN")}₫`}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Tổng cộng</span>
                        <span className="text-primary">
                          {Number(order.totalAmount).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ghi chú */}
                {order.note && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">Ghi chú</h3>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        {order.note}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Không tìm thấy thông tin đơn hàng
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
