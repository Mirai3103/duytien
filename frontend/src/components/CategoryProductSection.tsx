import { Star, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
}

interface CategoryProductSectionProps {
  title: string;
  categorySlug: string;
  products: Product[];
  bgColor?: string;
}

const CategoryProductSection = ({ 
  title, 
  categorySlug, 
  products, 
  bgColor = "bg-white" 
}: CategoryProductSectionProps) => {
  return (
    <section className={`${bgColor} py-12`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          <Link
            to="/search"
            search={{ category: categorySlug }}
            className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
          >
            Xem thêm
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="hover-lift cursor-pointer overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-sm line-clamp-2 h-10">{product.name}</h3>
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <p className="text-lg font-bold text-primary">
                  {product.price.toLocaleString("vi-VN")}đ
                </p>
                <Button size="sm" className="w-full">
                  Mua ngay
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryProductSection;

