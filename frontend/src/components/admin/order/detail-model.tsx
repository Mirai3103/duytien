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
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {
                            paymentMethodConfig[
                              order.paymentMethod as keyof typeof paymentMethodConfig
                            ].label
                          }
                        </span>
                        {order.payType === "partial" && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                            Trả góp
                          </Badge>
                        )}
                      </div>
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

                {/* Thông tin trả góp */}
                {order.payType === "partial" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">Thông tin trả góp</h3>
                      </div>
                      {(order.remainingInstallments || 0) > 0 && order.nextPayDay && new Date(order.nextPayDay) < new Date() && (
                        <Badge variant="destructive" className="animate-pulse">
                          ⚠️ Trễ hạn
                        </Badge>
                      )}
                    </div>
                    <div className={`rounded-lg p-4 space-y-3 ${
                      (order.remainingInstallments || 0) > 0 && order.nextPayDay && new Date(order.nextPayDay) < new Date()
                        ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
                        : 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'
                    }`}>
                      {/* CCCD & Full Name */}
                      {order.identityId && (
                        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-blue-200 dark:border-blue-800">
                          <div>
                            <span className="text-sm text-blue-700 dark:text-blue-300">Số CCCD/CMND:</span>
                            <p className="font-semibold text-blue-900 dark:text-blue-100">
                              {order.identityId}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-blue-700 dark:text-blue-300">Họ và tên:</span>
                            <p className="font-semibold text-blue-900 dark:text-blue-100">
                              {order.full_name || 'N/A'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Payment Info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-sm text-blue-700 dark:text-blue-300">Tổng số kỳ:</span>
                          <p className="font-semibold text-blue-900 dark:text-blue-100">
                            {order.installmentCount} tháng
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-blue-700 dark:text-blue-300">Số tiền mỗi kỳ:</span>
                          <p className="font-semibold text-blue-900 dark:text-blue-100">
                            {Number(order.nextPayAmount || 0).toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-blue-700 dark:text-blue-300">Đã thanh toán:</span>
                          <p className="font-semibold text-green-600">
                            {Number(order.totalPaidAmount || 0).toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-blue-700 dark:text-blue-300">Còn lại:</span>
                          <p className="font-semibold text-orange-600">
                            {order.remainingInstallments || 0} kỳ
                          </p>
                        </div>
                      </div>

                      {/* Next Payment */}
                      {(order.remainingInstallments || 0) > 0 && (
                        <>
                          <Separator className={
                            order.nextPayDay && new Date(order.nextPayDay) < new Date()
                              ? "bg-red-200 dark:bg-red-800"
                              : "bg-blue-200 dark:bg-blue-800"
                          } />
                          <div className={`p-3 rounded-md ${
                            order.nextPayDay && new Date(order.nextPayDay) < new Date()
                              ? 'bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-700'
                              : 'bg-white dark:bg-gray-950'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`text-sm ${
                                  order.nextPayDay && new Date(order.nextPayDay) < new Date()
                                    ? 'text-red-700 dark:text-red-300 font-semibold'
                                    : 'text-blue-700 dark:text-blue-300'
                                }`}>
                                  Kỳ thanh toán tiếp theo:
                                </p>
                                <p className={`font-bold ${
                                  order.nextPayDay && new Date(order.nextPayDay) < new Date()
                                    ? 'text-red-900 dark:text-red-100'
                                    : 'text-blue-900 dark:text-blue-100'
                                }`}>
                                  {order.nextPayDay && new Date(order.nextPayDay).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                                {order.nextPayDay && new Date(order.nextPayDay) < new Date() && (
                                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold">
                                    ⚠️ Quá hạn {Math.floor((new Date().getTime() - new Date(order.nextPayDay).getTime()) / (1000 * 60 * 60 * 24))} ngày
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className={`text-sm ${
                                  order.nextPayDay && new Date(order.nextPayDay) < new Date()
                                    ? 'text-red-700 dark:text-red-300'
                                    : 'text-blue-700 dark:text-blue-300'
                                }`}>
                                  Số tiền:
                                </p>
                                <p className={`font-bold text-lg ${
                                  order.nextPayDay && new Date(order.nextPayDay) < new Date()
                                    ? 'text-red-600'
                                    : 'text-blue-600'
                                }`}>
                                  {Number(order.nextPayAmount || 0).toLocaleString("vi-VN")}₫
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Completed */}
                      {(order.remainingInstallments || 0) === 0 && order.payType === "partial" && (
                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 rounded-md">
                          <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="font-semibold text-green-700 dark:text-green-300">
                              Đã hoàn thành thanh toán trả góp
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
