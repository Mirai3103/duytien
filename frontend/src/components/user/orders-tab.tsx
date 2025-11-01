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
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipping"
  | "delivered"
  | "cancelled";

interface OrderItem {
  id: number;
  productName: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: "DH20241101001",
    date: "2024-11-01",
    status: "delivered",
    total: 25990000,
    items: [
      {
        id: 1,
        productName: "iPhone 15 Pro Max",
        variant: "256GB - Titan Tự Nhiên",
        quantity: 1,
        price: 25990000,
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
      },
    ],
    shippingAddress: "123 Đường ABC, Phường 1, Quận 1, TP. HCM",
    paymentMethod: "COD",
  },
  {
    id: 2,
    orderNumber: "DH20241030002",
    date: "2024-10-30",
    status: "shipping",
    total: 8990000,
    items: [
      {
        id: 2,
        productName: "Samsung Galaxy S24",
        variant: "128GB - Đen",
        quantity: 1,
        price: 8990000,
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s24-plus.png",
      },
    ],
    shippingAddress: "456 Đường XYZ, Phường 2, Quận 3, TP. HCM",
    paymentMethod: "VNPay",
  },
  {
    id: 3,
    orderNumber: "DH20241025003",
    date: "2024-10-25",
    status: "processing",
    total: 15490000,
    items: [
      {
        id: 3,
        productName: "Xiaomi 14 Ultra",
        variant: "512GB - Đen",
        quantity: 1,
        price: 15490000,
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra.png",
      },
    ],
    shippingAddress: "123 Đường ABC, Phường 1, Quận 1, TP. HCM",
    paymentMethod: "MoMo",
  },
];

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
  processing: {
    label: "Đang xử lý",
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
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
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
          onClick={() => setFilterStatus("all")}
          size="sm"
        >
          Tất cả ({orders.length})
        </Button>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status as OrderStatus)}
              size="sm"
            >
              {config.label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Orders List */}
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
          filteredOrders.map((order) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;

            return (
              <Card key={order.id}>
                <CardContent className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-5 w-5" />
                        <div>
                          <p className="font-semibold">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString("vi-VN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Badge className={config.color}>{config.label}</Badge>
                  </div>

                  <Separator className="mb-4" />

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-1">
                            {item.productName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.variant}
                          </p>
                          <p className="text-sm">x{item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {item.price.toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="mb-4" />

                  {/* Order Footer */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng tiền</p>
                      <p className="text-xl font-bold text-primary">
                        {order.total.toLocaleString("vi-VN")}đ
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
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
            <DialogDescription>
              Mã đơn hàng: {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Status */}
              <div>
                <p className="text-sm font-medium mb-2">Trạng thái</p>
                <Badge className={statusConfig[selectedOrder.status].color}>
                  {statusConfig[selectedOrder.status].label}
                </Badge>
              </div>

              <Separator />

              {/* Items */}
              <div>
                <p className="text-sm font-medium mb-3">Sản phẩm</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.variant}
                        </p>
                        <p className="text-sm">Số lượng: {item.quantity}</p>
                        <p className="font-semibold text-primary">
                          {item.price.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Shipping Address */}
              <div>
                <p className="text-sm font-medium mb-2">Địa chỉ giao hàng</p>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.shippingAddress}
                </p>
              </div>

              <Separator />

              {/* Payment */}
              <div>
                <p className="text-sm font-medium mb-2">
                  Phương thức thanh toán
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.paymentMethod}
                </p>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {selectedOrder.total.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
