import { Link } from "@tanstack/react-router";
import { ChevronRight, Menu, Smartphone, Tablet, Keyboard, Package } from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";

// Icon mapping for categories
const iconMap: Record<string, any> = {
	"điện thoại": Smartphone,
	"máy tính bảng": Tablet,
	"phụ kiện": Keyboard,
	"tablet": Tablet,
	"phone": Smartphone,
	"accessory": Keyboard,
};

// Default price ranges
const defaultPriceRanges = [
	{ label: "Dưới 2 triệu", min: 0, max: 2000000 },
	{ label: "Từ 2 - 4 triệu", min: 2000000, max: 4000000 },
	{ label: "Từ 4 - 7 triệu", min: 4000000, max: 7000000 },
	{ label: "Từ 7 - 13 triệu", min: 7000000, max: 13000000 },
	{ label: "Từ 13 - 20 triệu", min: 13000000, max: 20000000 },
	{ label: "Trên 20 triệu", min: 20000000, max: 100000000 },
];

// Default hot products for each category
const defaultHotProducts: Record<string, any[]> = {
	"điện thoại": [
		{ name: "iPhone 16 Pro Max", hot: true },
		{ name: "Samsung Galaxy S24 Ultra", hot: true },
		{ name: "Xiaomi 14T Pro" },
		{ name: "OPPO Reno12", hot: true },
		{ name: "Redmi Note 13 Pro" },
		{ name: "Vivo V30 Pro" },
		{ name: "realme 12 Pro+" },
		{ name: "HONOR Magic6 Pro" },
	],
	"máy tính bảng": [
		{ name: "iPad Air M2", hot: true },
		{ name: "iPad Pro 2024" },
		{ name: "Galaxy Tab S9", hot: true },
		{ name: "Xiaomi Pad 6" },
		{ name: "HONOR Pad X9", hot: true },
		{ name: "Lenovo Tab P12" },
	],
};

