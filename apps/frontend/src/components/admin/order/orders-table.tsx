import { Eye, MoreHorizontal, Truck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const orders = [
	{
		id: "#ORD-001",
		customer: "Nguyễn Văn A",
		email: "nguyenvana@email.com",
		products: 3,
		total: "₫45,470,000",
		status: "completed",
		payment: "paid",
		date: "15/01/2025",
	},
	{
		id: "#ORD-002",
		customer: "Trần Thị B",
		email: "tranthib@email.com",
		products: 1,
		total: "₫24,990,000",
		status: "processing",
		payment: "paid",
		date: "15/01/2025",
	},
	{
		id: "#ORD-003",
		customer: "Lê Văn C",
		email: "levanc@email.com",
		products: 2,
		total: "₫13,480,000",
		status: "pending",
		payment: "pending",
		date: "14/01/2025",
	},
	{
		id: "#ORD-004",
		customer: "Phạm Thị D",
		email: "phamthid@email.com",
		products: 1,
		total: "₫16,990,000",
		status: "completed",
		payment: "paid",
		date: "14/01/2025",
	},
	{
		id: "#ORD-005",
		customer: "Hoàng Văn E",
		email: "hoangvane@email.com",
		products: 1,
		total: "₫28,990,000",
		status: "processing",
		payment: "paid",
		date: "13/01/2025",
	},
	{
		id: "#ORD-006",
		customer: "Đặng Thị F",
		email: "dangthif@email.com",
		products: 4,
		total: "₫52,960,000",
		status: "shipping",
		payment: "paid",
		date: "13/01/2025",
	},
	{
		id: "#ORD-007",
		customer: "Vũ Văn G",
		email: "vuvang@email.com",
		products: 2,
		total: "₫17,480,000",
		status: "cancelled",
		payment: "refunded",
		date: "12/01/2025",
	},
	{
		id: "#ORD-008",
		customer: "Bùi Thị H",
		email: "buithih@email.com",
		products: 1,
		total: "₫10,990,000",
		status: "completed",
		payment: "paid",
		date: "12/01/2025",
	},
];

const statusConfig = {
	pending: { label: "Chờ xử lý", variant: "outline" as const },
	processing: { label: "Đang xử lý", variant: "secondary" as const },
	shipping: { label: "Đang giao", variant: "default" as const },
	completed: { label: "Hoàn thành", variant: "default" as const },
	cancelled: { label: "Đã hủy", variant: "destructive" as const },
};

const paymentConfig = {
	pending: { label: "Chờ thanh toán", variant: "outline" as const },
	paid: { label: "Đã thanh toán", variant: "default" as const },
	refunded: { label: "Đã hoàn tiền", variant: "secondary" as const },
};

export function OrdersTable() {
	return (
		<Card className="bg-card border-border">
			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-border">
							<tr className="text-left">
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Mã đơn
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Khách hàng
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Sản phẩm
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Tổng tiền
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Trạng thái
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Thanh toán
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Ngày đặt
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground"></th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr
									key={order.id}
									className="border-b border-border hover:bg-secondary/50 transition-colors"
								>
									<td className="px-6 py-4">
										<span className="font-mono font-medium text-foreground">
											{order.id}
										</span>
									</td>
									<td className="px-6 py-4">
										<div>
											<p className="font-medium text-foreground">
												{order.customer}
											</p>
											<p className="text-sm text-muted-foreground">
												{order.email}
											</p>
										</div>
									</td>
									<td className="px-6 py-4">
										<span className="text-sm text-foreground">
											{order.products} sản phẩm
										</span>
									</td>
									<td className="px-6 py-4">
										<span className="font-semibold text-foreground">
											{order.total}
										</span>
									</td>
									<td className="px-6 py-4">
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
									</td>
									<td className="px-6 py-4">
										<Badge
											variant={
												paymentConfig[
													order.payment as keyof typeof paymentConfig
												].variant
											}
										>
											{
												paymentConfig[
													order.payment as keyof typeof paymentConfig
												].label
											}
										</Badge>
									</td>
									<td className="px-6 py-4">
										<span className="text-sm text-muted-foreground">
											{order.date}
										</span>
									</td>
									<td className="px-6 py-4">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="w-4 h-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="bg-card border-border"
											>
												<DropdownMenuItem className="text-foreground hover:bg-secondary">
													<Eye className="w-4 h-4 mr-2" />
													Xem chi tiết
												</DropdownMenuItem>
												<DropdownMenuItem className="text-foreground hover:bg-secondary">
													<Truck className="w-4 h-4 mr-2" />
													Cập nhật vận chuyển
												</DropdownMenuItem>
												<DropdownMenuItem className="text-red-500 hover:bg-secondary">
													<X className="w-4 h-4 mr-2" />
													Hủy đơn hàng
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}
