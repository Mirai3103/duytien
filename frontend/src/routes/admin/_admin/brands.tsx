import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/brands")({
  component: RouteComponent,
});

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { BrandStats } from "@/components/admin/brand/brand-stats";
import { BrandsTable } from "@/components/admin/brand/brands-table";
import type { IBrand } from "@/components/admin/brand/brands-table";
import { BrandDialog } from "@/components/admin/brand/brand-dialog";

// Mock data - Sẽ thay thế bằng API call thực tế
const mockBrands: IBrand[] = [
  {
    id: 1,
    name: "Apple",
    slug: "apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    id: 2,
    name: "Samsung",
    slug: "samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  },
  {
    id: 3,
    name: "Xiaomi",
    slug: "xiaomi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg",
  },
  {
    id: 4,
    name: "OPPO",
    slug: "oppo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/OPPO_LOGO_2019.svg",
  },
  {
    id: 5,
    name: "Vivo",
    slug: "vivo",
  },
  {
    id: 6,
    name: "Realme",
    slug: "realme",
  },
  {
    id: 7,
    name: "Nokia",
    slug: "nokia",
  },
  {
    id: 8,
    name: "Asus",
    slug: "asus",
  },
  {
    id: 9,
    name: "Sony",
    slug: "sony",
  },
  {
    id: 10,
    name: "Huawei",
    slug: "huawei",
  },
];

export default function BrandsPage() {
  const [brands] = useState<IBrand[]>(mockBrands);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<IBrand | null>(null);

  const handleEdit = (brand: IBrand) => {
    setEditingBrand(brand);
    setDialogOpen(true);
  };

  const handleDelete = (brand: IBrand) => {
    // TODO: Implement API call to delete brand
    console.log("Delete brand:", brand);
  };

  const handleAdd = () => {
    setEditingBrand(null);
    setDialogOpen(true);
  };

  const handleSave = (data: {
    id?: number;
    name: string;
    slug: string;
    logo?: string;
  }) => {
    // TODO: Implement API call to save brand
    console.log("Save brand:", data);
  };

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý thương hiệu</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các thương hiệu sản phẩm
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Thêm thương hiệu
        </Button>
      </div>

      {/* Stats */}
      <BrandStats />

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm thương hiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border text-foreground"
          />
        </div>
      </div>

      {/* Brands Table */}
      <BrandsTable
        brands={filteredBrands}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Brand Dialog */}
      <BrandDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        brand={editingBrand}
        onSave={handleSave}
      />
    </div>
  );
}

function RouteComponent() {
  return <BrandsPage />;
}
