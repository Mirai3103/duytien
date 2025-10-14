import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import _ from "lodash";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useTRPC } from "@/lib/trpc";

const categories = ["Điện thoại", "Laptop", "Tai nghe", "Phụ kiện", "Đồng hồ"];
const brands = ["Apple", "Samsung", "Xiaomi", "Oppo", "JBL", "Baseus"];
// Remove unused Product type
function ProductCard({ product }: { product: any }) {
	const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

	const attrs = React.useMemo(() => {
		function extractAttrs(product: any) {
			const grouped = _.flatMap(product.variants, "variantValues");
			const groupedByAttr = _.groupBy(grouped, (vv) => vv.value.attribute.name);
			return _.map(groupedByAttr, (arr, attrName) => ({
				name: attrName,
				values: _.uniqBy(arr, (vv) => vv.value.value).map((vv) => ({
					value: vv.value.value,
					displayValue: vv.value.metadata?.displayValue ?? vv.value.value,
					code: vv.value.metadata?.code ?? null,
				})),
			}));
		}
		return extractAttrs(product);
	}, [product]);

	// Handle variant selection
	const handleAttributeChange = (attrName: string, attrValue: string) => {
		const currentSelection = selectedVariant.variantValues.reduce(
			(acc: any, vv: any) => {
				acc[vv.value.attribute.name] = vv.value.value;
				return acc;
			},
			{} as Record<string, string>,
		);

		// Update the selection for this attribute
		currentSelection[attrName] = attrValue;

		// Find variant that matches all current selections
		const matchingVariant = product.variants.find((variant: any) => {
			const variantAttrs = variant.variantValues.reduce(
				(acc: any, vv: any) => {
					acc[vv.value.attribute.name] = vv.value.value;
					return acc;
				},
				{} as Record<string, string>,
			);

			return Object.keys(currentSelection).every(
				(key) => variantAttrs[key] === currentSelection[key],
			);
		});

		if (matchingVariant) {
			setSelectedVariant(matchingVariant);
		}
	};

	// Check if an attribute value is available with current selection
	const isAttributeAvailable = (attrName: string, attrValue: string) => {
		const currentSelection = selectedVariant.variantValues.reduce(
			(acc: any, vv: any) => {
				acc[vv.value.attribute.name] = vv.value.value;
				return acc;
			},
			{} as Record<string, string>,
		);

		const tempSelection = { ...currentSelection, [attrName]: attrValue };

		return product.variants.some((variant: any) => {
			const variantAttrs = variant.variantValues.reduce(
				(acc: any, vv: any) => {
					acc[vv.value.attribute.name] = vv.value.value;
					return acc;
				},
				{} as Record<string, string>,
			);

			return Object.keys(tempSelection).every(
				(key) => variantAttrs[key] === tempSelection[key],
			);
		});
	};

	const isOnSale = Math.random() > 0.5;
	const discountPercent = Math.floor(Math.random() * 50) + 10;
	const originalPrice = parseInt(selectedVariant.price, 10);
	const salePrice = isOnSale
		? Math.floor(originalPrice * (1 - discountPercent / 100))
		: originalPrice;
	const navigate = useNavigate();
	return (
		<Card
			onClick={() =>
				navigate({ to: "/product/$id", params: { id: selectedVariant.id } })
			}
			className="group hover:shadow-lg transition-all duration-300 hover:border-primary cursor-pointer overflow-hidden"
		>
			<CardContent className="p-3">
				<div className="relative mb-3">
					{isOnSale && (
						<Badge className="absolute top-2 left-2 z-10 bg-primary text-white shadow-md">
							-{discountPercent}%
						</Badge>
					)}
					<img
						src={selectedVariant.image!}
						alt={selectedVariant.name}
						className="w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-300"
					/>
				</div>

				<h3 className="font-medium text-sm mb-2 line-clamp-2 min-h-[40px]">
					{selectedVariant.name}
				</h3>
				<div className="space-y-1 mb-3">
					{isOnSale && (
						<div className="text-xs text-muted-foreground line-through">
							{originalPrice.toLocaleString("vi-VN")}đ
						</div>
					)}
					<div className="text-lg font-bold text-primary">
						{salePrice.toLocaleString("vi-VN")}đ
					</div>
				</div>
				{/* Variant Selection */}
				<div className="space-y-3 mb-3">
					{attrs.map((attr) => (
						<div key={attr.name}>
							<div className="text-xs font-medium text-muted-foreground mb-1">
								{attr.name}
							</div>
							<div className="flex flex-wrap gap-1">
								{attr.values.map((value) => {
									const isSelected = selectedVariant.variantValues.some(
										(vv: any) =>
											vv.value.attribute.name === attr.name &&
											vv.value.value === value.value,
									);
									const isAvailable = isAttributeAvailable(
										attr.name,
										value.value,
									);

									if (
										attr.name.toLowerCase().includes("màu") ||
										attr.name.toLowerCase().includes("color")
									) {
										// Color swatches
										return (
											<button
												type="button"
												key={value.value}
												onClick={() =>
													handleAttributeChange(attr.name, value.value)
												}
												disabled={!isAvailable}
												className={`
                          variant-swatch w-6 h-6 rounded-full border-2
                          ${
														isSelected
															? "border-primary ring-2 ring-primary/20"
															: "border-gray-300 hover:border-gray-400"
													}
                          ${!isAvailable ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                        `}
												style={{ backgroundColor: value.code || "#e5e7eb" }}
												title={value.displayValue}
											>
												{isSelected && (
													<Check className="absolute inset-0 m-auto w-3 h-3 text-white drop-shadow-sm" />
												)}
											</button>
										);
									} else {
										// Text options (capacity, size, etc.)
										return (
											<button
												type="button"
												key={value.value}
												onClick={() =>
													handleAttributeChange(attr.name, value.value)
												}
												disabled={!isAvailable}
												className={`
                          variant-option px-2 py-1 text-xs rounded-md border
                          ${
														isSelected
															? "border-primary bg-primary/10 text-primary font-medium"
															: "border-gray-300 hover:border-gray-400"
													}
                          ${!isAvailable ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                        `}
											>
												{value.displayValue}
											</button>
										);
									}
								})}
							</div>
						</div>
					))}
				</div>

				{/* Price */}
			</CardContent>
		</Card>
	);
}
const SearchProducts = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const [priceRange, setPriceRange] = useState([0, 50000000]);
	const [minRating, setMinRating] = useState<string>("0");
	const [sortBy, setSortBy] = useState("default");
	const [showMobileFilters, setShowMobileFilters] = useState(false);

	const toggleCategory = (category: string) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category],
		);
	};

	const toggleBrand = (brand: string) => {
		setSelectedBrands((prev) =>
			prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
		);
	};

	const clearFilters = () => {
		setSelectedCategories([]);
		setSelectedBrands([]);
		setPriceRange([0, 50000000]);
		setMinRating("0");
		setSearchQuery("");
	};
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(
		trpc.products.getProductsWithVariants.queryOptions({
			page: 1,
			limit: 10,
		}),
	);

	const FilterContent = () => (
		<div className="space-y-6">
			{/* Categories */}
			<div>
				<h3 className="font-semibold text-lg mb-3">Danh mục</h3>
				<div className="space-y-2">
					{categories.map((category) => (
						<div key={category} className="flex items-center space-x-2">
							<Checkbox
								id={`cat-${category}`}
								checked={selectedCategories.includes(category)}
								onCheckedChange={() => toggleCategory(category)}
							/>
							<Label
								htmlFor={`cat-${category}`}
								className="text-sm cursor-pointer"
							>
								{category}
							</Label>
						</div>
					))}
				</div>
			</div>

			{/* Price Range */}
			<div>
				<h3 className="font-semibold text-lg mb-3">Khoảng giá</h3>
				<div className="px-2">
					<Slider
						value={priceRange}
						onValueChange={setPriceRange}
						max={50000000}
						step={1000000}
						className="mb-4"
					/>
					<div className="flex justify-between text-sm text-muted-foreground">
						<span>{(priceRange[0] / 1000000).toFixed(0)}tr</span>
						<span>{(priceRange[1] / 1000000).toFixed(0)}tr</span>
					</div>
				</div>
			</div>

			{/* Brands */}
			<div>
				<h3 className="font-semibold text-lg mb-3">Thương hiệu</h3>
				<div className="space-y-2">
					{brands.map((brand) => (
						<div key={brand} className="flex items-center space-x-2">
							<Checkbox
								id={`brand-${brand}`}
								checked={selectedBrands.includes(brand)}
								onCheckedChange={() => toggleBrand(brand)}
							/>
							<Label
								htmlFor={`brand-${brand}`}
								className="text-sm cursor-pointer"
							>
								{brand}
							</Label>
						</div>
					))}
				</div>
			</div>

			{/* Rating */}
			<div>
				<h3 className="font-semibold text-lg mb-3">Đánh giá</h3>
				<RadioGroup value={minRating} onValueChange={setMinRating}>
					<div className="space-y-2">
						{["4.5", "4", "3.5", "3", "0"].map((rating) => (
							<div key={rating} className="flex items-center space-x-2">
								<RadioGroupItem value={rating} id={`rating-${rating}`} />
								<Label
									htmlFor={`rating-${rating}`}
									className="text-sm cursor-pointer"
								>
									{rating === "0" ? "Tất cả" : `Từ ${rating} sao trở lên`}
								</Label>
							</div>
						))}
					</div>
				</RadioGroup>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<Navbar />

			<main className="flex-1 bg-muted/30">
				<div className="container mx-auto px-4 py-6">
					{/* Search & Sort Bar */}
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Tìm sản phẩm..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-full md:w-[240px]">
								<SelectValue placeholder="Sắp xếp" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="default">Mặc định</SelectItem>
								<SelectItem value="price-asc">Giá tăng dần</SelectItem>
								<SelectItem value="price-desc">Giá giảm dần</SelectItem>
								<SelectItem value="rating">Đánh giá cao nhất</SelectItem>
								<SelectItem value="discount">Giảm giá nhiều nhất</SelectItem>
							</SelectContent>
						</Select>

						{/* Mobile Filter Button */}
						<Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
							<SheetTrigger asChild>
								<Button variant="outline" className="md:hidden">
									<SlidersHorizontal className="h-4 w-4 mr-2" />
									Bộ lọc
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="overflow-y-auto">
								<SheetHeader>
									<SheetTitle>Bộ lọc nâng cao</SheetTitle>
								</SheetHeader>
								<div className="mt-6">
									<FilterContent />
									<Button
										onClick={clearFilters}
										variant="outline"
										className="w-full mt-6"
									>
										<X className="h-4 w-4 mr-2" />
										Xóa bộ lọc
									</Button>
								</div>
							</SheetContent>
						</Sheet>
					</div>

					{/* Active Filters */}
					{(selectedCategories.length > 0 ||
						selectedBrands.length > 0 ||
						minRating !== "0") && (
						<div className="flex flex-wrap gap-2 mb-4">
							{selectedCategories.map((cat) => (
								<Badge key={cat} variant="secondary" className="gap-1">
									{cat}
									<X
										className="h-3 w-3 cursor-pointer"
										onClick={() => toggleCategory(cat)}
									/>
								</Badge>
							))}
							{selectedBrands.map((brand) => (
								<Badge key={brand} variant="secondary" className="gap-1">
									{brand}
									<X
										className="h-3 w-3 cursor-pointer"
										onClick={() => toggleBrand(brand)}
									/>
								</Badge>
							))}
							{minRating !== "0" && (
								<Badge variant="secondary" className="gap-1">
									Từ {minRating} sao
									<X
										className="h-3 w-3 cursor-pointer"
										onClick={() => setMinRating("0")}
									/>
								</Badge>
							)}
							<Button
								variant="ghost"
								size="sm"
								onClick={clearFilters}
								className="h-6 text-xs"
							>
								Xóa tất cả
							</Button>
						</div>
					)}

					<div className="flex gap-6">
						{/* Desktop Sidebar Filters */}
						<aside className="hidden md:block w-64 flex-shrink-0">
							<Card>
								<CardContent className="p-4">
									<div className="flex justify-between items-center mb-4">
										<h2 className="text-xl font-bold">Bộ lọc</h2>
										<Button
											variant="ghost"
											size="sm"
											onClick={clearFilters}
											className="h-8 text-xs"
										>
											<X className="h-4 w-4 mr-1" />
											Xóa
										</Button>
									</div>
									<FilterContent />
								</CardContent>
							</Card>
						</aside>

						{/* Products Grid */}
						<div className="flex-1">
							<div className="mb-4 text-sm text-muted-foreground">
								Tìm thấy {data.length} sản phẩm
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
								{data.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</div>

							{data.length === 0 && (
								<div className="text-center py-12">
									<p className="text-muted-foreground text-lg">
										Không tìm thấy sản phẩm phù hợp
									</p>
									<Button
										onClick={clearFilters}
										variant="outline"
										className="mt-4"
									>
										Xóa bộ lọc
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default SearchProducts;
