import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/customers")({
	component: RouteComponent,
});

import { Search, UserPlus } from "lucide-react";
import { CustomerStats } from "@/components/admin/customer/customer-stats";
import { CustomersTable } from "@/components/admin/customer/customers-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CustomersPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Quản lý khách hàng
					</h1>
					<p className="text-muted-foreground mt-1">
						Quản lý thông tin và lịch sử mua hàng của khách hàng
					</p>
				</div>
				<Button className="bg-primary hover:bg-primary/90">
					<UserPlus className="w-4 h-4 mr-2" />
					Thêm khách hàng
				</Button>
			</div>

			{/* Stats */}
			<CustomerStats />

			{/* Search and Filters */}
			<div className="flex items-center gap-4">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm khách hàng..."
						className="pl-10 bg-card border-border text-foreground"
					/>
				</div>
				<Button variant="outline" className="border-border bg-transparent">
					Loại khách hàng
				</Button>
				<Button variant="outline" className="border-border bg-transparent">
					Trạng thái
				</Button>
				<Button variant="outline" className="border-border bg-transparent">
					Ngày tham gia
				</Button>
			</div>

			{/* Customers Table */}
			<CustomersTable />
		</div>
	);
}

function RouteComponent() {
	return <CustomersPage />;
}
