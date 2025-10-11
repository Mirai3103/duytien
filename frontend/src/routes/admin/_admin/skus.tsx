import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/skus")({
  component: RouteComponent,
});
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { SkusTable } from "@/components/skus-table";
import { SkuStats } from "@/components/sku-stats";
import { Link } from "@tanstack/react-router";

export default function SkusPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link to="/admin/products">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý biến thể (SKU)
            </h1>
          </div>
          <p className="text-muted-foreground">
            Quản lý các biến thể sản phẩm - Stock Keeping Unit
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Thêm biến thể
        </Button>
      </div>

      {/* Stats */}
      <SkuStats />

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm SKU..."
            className="pl-10 bg-card border-border text-foreground"
          />
        </div>
        <Button variant="outline" className="border-border bg-card">
          Sản phẩm
        </Button>
        <Button variant="outline" className="border-border bg-card">
          Màu sắc
        </Button>
        <Button variant="outline" className="border-border bg-card">
          Dung lượng
        </Button>
        <Button variant="outline" className="border-border bg-card">
          Trạng thái
        </Button>
      </div>

      {/* SKUs Table */}
      <SkusTable />
    </div>
  );
}

function RouteComponent() {
  return <SkusPage />;
}
