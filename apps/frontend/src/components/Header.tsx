import { useNavigate } from "@tanstack/react-router";
import { Search, ShoppingCart, User } from "lucide-react";
import MegaMenu from "@/components/MegaMenu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
	const navigate = useNavigate();
	const handleSearch = (value: string) => {
		navigate({ to: "/search", params: { query: value } });
	};
	return (
		<header className="bg-primary shadow-md sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between gap-4">
					{/* Logo */}
					<div className="flex items-center gap-4">
						<div
							className="cursor-pointer mr-3"
							onClick={() => navigate({ to: "/" })}
						>
							<h1 className="text-2xl font-bold text-white">
								<span className="text-white">F5</span>
								<span className="text-yellow-300">Tech</span>
							</h1>
						</div>
						<MegaMenu />
					</div>

					{/* Search Bar */}
					<div className="flex-1 max-w-2xl">
						<div className="relative">
							<Search
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={20}
							/>
							<Input
								type="text"
								placeholder="Bạn muốn mua gì hôm nay?"
								className="pl-10 pr-4 w-full bg-white border-none focus-visible:ring-white focus-visible:ring-offset-0"
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</div>
					</div>

					{/* Icons */}
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							className="relative  text-white hover:bg-primary-dark hover:text-white gap-2"
						>
							<User size={24} />
							<span className="font-medium">Đăng nhập</span>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="relative text-white hover:bg-primary-dark hover:text-white"
						>
							<ShoppingCart size={24} />
							<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-yellow-400 text-gray-900 border-none">
								0
							</Badge>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
