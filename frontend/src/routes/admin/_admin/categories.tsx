import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/categories")({
	component: RouteComponent,
});

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { CategoryDialog } from "@/components/admin/category/category-dialog";
import type { ICategory } from "@/components/admin/category/category-tree";
import { CategoryTree } from "@/components/admin/category/category-tree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/lib/trpc";

export default function CategoriesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<ICategory | null>(
		null,
	);
	const [type, setType] = useState<"add" | "edit">("add");
	const [parentCategory, setParentCategory] = useState<ICategory | null>(null);
	const trpc = useTRPC();
	const { data: categories, isLoading } = useQuery(
		trpc.categories.getAllParentCategories.queryOptions(),
	);

	const handleEdit = (category: ICategory) => {
		setEditingCategory(category);
		setParentCategory(null);
		setDialogOpen(true);
		setType("edit");
	};

	const handleDelete = (category: ICategory) => {
		deleteMutation.mutate({
			id: category.id.toString(),
		});
		console.log("Delete category:", category);
	};

	const handleAddChild = (parent: ICategory) => {
		setEditingCategory(null);
		setParentCategory(parent);
		setDialogOpen(true);
		setType("add");
		setParentCategory(null);
		setEditingCategory(null);
		setParentCategory(parent);
		setEditingCategory(null);
	};

	const handleAddRoot = () => {
		setEditingCategory(null);
		setParentCategory(null);
		setDialogOpen(true);
		setType("add");
		setParentCategory(null);
		setEditingCategory(null);
	};
	const queryClient = useQueryClient();

	const createMutation = useMutation(
		trpc.categories.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(
					trpc.categories.getAllParentCategories.queryOptions(),
				);
			},
		}),
	);
	const updateMutation = useMutation(
		trpc.categories.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(
					trpc.categories.getAllParentCategories.queryOptions(),
				);
			},
		}),
	);
	const deleteMutation = useMutation(
		trpc.categories.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(
					trpc.categories.getAllParentCategories.queryOptions(),
				);
			},
		}),
	);
	const handleSave = (data: {
		id?: number;
		name: string;
		slug: string;
		parentId: number | null;
	}) => {
		if (type === "add") {
			createMutation.mutate({
				name: data.name,
				parentId: Number(data.parentId) || null,
				slug: data.slug,
			});
		} else {
			updateMutation.mutate({
				id: data.id?.toString() || "0",
				name: data.name,
				parentId: Number(data.parentId) || null,
				slug: data.slug,
			});
		}
	};

	const filteredCategories = React.useMemo(() => {
		function searchByName(
			categories: ICategory[],
			keyword: string,
		): ICategory[] {
			const lowerKeyword = _.toLower(keyword);

			const recursiveSearch = (nodes: ICategory[]): ICategory[] => {
				return _.chain(nodes)
					.map((node) => {
						const matchedChildren = node.children
							? recursiveSearch(node.children)
							: [];

						const isMatched = _.includes(_.toLower(node.name), lowerKeyword);

						// nếu node này match hoặc có children match -> giữ lại
						if (isMatched || !_.isEmpty(matchedChildren)) {
							return {
								...node,
								children: matchedChildren,
							};
						}

						return null;
					})
					.compact() // loại bỏ null
					.value();
			};

			return recursiveSearch(categories);
		}
		return searchByName((categories as any) || [], searchQuery);
	}, [categories, searchQuery]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Quản lý danh mục
					</h1>
					<p className="text-muted-foreground mt-1">
						Quản lý cấu trúc danh mục sản phẩm theo cấp bậc
					</p>
				</div>
				<Button
					onClick={handleAddRoot}
					className="bg-primary hover:bg-primary/90"
				>
					<Plus className="w-4 h-4 mr-2" />
					Thêm danh mục gốc
				</Button>
			</div>

			{/* Search */}
			<div className="flex items-center gap-4">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm danh mục..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 bg-card border-border text-foreground"
					/>
				</div>
			</div>

			{/* Category Tree */}
			<CategoryTree
				categories={filteredCategories as ICategory[]}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onAddChild={handleAddChild}
			/>

			{/* Category Dialog */}
			<CategoryDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				category={editingCategory}
				parentCategory={parentCategory}
				allCategories={(categories as any) || []}
				onSave={handleSave}
			/>
		</div>
	);
}

function RouteComponent() {
	return <CategoriesPage />;
}
