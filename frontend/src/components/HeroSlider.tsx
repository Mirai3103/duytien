import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
	{
		image:
			"https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/D_Theme_15_T_Content_ea4cceb5da.png",
		alt: "Banner khuyến mãi 1",
	},
	{
		image:
			"https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/desk_header_34a59b165d.png",
		alt: "Banner khuyến mãi 2",
	},
];

const HeroSlider = () => {
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
	const prevSlide = () =>
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

	return (
		<div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] mt-2 md:mt-5 overflow-hidden bg-background">
			{slides.map((slide, index) => (
				<div
					key={slide.image}
					className={`absolute inset-0 transition-opacity duration-500 ${
						index === currentSlide ? "opacity-100" : "opacity-0"
					}`}
				>
					<img
						src={slide.image}
						alt={slide.alt}
						className="w-[95%] md:w-[90%] mx-auto h-full object-cover"
					/>
				</div>
			))}

			{/* Navigation Buttons */}
			<Button
				variant="ghost"
				size="icon"
				className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background h-8 w-8 md:h-10 md:w-10"
				onClick={prevSlide}
			>
				<ChevronLeft size={16} className="md:size-6" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background h-8 w-8 md:h-10 md:w-10"
				onClick={nextSlide}
			>
				<ChevronRight size={16} className="md:size-6" />
			</Button>

			{/* Indicators */}
			<div className="absolute bottom-2 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
				{slides.map((s, index) => (
					<button
						type="button"
						key={s.image}
						onClick={() => setCurrentSlide(index)}
						className={cn(
							`h-1.5 md:h-2 rounded-full transition-all ${
								index === currentSlide ? "w-6 md:w-8 bg-primary" : "w-1.5 md:w-2 bg-primary/30"
							}`,
						)}
					></button>
				))}
			</div>
		</div>
	);
};

export default HeroSlider;
