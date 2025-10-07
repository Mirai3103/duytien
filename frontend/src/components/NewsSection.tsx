import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const news = [
  {
    id: 1,
    title: "iPhone 16 chính thức ra mắt với nhiều cải tiến đột phá",
    date: "10/10/2025",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Xiaomi 15 Series - Smartphone flagship mới nhất với chip Snapdragon 8 Gen 4",
    date: "09/10/2025",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Top 5 tai nghe gaming tốt nhất năm 2025 cho game thủ",
    date: "08/10/2025",
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=250&fit=crop",
  },
];

const NewsSection = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Tin mới nhất</h2>
        <Button variant="outline">Xem tất cả tin</Button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {news.map((item) => (
          <Card key={item.id} className="hover-lift cursor-pointer overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover transition-transform hover:scale-105"
            />
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>{item.date}</span>
              </div>
              <h3 className="font-semibold line-clamp-2">{item.title}</h3>
              <Button variant="link" className="p-0 h-auto">
                Đọc thêm →
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
