import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  Package,
  Settings,
  User2,
  ShieldCheck,
  Menu,
} from "lucide-react";
import MegaMenu from "@/components/MegaMenu";
import StorefrontSidebar from "@/components/StorefrontSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RippleButton } from "./ui/shadcn-io/ripple-button";
import { useSession, signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleSearch = (value: string) => {
    console.log(value);
    navigate({ to: "/search", search: { keyword: value } });
  };
  const session = useSession();
  const isAuth = !!session.data?.user;
  const trpc = useTRPC();
  const countCartItems = useQuery(
    trpc.cart.countCartItems.queryOptions(undefined, {
      enabled: isAuth,
    })
  );
  const count = countCartItems.data ?? 0;
  const location = useLocation();
  const myProfile = useQuery(
    trpc.users.getMyProfile.queryOptions(undefined, {
      enabled: isAuth,
    })
  );
  useEffect(() => {
    // add enter key listener to search input
    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch(searchRef.current?.value ?? "");
      }
    };
    searchRef.current?.addEventListener("keydown", handleEnterKey);
    return () => {
      searchRef.current?.removeEventListener("keydown", handleEnterKey);
    };
  }, [handleSearch]);
  return (
    <>
      <StorefrontSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <header className="bg-primary shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-2 md:px-4 py-2 md:py-4">
          <div className="flex items-center justify-between gap-1 md:gap-4">
            {/* Left: Hamburger + Logo + MegaMenu */}
            <div className="flex items-center gap-1 md:gap-4">
              {/* Hamburger Menu - Mobile Only */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/20"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} className="md:size-6" />
              </Button>

              {/* Logo */}
              <div
                className="cursor-pointer"
                onClick={() => navigate({ to: "/" })}
              >
                <h1 className="text-lg md:text-2xl font-bold text-white whitespace-nowrap">
                  <span className="text-white">F5</span>
                  <span className="text-yellow-300">Tech</span>
                </h1>
              </div>

              {/* MegaMenu - Desktop Only */}
              <div className="hidden lg:block">
                <MegaMenu />
              </div>
            </div>

            {/* Search Bar - Always visible but responsive */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 md:size-5"
                />
                <Input
                  type="text"
                  ref={searchRef}
                  placeholder="Tìm kiếm..."
                  className="pl-8 md:pl-10 pr-2 md:pr-4 w-full bg-white border-none focus-visible:ring-white focus-visible:ring-offset-0 h-8 md:h-10 text-sm md:text-base"
                />
              </div>
            </div>

          {/* Icons */}
          <div className="flex items-center gap-1 md:gap-2">
            {isAuth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white hover:bg-primary-dark hover:text-white md:w-auto md:px-3 md:gap-2"
                  >
                    <User2 size={20} className="md:size-6" />
                    <span className="hidden md:inline font-medium">
                      {session.data?.user?.name || session.data?.user?.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/user" })}>
                    <User2 className="mr-2 h-4 w-4" />
                    <span>Đơn hàng và hồ sơ</span>
                  </DropdownMenuItem>
                  {myProfile.data?.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => navigate({ to: "/admin/dashboard" })}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Quản trị viên</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      navigate({ to: "/" });
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <RippleButton
                size="icon"
                className="relative text-white hover:bg-primary-dark hover:text-white md:w-auto md:px-3 md:gap-2"
                onClick={() =>
                  navigate({
                    to: "/auth",
                  })
                }
              >
                <User size={20} className="md:size-6" />
                <span className="hidden md:inline font-medium">Đăng nhập</span>
              </RippleButton>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-primary-dark hover:text-white"
              onClick={() => navigate({ to: "/cart" })}
            >
              <ShoppingCart size={20} className="md:size-6" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 flex items-center justify-center p-0 text-[10px] md:text-xs bg-yellow-400 text-gray-900 border-none">
                {count}
              </Badge>
            </Button>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
