import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/brands")({
	component: RouteComponent,
});

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { BrandDialog } from "@/components/admin/brand/brand-dialog";
import type { IBrand } from "@/components/admin/brand/brands-table";
import { BrandsTable } from "@/components/admin/brand/brands-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useTRPC } from "@/lib/trpc";
export default function BrandsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedValue] = useDebounceValue(searchQuery, 500);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingBrand, setEditingBrand] = useState<IBrand | null>(null);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
	});
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const { data: brands } = useQuery(
		trpc.brands.getAll.queryOptions({
			page: pagination.page,
			limit: pagination.limit,
			search: debouncedValue,
		}),
	);
	const handleEdit = (brand: IBrand) => {
		setEditingBrand(brand);
		setDialogOpen(true);
	};

	const mutateDelete = useMutation(
		trpc.brands.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(
					trpc.brands.getAll.queryOptions({
						limit: pagination.limit,
						page: pagination.page,
						search: debouncedValue,
					}),
				);
			},
		}),
	);
	const handleDelete = (brand: IBrand) => {
		mutateDelete.mutate({ id: brand.id });
	};

	const handleAdd = () => {
		setEditingBrand(null);
		setDialogOpen(true);
	};

	const handleSave = (data: {
		id?: number;
		name: string;
		slug: string;
		logo?: string;
	}) => {
		// TODO: Implement API call to save brand
		console.log("Save brand:", data);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Quản lý thương hiệu
					</h1>
					<p className="text-muted-foreground mt-1">
						Quản lý các thương hiệu sản phẩm
					</p>
				</div>
				<Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
					<Plus className="w-4 h-4 mr-2" />
					Thêm thương hiệu
				</Button>
			</div>

			{/* Search */}
			<div className="flex items-center gap-4">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm thương hiệu..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 bg-card border-border text-foreground"
					/>
				</div>
			</div>

			{/* Brands Table */}
			<BrandsTable
				brands={(brands || []) as unknown as IBrand[]}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>

			{/* Pagination */}
			<Pagination className="mt-4">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href="#"
							onClick={(e) => {
								e.preventDefault();
								setPagination((prev) => ({
									...prev,
									page: Math.max(1, prev.page - 1),
								}));
							}}
							className={
								pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
							}
						/>
					</PaginationItem>

					{pagination.page > 1 && (
						<PaginationItem>
							<PaginationLink
								href="#"
								onClick={(e) => {
									e.preventDefault();
									setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
								}}
							>
								{pagination.page - 1}
							</PaginationLink>
						</PaginationItem>
					)}

					<PaginationItem>
						<PaginationLink href="#" isActive>
							{pagination.page}
						</PaginationLink>
					</PaginationItem>

					{(brands?.length ?? 0) === pagination.limit && (
						<PaginationItem>
							<PaginationLink
								href="#"
								onClick={(e) => {
									e.preventDefault();
									setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
								}}
							>
								{pagination.page + 1}
							</PaginationLink>
						</PaginationItem>
					)}

					{(brands?.length ?? 0) === pagination.limit && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}

					<PaginationItem>
						<PaginationNext
							href="#"
							onClick={(e) => {
								e.preventDefault();
								if ((brands?.length ?? 0) === pagination.limit) {
									setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
								}
							}}
							className={
								(brands?.length ?? 0) < pagination.limit
									? "pointer-events-none opacity-50"
									: ""
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>

			{/* Brand Dialog */}
			<BrandDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				brand={editingBrand}
				onSave={handleSave}
			/>
		</div>
	);
}

function RouteComponent() {
	return <BrandsPage />;
}
