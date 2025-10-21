import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";

const brands = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "OPPO",
  "Realme",
  "JBL",
  "Sony",
  "Baseus",
  "Anker",
  "Logitech",
];

const BrandCarousel = () => {
  const trpc = useTRPC();
  const { data: brands } = useQuery(trpc.brands.getFeatured.queryOptions());
  return (
    <section className="bg-secondary py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Thương hiệu nổi bật
        </h2>
        <div className="overflow-hidden">
          <div className="flex gap-12 items-center justify-center flex-wrap">
            {brands?.map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-16 px-8 bg-background rounded-lg shadow-md hover-lift cursor-pointer"
              >
                <span className="text-xl font-bold text-foreground">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
