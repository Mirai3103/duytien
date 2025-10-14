import { createFileRoute } from "@tanstack/react-router";
import CategoryGrid from "@/components/admin/category/CategoryGrid";
import ProductGrid from "@/components/admin/product/ProductGrid";
import BannerAds from "@/components/BannerAds";
import BrandCarousel from "@/components/BrandCarousel";
import CategoryProductSection from "@/components/CategoryProductSection";
import FlashSale from "@/components/FlashSale";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import Navbar from "@/components/Navbar";
import NewsSection from "@/components/NewsSection";
import Topbar from "@/components/Topbar";
export const Route = createFileRoute("/_storefront/")({
	component: Index,
});

// Data for category sections
const _laptopProducts = [
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
		name: "Dell XPS 13 Plus",
		price: 32990000,
		rating: 4.7,
		image:
			"https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=300&fit=crop",
	},
	{
		id: 3,
		name: "Lenovo ThinkPad X1 Carbon",
		price: 38990000,
		rating: 4.6,
		image:
			"https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop",
	},
	{
		id: 4,
		name: "ASUS ROG Zephyrus G14",
		price: 42990000,
		rating: 4.9,
		image:
			"https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop",
	},
	{
		id: 5,
		name: "HP Spectre x360",
		price: 35990000,
		rating: 4.5,
		image:
			"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
	},
];

const phoneProducts = [
	{
		id: 1,
		name: "iPhone 15 Pro Max",
		price: 34990000,
		rating: 4.9,
		image:
			"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop",
	},
	{
		id: 2,
		name: "Samsung Galaxy S24 Ultra",
		price: 29990000,
		rating: 4.8,
		image:
			"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop",
	},
	{
		id: 3,
		name: "Xiaomi 14 Ultra",
		price: 25990000,
		rating: 4.7,
		image:
			"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop",
	},
	{
		id: 4,
		name: "Google Pixel 8 Pro",
		price: 24990000,
		rating: 4.6,
		image:
			"https://images.unsplash.com/photo-1598618589191-1817a5c29d59?w=300&h=300&fit=crop",
	},
	{
		id: 5,
		name: "OnePlus 12",
		price: 18990000,
		rating: 4.5,
		image:
			"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
	},
];

const _audioProducts = [
	{
		id: 1,
		name: "AirPods Pro Gen 2",
		price: 6290000,
		rating: 4.8,
		image:
			"https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300&h=300&fit=crop",
	},
	{
		id: 2,
		name: "Sony WH-1000XM5",
		price: 8990000,
		rating: 4.9,
		image:
			"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop",
	},
	{
		id: 3,
		name: "Samsung Galaxy Buds2 Pro",
		price: 3990000,
		rating: 4.6,
		image:
			"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
	},
	{
		id: 4,
		name: "Bose QuietComfort Ultra",
		price: 9990000,
		rating: 4.7,
		image:
			"https://images.unsplash.com/photo-1545127398-14699f92334b?w=300&h=300&fit=crop",
	},
	{
		id: 5,
		name: "JBL Live Pro 2",
		price: 3490000,
		rating: 4.4,
		image:
			"https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop",
	},
];

const _watchProducts = [
	{
		id: 1,
		name: "Apple Watch Series 9",
		price: 10990000,
		rating: 4.8,
		image:
			"https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=300&fit=crop",
	},
	{
		id: 2,
		name: "Samsung Galaxy Watch 6",
		price: 7990000,
		rating: 4.6,
		image:
			"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
	},
	{
		id: 3,
		name: "Garmin Fenix 7",
		price: 18990000,
		rating: 4.9,
		image:
			"https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&h=300&fit=crop",
	},
	{
		id: 4,
		name: "Xiaomi Watch S3",
		price: 4990000,
		rating: 4.5,
		image:
			"https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=300&h=300&fit=crop",
	},
	{
		id: 5,
		name: "Amazfit GTR 4",
		price: 5990000,
		rating: 4.4,
		image:
			"https://images.unsplash.com/photo-1587836374455-c91e0954689d?w=300&h=300&fit=crop",
	},
];

function Index() {
	return (
		<div className="min-h-screen">
			<Topbar />
			<Header />
			<Navbar />
			<HeroSlider />
			<CategoryGrid />
			<FlashSale />
			<ProductGrid />
			<BannerAds />

			<CategoryProductSection
				title="Điện Thoại Hot"
				categorySlug="dien-thoai"
				products={phoneProducts}
				bgColor="bg-secondary"
			/>

			<BrandCarousel />
			<NewsSection />
			<Footer />
		</div>
	);
}
