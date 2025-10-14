import { Facebook, Mail, MessageCircle, Phone, Youtube } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-foreground text-background py-12">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-3 gap-8 mb-8">
					{/* Company Info */}
					<div className="space-y-4">
						<h3 className="text-2xl font-bold">
							<span className="text-primary">F5</span>Tech
						</h3>
						<p className="text-background/80">
							Hệ thống bán lẻ điện thoại và phụ kiện công nghệ hàng đầu Việt Nam
						</p>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Phone size={18} />
								<span>Hotline: 1900 1234</span>
							</div>
							<div className="flex items-center gap-2">
								<Mail size={18} />
								<span>Email: support@f5tech.vn</span>
							</div>
						</div>
					</div>

					{/* Policies */}
					<div className="space-y-4">
						<h4 className="text-xl font-bold">Chính sách</h4>
						<ul className="space-y-2 text-background/80">
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
					<div className="space-y-4">
						<h4 className="text-xl font-bold">Kết nối với chúng tôi</h4>
						<div className="flex gap-4">
							<a
								href="/"
								className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
							>
								<Facebook size={20} />
							</a>
							<a
								href="/"
								className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
							>
								<Youtube size={20} />
							</a>
							<a
								href="/"
								className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
							>
								<MessageCircle size={20} />
							</a>
						</div>
						<p className="text-background/80 text-sm">
							Theo dõi chúng tôi để cập nhật tin tức và khuyến mãi mới nhất
						</p>
					</div>
				</div>

				<div className="border-t border-background/20 pt-8 text-center text-background/60 text-sm">
					<p>© 2025 F5Tech. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
