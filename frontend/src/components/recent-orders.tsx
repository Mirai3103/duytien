import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { Link } from "@tanstack/react-router";

const statusConfig = {
	pending: { label: "Chờ xử lý", variant: "outline" as const },
	confirmed: { label: "Đã xác nhận", variant: "secondary" as const },
	shipping: { label: "Đang giao", variant: "secondary" as const },
	delivered: { label: "Hoàn thành", variant: "default" as const },
	cancelled: { label: "Đã hủy", variant: "destructive" as const },
};

export function RecentOrders() {
	const trpc = useTRPC();
	const { data: orders, isLoading } = useQuery(
		trpc.dashboard.getRecentOrders.queryOptions()
	);

	if (isLoading) {
		return (
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Đơn hàng chờ xác nhận</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<div className="text-muted-foreground">Đang tải...</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<CardTitle className="text-foreground">Đơn hàng chờ xác nhận</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{orders?.map((order) => (
						<Link
							key={order.id}
							to="/admin/orders"
							search={{ search: order.id }}
							className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-accent/5 transition-colors rounded-md px-2 -mx-2"
						>
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<p className="font-medium text-foreground">{order.id}</p>
									<Badge
										variant={
											statusConfig[order.status as keyof typeof statusConfig]
												?.variant || "outline"
										}
									>
										{statusConfig[order.status as keyof typeof statusConfig]
											?.label || order.status}
									</Badge>
								</div>
								<p className="text-sm text-muted-foreground mt-1">
									{order.customer}
								</p>
								<p className="text-sm text-muted-foreground">{order.product}</p>
							</div>
							<div className="text-right">
								<p className="font-semibold text-foreground">
									₫{order.amount.toLocaleString()}
								</p>
							</div>
						</Link>
					))}
					{(!orders || orders.length === 0) && (
						<div className="text-center py-8 text-muted-foreground">
							Không có đơn hàng chờ xác nhận
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
