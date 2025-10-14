import { Link } from "@tanstack/react-router";
import { ChevronRight, Keyboard, Menu, Smartphone, Tablet } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categories = [
	{
		id: "phone",
		icon: Smartphone,
		label: "Điện thoại",
		brands: [
			{ name: "Apple", logo: "🍎" },
			{ name: "Samsung", logo: "📱" },
			{ name: "Xiaomi", logo: "📱" },
			{ name: "OPPO", logo: "📱" },
			{ name: "TECNO", logo: "📱" },
			{ name: "HONOR", logo: "📱" },
			{ name: "ZTE", logo: "📱" },
			{ name: "nubia", logo: "📱" },
			{ name: "SONY", logo: "📱" },
			{ name: "NOKIA", logo: "📱" },
			{ name: "Infinix", logo: "📱" },
			{ name: "realme", logo: "📱" },
			{ name: "itel", logo: "📱" },
			{ name: "vivo", logo: "📱" },
		],
		hotProducts: [
			{ name: "iPhone 17", hot: true },
			{ name: "iPhone Air", hot: true },
			{ name: "iPhone 16" },
			{ name: "Galaxy Z Fold7", hot: true },
			{ name: "S25 Ultra" },
			{ name: "OPPO Reno14" },
			{ name: "Xiaomi 15T" },
			{ name: "OPPO Find N5" },
		],
		tablets: [
			{ name: "iPad", logo: "🍎" },
			{ name: "Samsung", logo: "📱" },
			{ name: "Xiaomi", logo: "📱" },
			{ name: "HONOR", logo: "📱" },
			{ name: "nubia", logo: "📱" },
			{ name: "Máy đọc sách" },
			{ name: "Kindle" },
			{ name: "Boox" },
			{ name: "Xem thêm tất cả Tablet" },
		],
		hotTablets: [
			{ name: "iPad Air M3" },
			{ name: "iPad A16" },
			{ name: "iPad Pro 2024" },
			{ name: "iPad mini 7" },
			{ name: "Galaxy Tab S11 Series", hot: true },
			{ name: "Galaxy Tab S10 Series" },
			{ name: "Lenovo Idea Tab Wifi" },
			{ name: "Xiaomi Pad Mini", hot: true },
			{ name: "Huawei MatePad Pro 2025" },
			{ name: "HONOR Pad X7", hot: true },
			{ name: "Teclast Wifi P30" },
		],
		priceRanges: [
			"Dưới 2 triệu",
			"Từ 2 - 4 triệu",
			"Từ 4 - 7 triệu",
			"Từ 7 - 13 triệu",
			"Từ 13 - 20 triệu",
			"Trên 20 triệu",
		],
	},
	{
		id: "tablet",
		icon: Tablet,
		label: "Máy tính bảng",
		brands: [
			{ name: "Apple", logo: "🍎" },
			{ name: "Samsung", logo: "📱" },
			{ name: "Xiaomi", logo: "📱" },
		],
		hotProducts: [
			{ name: "iPad Air M3" },
			{ name: "iPad A16" },
			{ name: "iPad Pro 2024" },
			{ name: "iPad mini 7" },
			{ name: "Galaxy Tab S11 Series", hot: true },
		],
		priceRanges: [
			"Dưới 2 triệu",
			"Từ 2 - 4 triệu",
			"Từ 4 - 7 triệu",
			"Từ 7 - 13 triệu",
			"Từ 13 - 20 triệu",
			"Trên 20 triệu",
		],
	},
	{
		id: "accessory",
		icon: Keyboard,
		label: "Phụ kiện",
		brands: [
			{ name: "Sạc dự phòng", logo: "🔌" },
			{ name: "Cáp sạc", logo: "🔌" },
			{ name: "Ốp lưng", logo: "📱" },
			{ name: "Bàn phím", logo: "⌨️" },
			{ name: "Chuột", logo: "🖱️" },
		],
	},
];

const MegaMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState(categories[0]);

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
							{activeCategory.id === "phone" && (
								<div className="space-y-6">
									{/* Phone Brands */}
									<div>
										<h3 className="font-bold text-lg mb-4">Hãng điện thoại</h3>
										<div className="grid grid-cols-6 gap-3">
											{activeCategory.brands?.map((brand, idx) => (
												<Link
													key={idx}
													to="/search"
													search={{ brand: brand.name }}
													className="flex items-center justify-center gap-2 px-3 py-2 border rounded-lg hover:border-primary hover:text-primary transition-all"
												>
													<span className="font-medium text-sm">
														{brand.name}
													</span>
												</Link>
											))}
										</div>
									</div>

									{/* Hot Phones */}
									<div>
										<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
											Điện thoại HOT
											<span className="text-yellow-500">⚡</span>
										</h3>
										<div className="grid grid-cols-4 gap-3">
											{activeCategory.hotProducts?.map((product, idx) => (
												<Link
													key={idx}
													to="/search"
													search={{ product: product.name }}
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

									{/* Tablets */}
									<div>
										<h3 className="font-bold text-lg mb-4">
											Hãng máy tính bảng
										</h3>
										<div className="grid grid-cols-6 gap-3">
											{activeCategory.tablets
												?.slice(0, 9)
												.map((tablet, idx) => (
													<Link
														key={idx}
														to="/search"
														search={{ category: "tablet" }}
														className="px-3 py-2 border rounded-lg hover:border-primary transition-all text-center"
													>
														<span className="text-sm">{tablet.name}</span>
													</Link>
												))}
										</div>
									</div>

									{/* Hot Tablets */}
									<div>
										<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
											Máy tính bảng HOT
											<span className="text-yellow-500">⚡</span>
										</h3>
										<div className="grid grid-cols-4 gap-3">
											{activeCategory.hotTablets
												?.slice(0, 8)
												.map((tablet, idx) => (
													<Link
														key={idx}
														to="/search"
														search={{ product: tablet.name }}
														className="px-3 py-2 border rounded-lg hover:border-primary transition-all text-center relative"
													>
														{tablet.hot && (
															<Badge className="absolute -top-2 -right-2 bg-primary text-xs">
																HOT
															</Badge>
														)}
														<span className="text-sm">{tablet.name}</span>
													</Link>
												))}
										</div>
									</div>

									{/* Price Ranges */}
									<div>
										<h3 className="font-bold text-lg mb-4">
											Mức giá điện thoại
										</h3>
										<div className="flex flex-wrap gap-3">
											{activeCategory.priceRanges?.map((range, idx) => (
												<Link
													key={idx}
													to="/search"
													search={{ price: range }}
													className="px-4 py-2 border rounded-full hover:border-primary hover:bg-primary hover:text-white transition-all"
												>
													<span className="text-sm font-medium">{range}</span>
												</Link>
											))}
										</div>
									</div>
								</div>
							)}

							{activeCategory.brands && activeCategory.id !== "phone" && (
								<div className="space-y-6">
									<div>
										<h3 className="font-bold text-lg mb-4">Thương hiệu</h3>
										<div className="grid grid-cols-4 gap-3">
											{activeCategory.brands.map((brand, idx) => (
												<Link
													key={idx}
													to="/search"
													search={{ brand: brand.name }}
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
													{activeCategory.hotProducts.map((product, _idx) => (
														<Link
															key={product.name}
															to="/search"
															search={{ product: product.name }}
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

							{!activeCategory.brands && (
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
