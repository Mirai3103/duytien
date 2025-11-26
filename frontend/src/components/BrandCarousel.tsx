import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

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
    <section className="bg-secondary py-6 md:py-12">
      <div className="container mx-auto px-2 md:px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8">
          Thương hiệu nổi bật
        </h2>
        <div className="overflow-hidden">
          <div className="flex gap-3 md:gap-6 lg:gap-12 items-center justify-center flex-wrap">
            {brands?.map((brand, index) => (
              <Link
                to="/search"
                search={{
                  brandId: [brand.id.toString()],
                }}
                key={index}
                className="flex items-center justify-center h-12 md:h-16 px-4 md:px-8 bg-background rounded-lg shadow-md hover-lift cursor-pointer"
              >
                <span className="text-sm md:text-xl font-bold text-foreground">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
