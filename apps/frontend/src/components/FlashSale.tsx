import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RippleButton } from "./ui/shadcn-io/ripple-button";

const flashProducts = [
	{
		id: 1,
		name: "iPhone 15 Pro Max 256GB",
		originalPrice: 34990000,
		salePrice: 29990000,
		discount: 14,
		image:
			"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop",
	},
	{
		id: 2,
		name: "Samsung Galaxy S24 Ultra",
		originalPrice: 29990000,
		salePrice: 24990000,
		discount: 17,
		image:
			"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop",
	},
	{
		id: 3,
		name: "Xiaomi 14 Ultra",
		originalPrice: 25990000,
		salePrice: 19990000,
		discount: 23,
		image:
			"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop",
	},
	{
		id: 4,
		name: "OPPO Find X7 Pro",
		originalPrice: 22990000,
		salePrice: 17990000,
		discount: 22,
		image:
			"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
	},
	{
		id: 5,
		name: "Realme GT 5 Pro",
		originalPrice: 14990000,
		salePrice: 10990000,
		discount: 27,
		image:
			"https://images.unsplash.com/photo-1592286927505-b6e1b04e0c7e?w=300&h=300&fit=crop",
	},
];

const FlashSale = () => {
	const [timeLeft, setTimeLeft] = useState({
		hours: 2,
		minutes: 30,
		seconds: 0,
	});

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev.seconds > 0) {
					return { ...prev, seconds: prev.seconds - 1 };
				} else if (prev.minutes > 0) {
					return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
				} else if (prev.hours > 0) {
					return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
				}
				return prev;
			});
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const formatTime = (num: number) => String(num).padStart(2, "0");

	return (
		<section className="bg-flash-sale-bg py-12">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<h2 className="text-3xl font-bold text-primary">FLASH SALE</h2>
						<div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
							<Clock size={20} className="pulse-sale" />
							<span className="font-bold">
								{formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:
								{formatTime(timeLeft.seconds)}
							</span>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{flashProducts.map((product) => (
						<Card
							key={product.id}
							className="hover-lift cursor-pointer overflow-hidden"
						>
							<div className="relative">
								<img
									src={product.image}
									alt={product.name}
									className="w-full h-48 object-cover"
								/>
								<Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
									-{product.discount}%
								</Badge>
							</div>
							<div className="p-4 space-y-2">
								<h3 className="font-semibold text-sm line-clamp-2 h-10">
									{product.name}
								</h3>
								<div className="space-y-1">
									<p className="text-xs text-muted-foreground line-through">
										{product.originalPrice.toLocaleString("vi-VN")}đ
									</p>
									<p className="text-lg font-bold text-primary">
										{product.salePrice.toLocaleString("vi-VN")}đ
									</p>
								</div>
								<RippleButton size="sm" className="w-full">
									Mua ngay
								</RippleButton>
							</div>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default FlashSale;
