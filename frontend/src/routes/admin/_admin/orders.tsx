import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/orders")({
	component: RouteComponent,
});

import { Download, Search } from "lucide-react";
import { OrderStats } from "@/components/admin/order/order-stats";
import { OrdersTable } from "@/components/admin/order/orders-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrdersPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Quản lý đơn hàng
					</h1>
					<p className="text-muted-foreground mt-1">
						Theo dõi và xử lý đơn hàng của khách hàng
					</p>
				</div>
				<Button variant="outline" className="border-border bg-transparent">
					<Download className="w-4 h-4 mr-2" />
					Xuất báo cáo
				</Button>
			</div>

			{/* Stats */}
			<OrderStats />

			{/* Search and Filters */}
			<div className="flex items-center gap-4">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm đơn hàng..."
						className="pl-10 bg-card border-border text-foreground"
					/>
				</div>
				<Button variant="outline" className="border-border bg-transparent">
					Trạng thái
				</Button>
				<Button variant="outline" className="border-border bg-transparent">
					Ngày đặt
				</Button>
				<Button variant="outline" className="border-border bg-transparent">
					Thanh toán
				</Button>
			</div>

			{/* Orders Table */}
			<OrdersTable />
		</div>
	);
}

function RouteComponent() {
	return <OrdersPage />;
}
