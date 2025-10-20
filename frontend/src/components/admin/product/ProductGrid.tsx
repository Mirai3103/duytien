import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RippleButton } from "../../ui/shadcn-io/ripple-button";

const products = [
	{
		id: 1,
		name: "MacBook Pro M3 14 inch",
		price: 45990000,
		rating: 4.8,
		image:
			"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
	},
	{
		id: 2,
		name: "iPad Pro M2 11 inch",
		price: 22990000,
		rating: 4.9,
		image:
			"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop",
	},
	{
		id: 3,
		name: "AirPods Pro Gen 2",
		price: 6290000,
		rating: 4.7,
		image:
			"https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300&h=300&fit=crop",
	},
	{
		id: 4,
		name: "Apple Watch Series 9",
		price: 10990000,
		rating: 4.8,
		image:
			"https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=300&fit=crop",
	},
	{
		id: 5,
		name: "Sony WH-1000XM5",
		price: 8990000,
		rating: 4.9,
		image:
			"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop",
	},
	{
		id: 6,
		name: "Samsung Galaxy Buds2 Pro",
		price: 3990000,
		rating: 4.6,
		image:
			"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
	},
	{
		id: 7,
		name: "Logitech MX Master 3S",
		price: 2590000,
		rating: 4.8,
		image:
			"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
	},
	{
		id: 8,
		name: "Keychron K8 Pro",
		price: 3290000,
		rating: 4.7,
		image:
			"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop",
	},
];

const ProductGrid = () => {
	return (
		<section className="container mx-auto px-4 py-12">
			<h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{products.map((product) => (
					<Card
						key={product.id}
						className="hover-lift cursor-pointer overflow-hidden"
					>
						<img
							src={product.image}
							alt={product.name}
							className="w-full h-48 object-cover"
						/>
						<div className="p-4 space-y-3">
							<h3 className="font-semibold text-sm line-clamp-2 h-10">
								{product.name}
							</h3>
							<div className="flex items-center gap-1">
								<Star size={16} className="fill-yellow-400 text-yellow-400" />
								<span className="text-sm font-medium">{product.rating}</span>
							</div>
							<p className="text-lg font-bold text-primary">
								{product.price.toLocaleString("vi-VN")}đ
							</p>
							<div className="flex gap-2">
								<RippleButton size="sm" className="flex-1">
									Mua ngay
								</RippleButton>
								<RippleButton size="sm" variant="outline" className="flex-1">
									Chi tiết
								</RippleButton>
							</div>
						</div>
					</Card>
				))}
			</div>
		</section>
	);
};

export default ProductGrid;
