import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { RippleButton } from "./ui/shadcn-io/ripple-button";
import { getFinalPrice } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
}

interface CategoryProductSectionProps {
  title: string;
  categoryId: number;
  bgColor?: string;
}

const CategoryProductSection = ({
  title,
  categoryId,
  bgColor = "bg-white",
}: CategoryProductSectionProps) => {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.products.getFeaturedProducts.queryOptions({
      categoryId,
      limit: 5,
      offset: 0,
    })
  );
  const navigate = useNavigate({ from: "/" });
  return (
    <section className={`${bgColor} py-6 md:py-12`}>
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold">{title}</h2>
          <Link
            to="/search"
            search={{ categoryId: [categoryId] }}
            className="flex items-center gap-1 md:gap-2 text-primary font-semibold text-sm md:text-base hover:gap-2 md:hover:gap-3 transition-all group"
          >
            Xem thêm
            <ChevronRight
              size={16}
              className="md:size-5 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
          {data?.map((product) => (
            <Card
              key={product.id}
              className="hover-lift cursor-pointer overflow-hidden"
              onClick={() => {
                navigate({
                  to: "/product/$id",
                  params: { id: product.id.toString() as string },
                  search: { isSpu: true },
                });
              }}
            >
              <img
                src={product.thumbnail ?? "/images/placeholder.png"}
                alt={product.name}
                className="w-full h-32 sm:h-40 md:h-56 object-contain mx-auto"
              />
              <div className="p-2 md:p-4 space-y-0.5 md:space-y-1">
                <h3 className="font-semibold text-xs md:text-sm line-clamp-2 h-8 md:h-10">
                  {product.name}
                </h3>

                <p className="text-[10px] md:text-xs text-muted-foreground line-through min-h-3 md:min-h-4">
                  {product.discount &&
                    ` ${Number(product.price).toLocaleString("vi-VN")}đ`}
                </p>
                <p className="text-sm md:text-lg font-bold text-primary">
                  {getFinalPrice(
                    Number(product.price),
                    Number(product.discount)
                  ).toLocaleString("vi-VN")}
                  đ
                </p>
                <RippleButton
                  size="sm"
                  className="w-full text-xs md:text-sm h-7 md:h-9"
                  onClick={() => {
                    navigate({
                      to: "/product/$id",
                      params: { id: product.id.toString() as string },
                      search: { isSpu: true },
                    });
                  }}
                >
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

export default CategoryProductSection;
