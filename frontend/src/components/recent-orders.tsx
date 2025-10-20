import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const orders = [
	{
		id: "#ORD-001",
		customer: "Nguyễn Văn A",
		product: "iPhone 15 Pro Max",
		amount: "₫32,990,000",
		status: "completed",
	},
	{
		id: "#ORD-002",
		customer: "Trần Thị B",
		product: "Samsung Galaxy S24",
		amount: "₫24,990,000",
		status: "processing",
	},
	{
		id: "#ORD-003",
		customer: "Lê Văn C",
		product: "AirPods Pro 2",
		amount: "₫6,490,000",
		status: "pending",
	},
	{
		id: "#ORD-004",
		customer: "Phạm Thị D",
		product: "iPad Air M2",
		amount: "₫16,990,000",
		status: "completed",
	},
	{
		id: "#ORD-005",
		customer: "Hoàng Văn E",
		product: "MacBook Air M3",
		amount: "₫28,990,000",
		status: "processing",
	},
];

const statusConfig = {
	completed: { label: "Hoàn thành", variant: "default" as const },
	processing: { label: "Đang xử lý", variant: "secondary" as const },
	pending: { label: "Chờ xử lý", variant: "outline" as const },
};

export function RecentOrders() {
	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<CardTitle className="text-foreground">Đơn hàng gần đây</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{orders.map((order) => (
						<div
							key={order.id}
							className="flex items-center justify-between py-3 border-b border-border last:border-0"
						>
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<p className="font-medium text-foreground">{order.id}</p>
									<Badge
										variant={
											statusConfig[order.status as keyof typeof statusConfig]
												.variant
										}
									>
										{
											statusConfig[order.status as keyof typeof statusConfig]
												.label
										}
									</Badge>
								</div>
								<p className="text-sm text-muted-foreground mt-1">
									{order.customer}
								</p>
								<p className="text-sm text-muted-foreground">{order.product}</p>
							</div>
							<div className="text-right">
								<p className="font-semibold text-foreground">{order.amount}</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
