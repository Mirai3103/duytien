import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import type { AppRouter } from "../../../backend/dist-types/trpc";
import _ from "lodash";

const categories = ["Điện thoại", "Laptop", "Tai nghe", "Phụ kiện", "Đồng hồ"];
const brands = ["Apple", "Samsung", "Xiaomi", "Oppo", "JBL", "Baseus"];
type Product = Awaited<
  ReturnType<AppRouter["products"]["getProductsWithVariants"]>
>[number];
function ProductCard({ product }: { product: Product }) {
  const attrs = React.useMemo(()=>{
    function extractAttrs(product: Product) {
      const grouped = _.flatMap(product.variants, "variantValues");
      // grouped là mảng tất cả variantValues
      const groupedByAttr = _.groupBy(grouped, (vv) => vv.value.attribute.name);
      return _.map(groupedByAttr, (arr, attrName) => ({
        name: attrName,
        values: _.uniqBy(arr, (vv) => vv.value.value).map((vv) => ({
          value: vv.value.value,
          displayValue: vv.value.metadata?.displayValue ?? vv.value.value,
          code: vv.value.metadata?.code ?? null,
        })),
      }));
    }
    return extractAttrs(product);
  }, [product]);
  console.log(attrs);

  return (
    <Card
      key={product.id}
      className="group hover:shadow-lg transition-all duration-300 hover:border-primary cursor-pointer"
    >
      <CardContent className="p-3">
        <div className="relative mb-3">
          {Math.random() > 0.5 && (
            <Badge className="absolute top-0 left-0 z-10 bg-primary">
              -{Math.floor(Math.random() * 100)}%
            </Badge>
          )}
          <img
            src={product.thumbnail!}
            alt={product.name}
            className="w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="font-medium text-sm mb-2 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-500">★</span>
          <span className="text-xs font-medium">
            {Math.floor(Math.random() * 5)}
          </span>
          <span className="text-xs text-muted-foreground">
            ({Math.floor(Math.random() * 100)})
          </span>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-bold text-primary">
            {parseInt(product.variants[0].price).toLocaleString("vi-VN")}đ
          </div>
          {Math.random() > 0.5 && (
            <div className="text-xs text-muted-foreground line-through">
              {parseInt(product.variants[0].price).toLocaleString("vi-VN")}đ
            </div>
          )}
        </div>
        <Button size="sm" className="w-full mt-3">
          Mua ngay
        </Button>
      </CardContent>
    </Card>
  );
}
const SearchProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [minRating, setMinRating] = useState<string>("0");
  const [sortBy, setSortBy] = useState("default");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 50000000]);
    setMinRating("0");
    setSearchQuery("");
  };
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getProductsWithVariants.queryOptions({
      page: 1,
      limit: 10,
    })
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Danh mục</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label
                htmlFor={`cat-${category}`}
                className="text-sm cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Khoảng giá</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={50000000}
            step={1000000}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{(priceRange[0] / 1000000).toFixed(0)}tr</span>
            <span>{(priceRange[1] / 1000000).toFixed(0)}tr</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Thương hiệu</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Đánh giá</h3>
        <RadioGroup value={minRating} onValueChange={setMinRating}>
          <div className="space-y-2">
            {["4.5", "4", "3.5", "3", "0"].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <RadioGroupItem value={rating} id={`rating-${rating}`} />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="text-sm cursor-pointer"
                >
                  {rating === "0" ? "Tất cả" : `Từ ${rating} sao trở lên`}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Search & Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[240px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Mặc định</SelectItem>
                <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                <SelectItem value="discount">Giảm giá nhiều nhất</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Bộ lọc nâng cao</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full mt-6"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Xóa bộ lọc
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 ||
            selectedBrands.length > 0 ||
            minRating !== "0") && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map((cat) => (
                <Badge key={cat} variant="secondary" className="gap-1">
                  {cat}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleCategory(cat)}
                  />
                </Badge>
              ))}
              {selectedBrands.map((brand) => (
                <Badge key={brand} variant="secondary" className="gap-1">
                  {brand}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleBrand(brand)}
                  />
                </Badge>
              ))}
              {minRating !== "0" && (
                <Badge variant="secondary" className="gap-1">
                  Từ {minRating} sao
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setMinRating("0")}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 text-xs"
              >
                Xóa tất cả
              </Button>
            </div>
          )}

          <div className="flex gap-6">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Bộ lọc</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 text-xs"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                  <FilterContent />
                </CardContent>
              </Card>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-4 text-sm text-muted-foreground">
                Tìm thấy {data.length} sản phẩm
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {data.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Không tìm thấy sản phẩm phù hợp
                  </p>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="mt-4"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchProducts;
