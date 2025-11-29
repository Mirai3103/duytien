import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/dashboard")({
	component: RouteComponent,
});

import {
	ArrowDownRight,
	ArrowUpRight,
	DollarSign,
	Package,
	ShoppingCart,
	Users,
} from "lucide-react";
import { RecentOrders } from "@/components/recent-orders";
import { RevenueChart } from "@/components/revenue-chart";
import { TopProducts } from "@/components/top-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";

export default function AdminDashboard() {
	const trpc = useTRPC();
	const { data: stats, isLoading: statsLoading } =
		useQuery(trpc.dashboard.getStats.queryOptions());

	const statsConfig = [
		{
			title: "Tổng doanh thu",
			value: stats?.totalRevenue
				? `₫${stats.totalRevenue.toLocaleString()}`
				: "₫0",
			change: stats?.revenueChange
				? `${stats.revenueChange > 0 ? "+" : ""}${stats.revenueChange}%`
				: "0%",
			trend: (stats?.revenueChange ?? 0) >= 0 ? "up" : "down",
			icon: DollarSign,
		},
		{
			title: "Đơn hàng",
			value: stats?.totalOrders?.toLocaleString() ?? "0",
			change: stats?.ordersChange
				? `${stats.ordersChange > 0 ? "+" : ""}${stats.ordersChange}%`
				: "0%",
			trend: (stats?.ordersChange ?? 0) >= 0 ? "up" : "down",
			icon: ShoppingCart,
		},
		{
			title: "Sản phẩm",
			value: stats?.totalProducts?.toLocaleString() ?? "0",
			change: stats?.productsChange
				? `${stats.productsChange > 0 ? "+" : ""}${stats.productsChange}%`
				: "0%",
			trend: (stats?.productsChange ?? 0) >= 0 ? "up" : "down",
			icon: Package,
		},
		{
			title: "Khách hàng",
			value: stats?.totalCustomers?.toLocaleString() ?? "0",
			change: stats?.customersChange
				? `${stats.customersChange > 0 ? "+" : ""}${stats.customersChange}%`
				: "0%",
			trend: (stats?.customersChange ?? 0) >= 0 ? "up" : "down",
			icon: Users,
		},
	];

	if (statsLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-muted-foreground">Đang tải...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{statsConfig.map((stat) => (
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
									className={`text-xs font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
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
		<div className="grid grid-cols-1 gap-6">
			<RevenueChart />
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
