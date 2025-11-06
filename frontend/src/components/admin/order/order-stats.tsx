import { CheckCircle, Clock, ShoppingCart, XCircle, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export function OrderStats() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.orders.getStatusStats.queryOptions()
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statusMap = {
    pending: { title: "Chờ xác nhận", icon: Clock, color: "text-yellow-500" },
    shipping: { title: "Đang giao", icon: Truck, color: "text-blue-500" },
    delivered: {
      title: "Hoàn thành",
      icon: CheckCircle,
      color: "text-green-500",
    },
    cancelled: { title: "Đã hủy", icon: XCircle, color: "text-red-500" },
  };

  const stats = [
    {
      title: "Tổng đơn hàng",
      value: data?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: "text-indigo-500",
    },
    ...(data?.statusStats.map((stat) => ({
      title:
        statusMap[stat.status as keyof typeof statusMap]?.title ?? stat.status,
      value: stat.count,
      icon:
        statusMap[stat.status as keyof typeof statusMap]?.icon ?? ShoppingCart,
      color:
        statusMap[stat.status as keyof typeof statusMap]?.color ??
        "text-gray-500",
    })) ?? []),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stat.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
