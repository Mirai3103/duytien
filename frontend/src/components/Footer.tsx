import { Facebook, Mail, MessageCircle, Phone, Youtube } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-foreground text-background py-6 md:py-12">
			<div className="container mx-auto px-2 md:px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
					{/* Company Info */}
					<div className="space-y-3 md:space-y-4">
						<h3 className="text-xl md:text-2xl font-bold">
							<span className="text-primary">F5</span>Tech
						</h3>
						<p className="text-background/80 text-sm md:text-base">
							Hệ thống bán lẻ điện thoại và phụ kiện công nghệ hàng đầu Việt Nam
						</p>
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm md:text-base">
								<Phone size={16} className="md:size-[18px]" />
								<span>Hotline: 1900 1234</span>
							</div>
							<div className="flex items-center gap-2 text-sm md:text-base">
								<Mail size={16} className="md:size-[18px]" />
								<span>Email: support@f5tech.vn</span>
							</div>
						</div>
					</div>

					{/* Policies */}
					<div className="space-y-3 md:space-y-4">
						<h4 className="text-lg md:text-xl font-bold">Chính sách</h4>
						<ul className="space-y-2 text-background/80 text-sm md:text-base">
							<li>
								<a href="/" className="hover:text-primary transition-colors">
									Chính sách bảo hành
								</a>
							</li>
							<li>
								<a href="/" className="hover:text-primary transition-colors">
									Chính sách đổi trả
								</a>
							</li>
							<li>
								<a href="/" className="hover:text-primary transition-colors">
									Chính sách thanh toán
								</a>
							</li>
							<li>
								<a href="/" className="hover:text-primary transition-colors">
									Chính sách giao hàng
								</a>
							</li>
							<li>
								<a href="/" className="hover:text-primary transition-colors">
									Chính sách bảo mật
								</a>
							</li>
						</ul>
					</div>

					{/* Social Media */}
					<div className="space-y-3 md:space-y-4">
						<h4 className="text-lg md:text-xl font-bold">Kết nối với chúng tôi</h4>
						<div className="flex gap-3 md:gap-4">
							<a
								href="/"
								className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
							>
								<Facebook size={18} className="md:size-5" />
							</a>
							<a
								href="/"
								className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
							>
								<Youtube size={18} className="md:size-5" />
							</a>
							<a
								href="/"
								className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
							>
								<MessageCircle size={18} className="md:size-5" />
							</a>
						</div>
						<p className="text-background/80 text-xs md:text-sm">
							Theo dõi chúng tôi để cập nhật tin tức và khuyến mãi mới nhất
						</p>
					</div>
				</div>

				<div className="border-t border-background/20 pt-4 md:pt-8 text-center text-background/60 text-xs md:text-sm">
					<p>© 2025 F5Tech. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
