import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/dashboard")({
  component: RouteComponent,
});

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";
import { RevenueChart } from "@/components/revenue-chart";
import { OrdersChart } from "@/components/orders-chart";
import { RecentOrders } from "@/components/recent-orders";
import { TopProducts } from "@/components/top-products";

const stats = [
  {
    title: "Tổng doanh thu",
    value: "₫245,890,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Đơn hàng",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Sản phẩm",
    value: "456",
    change: "+3.1%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Khách hàng",
    value: "8,945",
    change: "-2.4%",
    trend: "down",
    icon: Users,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-xs font-medium ${stat.trend === `up` ? `text-green-500` : `text-red-500`}`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  so với tháng trước
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OrdersChart />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
}

function RouteComponent() {
  return <AdminDashboard />;
}