const MegaMenu = () => {
	const trpc = useTRPC();
	const [isOpen, setIsOpen] = useState(false);

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

			// Get metadata from category if available, otherwise use defaults
			const metadata = category.metadata || {};
			const hotProducts = metadata.hotProducts || defaultHotProducts[categoryName] || [];
			const priceRanges = metadata.priceRanges || defaultPriceRanges;

			// Map subcategories (children) as brands for accessory categories
			const isAccessoryCategory = categoryName.includes("phụ kiện");
			const categoryBrands = isAccessoryCategory && category.children
				? category.children.map((child: any) => ({
						name: child.name,
						logo: "📦",
				  }))
				: [];

			return {
				id: category.id,
				slug: category.slug,
				icon,
				label: category.name,
				brands: categoryBrands.length > 0 ? categoryBrands : undefined,
				hotProducts,
				priceRanges,
				children: category.children || [],
			};
		});
	}, [categoriesData]);

	const [activeCategory, setActiveCategory] = useState<any>(categories[0]);

	// Update active category when categories load
	if (!activeCategory && categories.length > 0) {
		setActiveCategory(categories[0]);
	}

	// Don't render if no categories
	if (!categories || categories.length === 0) {
		return null;
	}

	return (
		<div className="relative ">
			<Button
				variant="ghost"
				className="flex items-center gap-2 font-semibold text-white border border-white/80 hover:bg-white hover:text-primary transition-all px-4"
				onMouseEnter={() => setIsOpen(true)}
				onClick={() => setIsOpen(!isOpen)}
			>
				<Menu size={20} />
				Danh mục
			</Button>

			{isOpen && (
				<>
					{/* Overlay */}
					<button
						type="button"
						className="fixed inset-0 bg-black/20 z-40"
						onClick={() => setIsOpen(false)}
					/>

					{/* Mega Menu Dropdown */}
					<button
						type="button"
						className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl z-50 flex"
						style={{ width: "1000px", maxHeight: "600px" }}
						onMouseLeave={() => setIsOpen(false)}
					>
						{/* Left Sidebar - Categories */}
						<div className="w-72 border-r bg-gray-50">
							{categories.map((category) => (
								<button
									type="button"
									key={category.id}
									className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
										activeCategory.id === category.id
											? "bg-white text-primary border-l-4 border-primary"
											: "hover:bg-white hover:text-primary"
									}`}
									onMouseEnter={() => setActiveCategory(category)}
								>
									<category.icon size={20} className="text-primary" />
									<span className="font-medium flex-1">{category.label}</span>
									<ChevronRight size={16} />
								</button>
							))}
						</div>

						{/* Right Content - Subcategories */}
						<div className="flex-1 p-6 overflow-y-auto">
							{activeCategory.label?.toLowerCase().includes("điện thoại") && (
								<div className="space-y-6">
									{/* Phone Brands */}
									{brandsData && Array.isArray(brandsData) && brandsData.length > 0 && (
										<div>
											<h3 className="font-bold text-lg mb-4">Hãng điện thoại</h3>
											<div className="grid grid-cols-6 gap-3">
												{brandsData.slice(0, 18).map((brand: any) => (
													<Link
														key={brand.id}
														to="/search"
														search={{ brandId: [brand.id] }}
														className="flex items-center justify-center gap-2 px-3 py-2 border rounded-lg hover:border-primary hover:text-primary transition-all"
													>
														<span className="font-medium text-sm">
															{brand.name}
														</span>
													</Link>
												))}
											</div>
										</div>
									)}

									{/* Hot Products */}
									{activeCategory.hotProducts && activeCategory.hotProducts.length > 0 && (
										<div>
											<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
												Điện thoại HOT
												<span className="text-yellow-500">⚡</span>
											</h3>
											<div className="grid grid-cols-4 gap-3">
												{activeCategory.hotProducts.map((product: any, idx: number) => (
													<Link
														key={idx}
														to="/search"
														search={{ keyword: product.name }}
														className="px-3 py-2 border rounded-lg hover:border-primary transition-all text-center relative"
													>
														{product.hot && (
															<Badge className="absolute -top-2 -right-2 bg-primary text-xs">
																HOT
															</Badge>
														)}
														<span className="text-sm">{product.name}</span>
													</Link>
												))}
											</div>
										</div>
									)}
								</div>
							)}

							{activeCategory.label?.toLowerCase().includes("máy tính bảng") && (
								<div className="space-y-6">
									{/* Tablet Brands */}
									{brandsData && brandsData.length > 0 && (
										<div>
											<h3 className="font-bold text-lg mb-4">Hãng máy tính bảng</h3>
											<div className="grid grid-cols-6 gap-3">
												{brandsData.slice(0, 12).map((brand: any) => (
													<Link
														key={brand.id}
														to="/search"
														search={{ brandId: [brand.id], categoryId: [activeCategory.id] }}
														className="flex items-center justify-center gap-2 px-3 py-2 border rounded-lg hover:border-primary hover:text-primary transition-all"
													>
														<span className="font-medium text-sm">
															{brand.name}
														</span>
													</Link>
												))}
											</div>
										</div>
									)}

									{/* Hot Products */}
									{activeCategory.hotProducts && activeCategory.hotProducts.length > 0 && (
										<div>
											<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
												Sản phẩm HOT
												<span className="text-yellow-500">⚡</span>
											</h3>
											<div className="grid grid-cols-4 gap-3">
												{activeCategory.hotProducts.map((product: any, idx: number) => (
													<Link
														key={idx}
														to="/search"
														search={{ keyword: product.name }}
														className="px-3 py-2 border rounded-lg hover:border-primary transition-all text-center relative"
													>
														{product.hot && (
															<Badge className="absolute -top-2 -right-2 bg-primary text-xs">
																HOT
															</Badge>
														)}
														<span className="text-sm">{product.name}</span>
													</Link>
												))}
											</div>
										</div>
									)}

									{/* Price Ranges */}
									{activeCategory.priceRanges && activeCategory.priceRanges.length > 0 && (
										<div>
											<h3 className="font-bold text-lg mb-4">
												Mức giá
											</h3>
											<div className="flex flex-wrap gap-3">
												{activeCategory.priceRanges.map((range: any, idx: number) => (
													<Link
														key={idx}
														to="/search"
														search={{ priceMin: range.min, priceMax: range.max }}
														className="px-4 py-2 border rounded-full hover:border-primary hover:bg-primary hover:text-white transition-all"
													>
														<span className="text-sm font-medium">{range.label}</span>
													</Link>
												))}
											</div>
										</div>
									)}
								</div>
							)}

							{activeCategory.brands && !activeCategory.label?.toLowerCase().includes("điện thoại") && !activeCategory.label?.toLowerCase().includes("máy tính bảng") && (
								<div className="space-y-6">
									<div>
										<h3 className="font-bold text-lg mb-4">Danh mục sản phẩm</h3>
										<div className="grid grid-cols-4 gap-3">
											{activeCategory.brands.map((brand: any, idx: number) => (
												<Link
													key={idx}
													to="/search"
													search={{ categoryId: [activeCategory.id] }}
													className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:border-primary hover:text-primary transition-all"
												>
													<span className="text-xl">{brand.logo}</span>
													<span className="font-medium text-sm">
														{brand.name}
													</span>
												</Link>
											))}
										</div>
									</div>

									{activeCategory.hotProducts &&
										activeCategory.hotProducts.length > 0 && (
											<div>
												<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
													Sản phẩm HOT
													<span className="text-yellow-500">⚡</span>
												</h3>
												<div className="grid grid-cols-4 gap-3">
													{activeCategory.hotProducts.map((product: any, idx: number) => (
														<Link
															key={idx}
															to="/search"
															search={{ keyword: product.name as string , categoryId: [activeCategory.id] }}
															className="px-3 py-2 border rounded-lg hover:border-primary transition-all text-center relative"
														>
															{product.hot && (
																<Badge className="absolute -top-2 -right-2 bg-primary text-xs">
																	HOT
																</Badge>
															)}
															<span className="text-sm">{product.name}</span>
														</Link>
													))}
												</div>
											</div>
										)}
								</div>
							)}

							{!activeCategory.brands && !activeCategory.label?.toLowerCase().includes("điện thoại") && !activeCategory.label?.toLowerCase().includes("máy tính bảng") && (
								<div className="flex items-center justify-center h-full">
									<p className="text-muted-foreground">
										Nội dung đang được cập nhật...
									</p>
								</div>
							)}
						</div>
					</button>
				</>
			)}
		</div>
	);
};

export default MegaMenu;
