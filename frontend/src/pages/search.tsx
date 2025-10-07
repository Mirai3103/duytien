import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Mock data
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    price: 29990000,
    oldPrice: 34990000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
    rating: 4.8,
    reviews: 1250,
    category: "Điện thoại",
    brand: "Apple",
    discount: 14,
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra 512GB",
    price: 33990000,
    oldPrice: 36990000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/2/s24-ultra-xam-222.png",
    rating: 4.7,
    reviews: 890,
    category: "Điện thoại",
    brand: "Samsung",
    discount: 8,
  },
  {
    id: 3,
    name: "Xiaomi 14 Ultra 16GB/512GB",
    price: 24990000,
    oldPrice: 27990000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra.png",
    rating: 4.6,
    reviews: 567,
    category: "Điện thoại",
    brand: "Xiaomi",
    discount: 11,
  },
  {
    id: 4,
    name: "MacBook Air M3 13 inch 8GB/256GB",
    price: 27990000,
    oldPrice: 29990000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m3-2024.png",
    rating: 4.9,
    reviews: 2100,
    category: "Laptop",
    brand: "Apple",
    discount: 7,
  },
  {
    id: 5,
    name: "AirPods Pro 2 USB-C",
    price: 5990000,
    oldPrice: 6990000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-pro-2-usbc.png",
    rating: 4.8,
    reviews: 1890,
    category: "Tai nghe",
    brand: "Apple",
    discount: 14,
  },
  {
    id: 6,
    name: "Samsung Galaxy Watch 6 Classic",
    price: 7990000,
    oldPrice: 9990000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/w/a/watch-6-classic.png",
    rating: 4.5,
    reviews: 456,
    category: "Đồng hồ",
    brand: "Samsung",
    discount: 20,
  },
  {
    id: 7,
    name: "OPPO Find X7 Ultra 16GB/512GB",
    price: 25990000,
    oldPrice: 28990000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-x7-ultra.png",
    rating: 4.6,
    reviews: 345,
    category: "Điện thoại",
    brand: "Oppo",
    discount: 10,
  },
  {
    id: 8,
    name: "JBL Tune Flex True Wireless",
    price: 1490000,
    oldPrice: 1990000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/j/b/jbl-tune-flex.png",
    rating: 4.4,
    reviews: 678,
    category: "Tai nghe",
    brand: "JBL",
    discount: 25,
  },
];

const categories = ["Điện thoại", "Laptop", "Tai nghe", "Phụ kiện", "Đồng hồ"];
const brands = ["Apple", "Samsung", "Xiaomi", "Oppo", "JBL", "Baseus"];

const SearchProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [minRating, setMinRating] = useState<string>("0");
  const [sortBy, setSortBy] = useState("default");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 50000000]);
    setMinRating("0");
    setSearchQuery("");
  };

  const filteredProducts = products
    .filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.rating < parseFloat(minRating)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "discount") return b.discount - a.discount;
      return 0;
    });

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Danh mục</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
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
          {brands.map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
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
            {["4.5", "4", "3.5", "3", "0"].map(rating => (
              <div key={rating} className="flex items-center space-x-2">
                <RadioGroupItem value={rating} id={`rating-${rating}`} />
                <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer">
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
                  <Button onClick={clearFilters} variant="outline" className="w-full mt-6">
                    <X className="h-4 w-4 mr-2" />
                    Xóa bộ lọc
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 || selectedBrands.length > 0 || minRating !== "0") && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map(cat => (
                <Badge key={cat} variant="secondary" className="gap-1">
                  {cat}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleCategory(cat)}
                  />
                </Badge>
              ))}
              {selectedBrands.map(brand => (
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
                Tìm thấy {filteredProducts.length} sản phẩm
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <Card
                    key={product.id}
                    className="group hover:shadow-lg transition-all duration-300 hover:border-primary cursor-pointer"
                  >
                    <CardContent className="p-3">
                      <div className="relative mb-3">
                        {product.discount > 0 && (
                          <Badge className="absolute top-0 left-0 z-10 bg-primary">
                            -{product.discount}%
                          </Badge>
                        )}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-medium text-sm mb-2 line-clamp-2 min-h-[40px]">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-lg font-bold text-primary">
                          {product.price.toLocaleString("vi-VN")}đ
                        </div>
                        {product.oldPrice && (
                          <div className="text-xs text-muted-foreground line-through">
                            {product.oldPrice.toLocaleString("vi-VN")}đ
                          </div>
                        )}
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Mua ngay
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Không tìm thấy sản phẩm phù hợp
                  </p>
                  <Button onClick={clearFilters} variant="outline" className="mt-4">
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
