import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

const ProductGrid = () => {
  const trpc = useTRPC();
  const { data: products } = useQuery(
    trpc.products.getFeaturedProducts.queryOptions({
      limit: 8,
      offset: 0,
    })
  );
  const navigate = useNavigate({ from: "/" });
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
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
              className="w-full h-56 object-contain mx-auto"
            />
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-sm line-clamp-2 h-10">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-primary">
                {Number(product.price).toLocaleString("vi-VN")}đ
              </p>
              <div className="flex gap-2">
                <RippleButton
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    navigate({
                      to: "/product/$id",
                      params: {
                        id: product.id.toString() as string,
                      },
                      search: {
                        isSpu: true,
                      },
                    });
                  }}
                >
                  Mua ngay
                </RippleButton>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
