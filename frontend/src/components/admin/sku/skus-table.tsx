import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const skus = [
  {
    id: "SKU001",
    spuId: 1,
    spuName: "iPhone 15 Pro Max",
    variant: "256GB - Titan Tự nhiên",
    sku: "IP15PM-256-TN",
    price: "₫32,990,000",
    stock: 12,
    status: "active",
    image: "/modern-smartphone.png",
  },
  {
    id: "SKU002",
    spuId: 1,
    spuName: "iPhone 15 Pro Max",
    variant: "256GB - Titan Xanh",
    sku: "IP15PM-256-TX",
    price: "₫32,990,000",
    stock: 8,
    status: "active",
    image: "/modern-smartphone.png",
  },
  {
    id: "SKU003",
    spuId: 1,
    spuName: "iPhone 15 Pro Max",
    variant: "512GB - Titan Tự nhiên",
    sku: "IP15PM-512-TN",
    price: "₫38,990,000",
    stock: 5,
    status: "active",
    image: "/modern-smartphone.png",
  },
  {
    id: "SKU004",
    spuId: 1,
    spuName: "iPhone 15 Pro Max",
    variant: "1TB - Titan Trắng",
    sku: "IP15PM-1TB-TT",
    price: "₫44,990,000",
    stock: 3,
    status: "active",
    image: "/modern-smartphone.png",
  },
  {
    id: "SKU005",
    spuId: 2,
    spuName: "Samsung Galaxy S24 Ultra",
    variant: "256GB - Titan Xám",
    sku: "S24U-256-TX",
    price: "₫29,990,000",
    stock: 15,
    status: "active",
    image: "/samsung-products.png",
  },
  {
    id: "SKU006",
    spuId: 2,
    spuName: "Samsung Galaxy S24 Ultra",
    variant: "512GB - Titan Đen",
    sku: "S24U-512-TD",
    price: "₫33,990,000",
    stock: 0,
    status: "out_of_stock",
    image: "/samsung-products.png",
  },
  {
    id: "SKU007",
    spuId: 6,
    spuName: "Apple Watch Series 9",
    variant: "41mm - GPS - Starlight",
    sku: "AW9-41-GPS-SL",
    price: "₫10,990,000",
    stock: 20,
    status: "active",
    image: "/apple-watch.jpg",
  },
  {
    id: "SKU008",
    spuId: 6,
    spuName: "Apple Watch Series 9",
    variant: "45mm - GPS + Cellular - Midnight",
    sku: "AW9-45-CELL-MN",
    price: "₫13,990,000",
    stock: 12,
    status: "active",
    image: "/apple-watch.jpg",
  },
];

const statusConfig = {
  active: { label: "Đang bán", variant: "default" as const },
  out_of_stock: { label: "Hết hàng", variant: "destructive" as const },
  draft: { label: "Nháp", variant: "secondary" as const },
};

export function SkusTable() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                  SKU
                </th>
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                  Sản phẩm gốc
                </th>
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                  Biến thể
                </th>
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                  Mã SKU
                </th>
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                  Giá bán
                </th>
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                  Tồn kho
                </th>
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {skus.map((sku) => (
                <tr
                  key={sku.id}
                  className="border-b border-border hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                        <img
                          src={sku.image || "/placeholder.svg"}
                          alt={sku.variant}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{sku.id}</p>
                        <p className="text-xs text-muted-foreground">
                          SPU #{sku.spuId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">
                      {sku.spuName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground font-medium">
                      {sku.variant}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="font-mono text-xs">
                      {sku.sku}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">
                      {sku.price}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${
                        sku.stock === 0
                          ? "text-red-500"
                          : sku.stock < 10
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      {sku.stock} sản phẩm
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        statusConfig[sku.status as keyof typeof statusConfig]
                          .variant
                      }
                    >
                      {
                        statusConfig[sku.status as keyof typeof statusConfig]
                          .label
                      }
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-card border-border"
                      >
                        <DropdownMenuItem className="text-foreground hover:bg-secondary">
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground hover:bg-secondary">
                          <Package className="w-4 h-4 mr-2" />
                          Xem SPU
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground hover:bg-secondary">
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 hover:bg-secondary">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
