import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/products")({
	component: RouteComponent,
});

import { Plus, Search } from "lucide-react";
import { ProductStats } from "@/components/admin/product/product-stats";
import { ProductsTable } from "@/components/admin/product/products-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductsPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Quản lý sản phẩm (SPU)
					</h1>
					<p className="text-muted-foreground mt-1">
						Quản lý sản phẩm chính - Standard Product Unit
					</p>
				</div>
				<Button className="bg-primary hover:bg-primary/90">
					<Plus className="w-4 h-4 mr-2" />
					Thêm sản phẩm
				</Button>
			</div>

			{/* Stats */}
			<ProductStats />

			{/* Search and Filters */}
			<div className="flex items-center gap-4">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm sản phẩm..."
						className="pl-10 bg-card border-border text-foreground"
					/>
				</div>
				<Button variant="outline" className="border-border bg-transparent">
					Danh mục
				</Button>
				<Button variant="outline" className="border-border bg-transparent">
					Trạng thái
				</Button>
				<Button variant="outline" className="border-border bg-transparent">
					Giá
				</Button>
			</div>

			{/* Products Table */}
			<ProductsTable />
		</div>
	);
}

function RouteComponent() {
	return <ProductsPage />;
}
