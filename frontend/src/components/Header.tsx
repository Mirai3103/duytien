import { Search, ShoppingCart, Heart, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

const Header = () => {
  const navigate = useNavigate();
  const handleSearch = (value: string) => {
    navigate({ to: "/search", params: { query: value } });
  };
  return (
    <header className="bg-background shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center" onClick={() => navigate({ to: "/" })}>
            <h1 className="text-2xl font-bold">
              <span className="text-primary">F5</span>
              <span className="text-foreground">Tech</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Tìm điện thoại, laptop, phụ kiện..."
                className="pl-10 pr-4 w-full"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Heart size={24} />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <User size={24} />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart size={24} />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                0
              </Badge>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
