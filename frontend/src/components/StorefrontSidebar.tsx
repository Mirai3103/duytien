import { Link } from "@tanstack/react-router";
import {
	ChevronRight,
	Menu,
	Smartphone,
	Tablet,
	Keyboard,
	Package,
	Home,
	Tag,
	Newspaper,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Icon mapping for categories
const iconMap: Record<string, any> = {
	"điện thoại": Smartphone,
	"máy tính bảng": Tablet,
	"phụ kiện": Keyboard,
	tablet: Tablet,
	phone: Smartphone,
	accessory: Keyboard,
};

interface StorefrontSidebarProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const StorefrontSidebar = ({ open, onOpenChange }: StorefrontSidebarProps) => {
	const trpc = useTRPC();
	const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

	// Fetch categories and brands
	const { data: categoriesData } = useQuery(
		trpc.categories.getAllParentCategories.queryOptions()
	);

	const { data: brandsData } = useQuery(
		trpc.brands.getAll.queryOptions({ page: 1, limit: 100, search: "" })
	);

	// Transform data into menu structure
	const categories = useMemo(() => {
		if (!categoriesData) return [];

		return categoriesData.map((category: any) => {
			const categoryName = category.name.toLowerCase();
			const icon = iconMap[categoryName] || Package;

			return {
				id: category.id,
				slug: category.slug,
				icon,
				label: category.name,
				children: category.children || [],
			};
		});
	}, [categoriesData]);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
				<SheetHeader className="px-4 py-4 border-b">
					<SheetTitle className="text-lg font-bold flex items-center gap-2">
						<Menu size={20} />
						Danh mục sản phẩm
					</SheetTitle>
				</SheetHeader>

				<ScrollArea className="h-[calc(100vh-80px)]">
					<div className="p-4 space-y-2">
						{/* Quick Links */}
						<div className="space-y-1">
							<Link
								to="/"
								onClick={() => onOpenChange(false)}
								className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
							>
								<Home size={18} className="text-primary" />
								<span className="font-medium">Trang chủ</span>
							</Link>
							<Link
								to="/search"
								onClick={() => onOpenChange(false)}
								className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
							>
								<Tag size={18} className="text-primary" />
								<span className="font-medium">Flash Sale</span>
							</Link>
						</div>

						<Separator className="my-4" />

						{/* Categories */}
						<div className="space-y-1">
							<p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
								Danh mục
							</p>
							{categories.map((category) => (
								<Collapsible
									key={category.id}
									open={expandedCategory === category.id}
									onOpenChange={() =>
										setExpandedCategory(
											expandedCategory === category.id ? null : category.id
										)
									}
								>
									<CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group">
										<div className="flex items-center gap-3">
											<category.icon size={18} className="text-primary" />
											<span className="font-medium">{category.label}</span>
										</div>
										{category.children.length > 0 && (
											<ChevronRight
												size={16}
												className={`text-muted-foreground transition-transform ${
													expandedCategory === category.id ? "rotate-90" : ""
												}`}
											/>
										)}
									</CollapsibleTrigger>
									{category.children.length > 0 && (
										<CollapsibleContent className="mt-1 space-y-1">
											<Link
												to="/search"
												search={{ categoryId: [category.id] }}
												onClick={() => onOpenChange(false)}
												className="flex items-center gap-2 px-3 py-2 ml-8 rounded-lg text-sm hover:bg-accent transition-colors"
											>
												<span>Tất cả {category.label}</span>
											</Link>
											{category.children.slice(0, 6).map((child: any) => (
												<Link
													key={child.id}
													to="/search"
													search={{ categoryId: [child.id] }}
													onClick={() => onOpenChange(false)}
													className="flex items-center gap-2 px-3 py-2 ml-8 rounded-lg text-sm hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
												>
													<span>→ {child.name}</span>
												</Link>
											))}
										</CollapsibleContent>
									)}
								</Collapsible>
							))}
						</div>

						{brandsData && brandsData.length > 0 && (
							<>
								<Separator className="my-4" />

								{/* Popular Brands */}
								<div className="space-y-2">
									<p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
										Thương hiệu nổi bật
									</p>
									<div className="grid grid-cols-2 gap-2 px-3">
										{brandsData.slice(0, 8).map((brand: any) => (
											<Link
												key={brand.id}
												to="/search"
												search={{ brandId: [brand.id] }}
												onClick={() => onOpenChange(false)}
												className="flex items-center justify-center px-3 py-2 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
											>
												{brand.name}
											</Link>
										))}
									</div>
								</div>
							</>
						)}
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};

export default StorefrontSidebar;
