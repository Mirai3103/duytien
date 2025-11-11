import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RippleButton } from "./ui/shadcn-io/ripple-button";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { getDiscountPercentage, getFinalPrice } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";


const FlashSale = () => {
	const [timeLeft, setTimeLeft] = useState({
		hours: 2,
		minutes: 30,
		seconds: 0,
	});
	const api = useTRPC();

	const { data: flashProducts } = useQuery(api.products.getFlashSaleProducts.queryOptions({
		limit: 5,
		offset: 0,
	}));

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
	const navigate = useNavigate();
	const handleProductClick = (productId: number | string) => {
		navigate({
			to: "/product/$id",
			params: { id: productId.toString() as string },
			search: { isSpu: true },
		});
	};
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
					{flashProducts?.map((product) => (
						<Card
							key={product.id}
							className="hover-lift cursor-pointer overflow-hidden"
							onClick={() => handleProductClick(product.id)}
						>
							<div className="relative">
								<img
									src={product.thumbnail ?? "/images/placeholder.png"}
									alt={product.name}
									className="w-full h-48 object-contain"
								/>
								<Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
									-{getDiscountPercentage(Number(product.price),Number(product.discount))}%
								</Badge>
							</div>
							<div className="p-4 space-y-2">
								<h3 className="font-semibold text-sm line-clamp-2 h-10">
									{product.name}
								</h3>
								<div className="space-y-1">
									<p className="text-xs text-muted-foreground line-through">
										{Number(product.price).toLocaleString("vi-VN")}đ
									</p>
									<p className="text-lg font-bold text-primary">
										{getFinalPrice(Number(product.price),Number(product.discount)).toLocaleString("vi-VN")}đ
									</p>
								</div>
								<RippleButton size="sm" className="w-full" onClick={() => handleProductClick(product.id)}>
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
