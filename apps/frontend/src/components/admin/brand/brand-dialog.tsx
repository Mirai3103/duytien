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
import type { IBrand } from "./brands-table";

interface BrandDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	brand?: IBrand | null;
	onSave: (data: {
		id?: number;
		name: string;
		slug: string;
		logo?: string;
	}) => void;
}

export function BrandDialog({
	open,
	onOpenChange,
	brand,
	onSave,
}: BrandDialogProps) {
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [logo, setLogo] = useState("");

	useEffect(() => {
		if (open) {
			if (brand) {
				// Edit mode
				setName(brand.name);
				setSlug(brand.slug);
				setLogo(brand.logo || "");
			} else {
				// Add mode
				setName("");
				setSlug("");
				setLogo("");
			}
		}
	}, [open, brand]);

	const handleNameChange = (value: string) => {
		setName(value);
		if (!brand) {
			// Auto-generate slug only when creating new brand
			setSlug(slugify(value));
		}
	};

	const handleSave = () => {
		onSave({
			id: brand?.id,
			name,
			slug,
			logo: logo || undefined,
		});
		onOpenChange(false);
	};

	const isFormValid = name.trim() && slug.trim();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-card border-border sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-foreground">
						{brand ? "Sửa thương hiệu" : "Thêm thương hiệu mới"}
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						{brand ? "Cập nhật thông tin thương hiệu" : "Tạo thương hiệu mới"}
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{/* Name Input */}
					<div className="grid gap-2">
						<Label htmlFor="name" className="text-foreground">
							Tên thương hiệu <span className="text-red-500">*</span>
						</Label>
						<Input
							value={name}
							onChange={(e) => handleNameChange(e.target.value)}
							placeholder="Nhập tên thương hiệu"
							className="bg-card border-border text-foreground"
						/>
					</div>

					{/* Slug Input */}
					<div className="grid gap-2">
						<Label htmlFor="slug" className="text-foreground">
							Slug <span className="text-red-500">*</span>
						</Label>
						<Input
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							placeholder="ten-thuong-hieu"
							className="bg-card border-border text-foreground"
						/>
						<p className="text-xs text-muted-foreground">
							URL thân thiện, tự động tạo từ tên
						</p>
					</div>

					{/* Logo URL Input */}
					<div className="grid gap-2">
						<Label htmlFor="logo" className="text-foreground">
							Logo URL
						</Label>
						<Input
							value={logo}
							onChange={(e) => setLogo(e.target.value)}
							placeholder="https://example.com/logo.png"
							className="bg-card border-border text-foreground"
						/>
						<p className="text-xs text-muted-foreground">
							Đường dẫn URL tới logo thương hiệu
						</p>
					</div>

					{/* Logo Preview */}
					{logo && (
						<div className="grid gap-2">
							<Label className="text-foreground">Xem trước</Label>
							<div className="border border-border rounded-lg p-4 bg-muted/20">
								<img
									src={logo}
									alt="Logo preview"
									className="h-16 object-contain"
									onError={(e) => {
										e.currentTarget.style.display = "none";
									}}
								/>
							</div>
						</div>
					)}
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
						{brand ? "Cập nhật" : "Tạo mới"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
