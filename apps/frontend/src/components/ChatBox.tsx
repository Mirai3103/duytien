import { MessageCircle, Minus, Send, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ChatBox = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([
		{
			id: 1,
			text: "Xin chào! F5Tech rất vui được hỗ trợ bạn.",
			sender: "bot",
			time: new Date().toLocaleTimeString("vi-VN", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		},
	]);

	const handleSend = () => {
		if (message.trim()) {
			const newMessage = {
				id: messages.length + 1,
				text: message,
				sender: "user",
				time: new Date().toLocaleTimeString("vi-VN", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			};
			setMessages([...messages, newMessage]);
			setMessage("");

			// Auto reply sau 1s
			setTimeout(() => {
				const autoReply = {
					id: messages.length + 2,
					text: "Cảm ơn bạn đã liên hệ! Nhân viên tư vấn sẽ phản hồi trong giây lát.",
					sender: "bot",
					time: new Date().toLocaleTimeString("vi-VN", {
						hour: "2-digit",
						minute: "2-digit",
					}),
				};
				setMessages((prev) => [...prev, autoReply]);
			}, 1000);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<>
			{/* Floating Chat Button */}
			{!isOpen && (
				<div className="fixed bottom-6 right-6 z-50">
					<Button
						onClick={() => setIsOpen(true)}
						className="h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform relative"
						size="icon"
					>
						<MessageCircle size={28} />
						<Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center">
							1
						</Badge>
					</Button>
				</div>
			)}

			{/* Chat Window */}
			{isOpen && (
				<Card className="fixed bottom-6 right-6 z-50 w-96 shadow-2xl overflow-hidden">
					{/* Header */}
					<div className="bg-primary text-primary-foreground p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Avatar className="h-10 w-10">
									<AvatarImage src="https://ui-avatars.com/api/?name=F5Tech&background=D70018&color=fff" />
									<AvatarFallback>F5</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="font-bold">F5Tech Shop</h3>
									<div className="flex items-center gap-1">
										<div className="h-2 w-2 bg-green-400 rounded-full"></div>
										<span className="text-xs opacity-90">Đang hoạt động</span>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-primary-foreground hover:bg-primary-dark"
									onClick={() => setIsMinimized(!isMinimized)}
								>
									<Minus size={18} />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-primary-foreground hover:bg-primary-dark"
									onClick={() => setIsOpen(false)}
								>
									<X size={18} />
								</Button>
							</div>
						</div>
					</div>

					{!isMinimized && (
						<>
							{/* Welcome Message */}
							<div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b">
								<p className="text-sm text-gray-600 text-center">
									Bắt đầu trò chuyện nhanh với F5Tech Shop.
								</p>
								<p className="text-xs text-gray-500 text-center mt-1">
									Thông tin của bạn được ẩn và tin nhắn trò chuyện chỉ lưu trên
									trình duyệt web.
								</p>
							</div>

							{/* Messages */}
							<div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
								{messages.map((msg) => (
									<div
										key={msg.id}
										className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
									>
										<div
											className={`max-w-[75%] ${
												msg.sender === "user"
													? "bg-primary text-primary-foreground"
													: "bg-white border"
											} rounded-2xl px-4 py-2 shadow-sm`}
										>
											<p className="text-sm">{msg.text}</p>
											<span className="text-xs opacity-70 mt-1 block">
												{msg.time}
											</span>
										</div>
									</div>
								))}
							</div>

							{/* Input */}
							<div className="p-4 bg-white border-t flex items-center gap-2">
								<Input
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder="Nhập tin nhắn, nhấn Enter để gửi..."
									className="flex-1"
								/>
								<Button
									size="icon"
									onClick={handleSend}
									disabled={!message.trim()}
									className="h-10 w-10"
								>
									<Send size={18} />
								</Button>
							</div>

							{/* Footer */}
						</>
					)}

					{isMinimized && (
						<div className="p-4 bg-gray-50">
							<p className="text-sm text-gray-600 text-center">
								Chat đã được thu gọn
							</p>
						</div>
					)}
				</Card>
			)}
		</>
	);
};

export default ChatBox;
