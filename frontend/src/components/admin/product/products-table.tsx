import { Link } from "@tanstack/react-router";
import { Edit, Eye, Layers, MoreHorizontal, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const products = [
	{
		id: 1,
		name: "iPhone 15 Pro Max",
		category: "Điện thoại",
		basePrice: "₫32,990,000",
		skuCount: 8,
		stock: 45,
		status: "active",
		image: "/modern-smartphone.png",
	},
	{
		id: 2,
		name: "Samsung Galaxy S24 Ultra",
		category: "Điện thoại",
		basePrice: "₫29,990,000",
		skuCount: 6,
		stock: 32,
		status: "active",
		image: "/samsung-products.png",
	},
	{
		id: 3,
		name: "AirPods Pro 2nd Gen",
		category: "Phụ kiện",
		basePrice: "₫6,490,000",
		skuCount: 1,
		stock: 0,
		status: "out_of_stock",
		image: "/wireless-earbuds.png",
	},
	{
		id: 4,
		name: "iPad Air M2",
		category: "Máy tính bảng",
		basePrice: "₫16,990,000",
		skuCount: 4,
		stock: 28,
		status: "active",
		image: "/ipad-on-desk.png",
	},
	{
		id: 5,
		name: "MacBook Air M3",
		category: "Laptop",
		basePrice: "₫28,990,000",
		skuCount: 3,
		stock: 15,
		status: "active",
		image: "/silver-macbook-on-desk.png",
	},
	{
		id: 6,
		name: "Apple Watch Series 9",
		category: "Phụ kiện",
		basePrice: "₫10,990,000",
		skuCount: 12,
		stock: 52,
		status: "active",
		image: "/apple-watch.jpg",
	},
	{
		id: 7,
		name: "Ốp lưng iPhone 15 Pro",
		category: "Phụ kiện",
		basePrice: "₫490,000",
		skuCount: 24,
		stock: 156,
		status: "active",
		image: "/stylish-phone-case.png",
	},
	{
		id: 8,
		name: "Sạc nhanh Xiaomi",
		category: "Phụ kiện",
		basePrice: "₫590,000",
		skuCount: 2,
		stock: 89,
		status: "active",
		image: "/electric-vehicle-charger.png",
	},
];

const statusConfig = {
	active: { label: "Đang bán", variant: "default" as const },
	out_of_stock: { label: "Hết hàng", variant: "destructive" as const },
	draft: { label: "Nháp", variant: "secondary" as const },
};

export function ProductsTable() {
	return (
		<Card className="bg-card border-border">
			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-border">
							<tr className="text-left">
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Sản phẩm
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Danh mục
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Giá gốc
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Số biến thể
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Tồn kho
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground">
									Trạng thái
								</th>
								<th className="px-6 py-4 text-sm font-medium text-muted-foreground"></th>
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr
									key={product.id}
									className="border-b border-border hover:bg-secondary/50 transition-colors"
								>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
												<img
													src={product.image || "/placeholder.svg"}
													alt={product.name}
													width={48}
													height={48}
													className="w-full h-full object-cover"
												/>
											</div>
											<div>
												<p className="font-medium text-foreground">
													{product.name}
												</p>
												<p className="text-sm text-muted-foreground">
													SPU ID: #{product.id}
												</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<span className="text-sm text-foreground">
											{product.category}
										</span>
									</td>
									<td className="px-6 py-4">
										<span className="font-semibold text-foreground">
											{product.basePrice}
										</span>
									</td>
									<td className="px-6 py-4">
										<Link to={`/admin/skus?spu=${product.id}`}>
											<Badge
												variant="outline"
												className="cursor-pointer hover:bg-secondary"
											>
												<Layers className="w-3 h-3 mr-1" />
												{product.skuCount} SKU
											</Badge>
										</Link>
									</td>
									<td className="px-6 py-4">
										<span
											className={`text-sm ${
												product.stock === 0
													? "text-red-500"
													: product.stock < 20
														? "text-yellow-500"
														: "text-green-500"
											}`}
										>
											{product.stock} sản phẩm
										</span>
									</td>
									<td className="px-6 py-4">
										<Badge
											variant={
												statusConfig[
													product.status as keyof typeof statusConfig
												].variant
											}
										>
											{
												statusConfig[
													product.status as keyof typeof statusConfig
												].label
											}
										</Badge>
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
												<DropdownMenuItem
													asChild
													className="text-foreground hover:bg-secondary"
												>
													<Link to={`/admin/skus?spu=${product.id}`}>
														<Layers className="w-4 h-4 mr-2" />
														Quản lý SKU
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem className="text-foreground hover:bg-secondary">
													<Edit className="w-4 h-4 mr-2" />
													Chỉnh sửa
												</DropdownMenuItem>
												<DropdownMenuItem className="text-red-500 hover:bg-secondary">
													<Trash2 className="w-4 h-4 mr-2" />
													Xóa
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
