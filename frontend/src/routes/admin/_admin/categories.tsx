import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/categories")({
  component: RouteComponent,
});

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { CategoryStats } from "@/components/admin/category/category-stats";
import { CategoryTree } from "@/components/admin/category/category-tree";
import type { ICategory } from "@/components/admin/category/category-tree";
import { CategoryDialog } from "@/components/admin/category/category-dialog";

// Mock data - Sẽ thay thế bằng API call thực tế
const mockCategories: ICategory[] = [
  {
    id: 1,
    name: "Điện thoại",
    slug: "dien-thoai",
    parentId: null,
    children: [
      {
        id: 2,
        name: "iPhone",
        slug: "iphone",
        parentId: 1,
        children: [
          {
            id: 3,
            name: "iPhone 15 Series",
            slug: "iphone-15-series",
            parentId: 2,
          },
          {
            id: 4,
            name: "iPhone 14 Series",
            slug: "iphone-14-series",
            parentId: 2,
          },
        ],
      },
      {
        id: 5,
        name: "Samsung",
        slug: "samsung",
        parentId: 1,
        children: [
          {
            id: 6,
            name: "Galaxy S Series",
            slug: "galaxy-s-series",
            parentId: 5,
          },
          {
            id: 7,
            name: "Galaxy Z Fold",
            slug: "galaxy-z-fold",
            parentId: 5,
          },
        ],
      },
      {
        id: 8,
        name: "Xiaomi",
        slug: "xiaomi",
        parentId: 1,
      },
    ],
  },
  {
    id: 9,
    name: "Laptop",
    slug: "laptop",
    parentId: null,
    children: [
      {
        id: 10,
        name: "MacBook",
        slug: "macbook",
        parentId: 9,
      },
      {
        id: 11,
        name: "Gaming Laptop",
        slug: "gaming-laptop",
        parentId: 9,
      },
    ],
  },
  {
    id: 12,
    name: "Phụ kiện",
    slug: "phu-kien",
    parentId: null,
    children: [
      {
        id: 13,
        name: "Tai nghe",
        slug: "tai-nghe",
        parentId: 12,
      },
      {
        id: 14,
        name: "Sạc dự phòng",
        slug: "sac-du-phong",
        parentId: 12,
      },
      {
        id: 15,
        name: "Ốp lưng",
        slug: "op-lung",
        parentId: 12,
      },
    ],
  },
];

export default function CategoriesPage() {
  const [categories] = useState<ICategory[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [parentCategory, setParentCategory] = useState<ICategory | null>(null);

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setParentCategory(null);
    setDialogOpen(true);
  };

  const handleDelete = (category: ICategory) => {
    // TODO: Implement API call to delete category
    console.log("Delete category:", category);
  };

  const handleAddChild = (parent: ICategory) => {
    setEditingCategory(null);
    setParentCategory(parent);
    setDialogOpen(true);
  };

  const handleAddRoot = () => {
    setEditingCategory(null);
    setParentCategory(null);
    setDialogOpen(true);
  };

  const handleSave = (data: {
    id?: number;
    name: string;
    slug: string;
    parentId: number | null;
  }) => {
    // TODO: Implement API call to save category
    console.log("Save category:", data);
  };

  const filterCategories = (cats: ICategory[], query: string): ICategory[] => {
    if (!query) return cats;

    const results: ICategory[] = [];
    
    for (const cat of cats) {
      const matches =
        cat.name.toLowerCase().includes(query.toLowerCase()) ||
        cat.slug.toLowerCase().includes(query.toLowerCase());

      const filteredChildren = cat.children
        ? filterCategories(cat.children, query)
        : [];

      if (matches || filteredChildren.length > 0) {
        results.push({
          ...cat,
          children: filteredChildren.length > 0 ? filteredChildren : cat.children,
        });
      }
    }
    
    return results;
  };

  const filteredCategories = filterCategories(categories, searchQuery);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý danh mục</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý cấu trúc danh mục sản phẩm theo cấp bậc
          </p>
        </div>
        <Button onClick={handleAddRoot} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục gốc
        </Button>
      </div>

      {/* Stats */}
      <CategoryStats />

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border text-foreground"
          />
        </div>
      </div>

      {/* Category Tree */}
      <CategoryTree
        categories={filteredCategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddChild={handleAddChild}
      />

      {/* Category Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        parentCategory={parentCategory}
        allCategories={categories}
        onSave={handleSave}
      />
    </div>
  );
}

function RouteComponent() {
  return <CategoriesPage />;
}
