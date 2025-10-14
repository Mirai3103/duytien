import { useEffect, useState } from "react";
import slugify from "slugify";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ICategory } from "./category-tree";

interface CategoryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category?: ICategory | null;
	parentCategory?: ICategory | null;
	allCategories: ICategory[];
	onSave: (data: {
		id?: number;
		name: string;
		slug: string;
		parentId: number | null;
	}) => void;
}

export function CategoryDialog({
	open,
	onOpenChange,
	category,
	parentCategory,
	allCategories,
	onSave,
}: CategoryDialogProps) {
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [parentId, setParentId] = useState<string>("");

	useEffect(() => {
		if (open) {
			if (category) {
				// Edit mode
				setName(category.name);
				setSlug(category.slug);
				setParentId(category.parentId?.toString() || "");
			} else if (parentCategory) {
				// Add child mode
				setName("");
				setSlug("");
				setParentId(parentCategory.id.toString());
			} else {
				// Add root mode
				setName("");
				setSlug("");
				setParentId("");
			}
		}
	}, [open, category, parentCategory]);

	const handleNameChange = (value: string) => {
		setName(value);
		if (!category) {
			// Auto-generate slug only when creating new category
			setSlug(slugify(value, { lower: true, strict: true }));
		}
	};

	const handleSave = () => {
		onSave({
			id: category?.id,
			name,
			slug,
			parentId: parentId ? parseInt(parentId, 10) : null,
		});
		onOpenChange(false);
	};

	const getFlatCategories = (
		cats: ICategory[],
		exclude?: number,
	): ICategory[] => {
		const result: ICategory[] = [];
		const flatten = (items: ICategory[]) => {
			items.forEach((cat) => {
				if (cat.id !== exclude) {
					result.push(cat);
					if (cat.children) {
						flatten(cat.children);
					}
				}
			});
		};
		flatten(cats);
		return result;
	};

	const flatCategories = getFlatCategories(allCategories, category?.id);

	const isFormValid = name.trim() && slug.trim();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-card border-border sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-foreground">
						{category ? "Sửa danh mục" : "Thêm danh mục mới"}
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						{category
							? "Cập nhật thông tin danh mục"
							: parentCategory
								? `Thêm danh mục con vào "${parentCategory.name}"`
								: "Tạo danh mục mới"}
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{/* Name Input */}
					<div className="grid gap-2">
						<Label htmlFor="name" className="text-foreground">
							Tên danh mục <span className="text-red-500">*</span>
						</Label>
						<Input
							type="text"
							value={name}
							onChange={(e) => handleNameChange(e.target.value)}
							placeholder="Nhập tên danh mục"
							className="bg-card border-border text-foreground"
						/>
					</div>

					{/* Slug Input */}
					<div className="grid gap-2">
						<Label htmlFor="slug" className="text-foreground">
							URL <span className="text-red-500">*</span>
						</Label>
						<Input
							value={slug}
							disabled
							onChange={(e) => setSlug(e.target.value)}
							placeholder="ten-danh-muc"
							className="bg-card border-border text-foreground"
						/>
						<p className="text-xs text-muted-foreground">
							URL thân thiện, tự động tạo từ tên
						</p>
					</div>

					{/* Parent Category Select */}
					<div className="grid gap-2">
						<Label htmlFor="parent" className="text-foreground">
							Danh mục cha
						</Label>
						<Select
							value={parentId}
							onValueChange={setParentId}
							disabled={!!parentCategory}
						>
							<SelectTrigger className="bg-card border-border text-foreground">
								<SelectValue placeholder="Không có (danh mục gốc)" />
							</SelectTrigger>
							<SelectContent className="bg-card border-border">
								<SelectItem value="0" className="text-foreground">
									Không có (danh mục gốc)
								</SelectItem>
								{flatCategories.map((cat) => (
									<SelectItem
										key={cat.id}
										value={cat.id.toString()}
										className="text-foreground"
									>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						className="border-border bg-transparent"
					>
						Hủy
					</Button>
					<Button
						onClick={handleSave}
						disabled={!isFormValid}
						className="bg-primary hover:bg-primary/90"
					>
						{category ? "Cập nhật" : "Tạo mới"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
