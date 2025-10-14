import { Ban, Eye, Mail, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const customers = [
	{
		id: 1,
		name: "Nguyễn Văn A",
		email: "nguyenvana@email.com",
		phone: "0901234567",
		orders: 12,
		spent: "₫145,680,000",
		type: "vip",
		status: "active",
		joined: "15/06/2024",
	},
	{
		id: 2,
		name: "Trần Thị B",
		email: "tranthib@email.com",
		phone: "0912345678",
		orders: 8,
		spent: "₫89,450,000",
		type: "regular",
		status: "active",
		joined: "22/07/2024",
	},
	{
		id: 3,
		name: "Lê Văn C",
		email: "levanc@email.com",
		phone: "0923456789",
		orders: 3,
		spent: "₫32,470,000",
		type: "new",
		status: "active",
		joined: "05/01/2025",
	},
	{
		id: 4,
		name: "Phạm Thị D",
		email: "phamthid@email.com",
		phone: "0934567890",
		orders: 15,
		spent: "₫198,920,000",
		type: "vip",
		status: "active",
		joined: "10/03/2024",
	},
	{
		id: 5,
		name: "Hoàng Văn E",
		email: "hoangvane@email.com",
		phone: "0945678901",
		orders: 5,
		spent: "₫56,780,000",
		type: "regular",
		status: "active",
		joined: "18/09/2024",
	},
	{
		id: 6,
		name: "Đặng Thị F",
		email: "dangthif@email.com",
		phone: "0956789012",
		orders: 2,
		spent: "₫18,990,000",
		type: "new",
		status: "inactive",
		joined: "28/12/2024",
	},
	{
		id: 7,
		name: "Vũ Văn G",
		email: "vuvang@email.com",
		phone: "0967890123",
		orders: 9,
		spent: "₫112,340,000",
		type: "regular",
		status: "active",
		joined: "14/05/2024",
	},
	{
		id: 8,
		name: "Bùi Thị H",
		email: "buithih@email.com",
		phone: "0978901234",
		orders: 6,
		spent: "₫67,890,000",
		type: "regular",
		status: "active",
		joined: "03/08/2024",
	},
];

const typeConfig = {
	vip: { label: "VIP", variant: "default" as const },
	regular: { label: "Thường", variant: "secondary" as const },
	new: { label: "Mới", variant: "outline" as const },
};

const statusConfig = {
	active: { label: "Hoạt động", variant: "default" as const },
	inactive: { label: "Không hoạt động", variant: "secondary" as const },
};

export function CustomersTable() {
	return (
		<Card className="bg-card border-border">
			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-border">
							<tr className="text-left">
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Khách hàng
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Liên hệ
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Đơn hàng
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Tổng chi tiêu
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Loại
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Trạng thái
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Ngày tham gia
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground"></th>
							</tr>
						</thead>
						<tbody>
							{customers.map((customer) => (
								<tr
									key={customer.id}
									className="border-b border-border hover:bg-secondary/50 transition-colors"
								>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarImage
													src={`/generic-placeholder-graphic.png?height=40&width=40`}
												/>
												<AvatarFallback className="bg-primary text-primary-foreground">
													{customer.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium text-foreground">
													{customer.name}
												</p>
												<p className="text-sm text-muted-foreground">
													ID: #{customer.id}
												</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div>
											<p className="text-sm text-foreground">
												{customer.email}
											</p>
											<p className="text-sm text-muted-foreground">
												{customer.phone}
											</p>
										</div>
									</td>
									<td className="px-6 py-4">
										<span className="text-sm text-foreground">
											{customer.orders} đơn
										</span>
									</td>
									<td className="px-6 py-4">
										<span className="font-semibold text-foreground">
											{customer.spent}
										</span>
									</td>
									<td className="px-6 py-4">
										<Badge
											variant={
												typeConfig[customer.type as keyof typeof typeConfig]
													.variant
											}
										>
											{
												typeConfig[customer.type as keyof typeof typeConfig]
													.label
											}
										</Badge>
									</td>
									<td className="px-6 py-4">
										<Badge
											variant={
												statusConfig[
													customer.status as keyof typeof statusConfig
												].variant
											}
										>
											{
												statusConfig[
													customer.status as keyof typeof statusConfig
												].label
											}
										</Badge>
									</td>
									<td className="px-6 py-4">
										<span className="text-sm text-muted-foreground">
											{customer.joined}
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
													<Mail className="w-4 h-4 mr-2" />
													Gửi email
												</DropdownMenuItem>
												<DropdownMenuItem className="text-red-500 hover:bg-secondary">
													<Ban className="w-4 h-4 mr-2" />
													Vô hiệu hóa
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
