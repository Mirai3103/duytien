import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpDown,
  MoreHorizontal,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";
import { useTRPC } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useDebounceValue } from "usehooks-ts";
import { ProductStatus } from "@/types/backend/schemas/product";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { Edit, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/_admin/products/")({
  component: RouteComponent,
});

type ProductRow = {
  id: number;
  name: string;
  brandId?: number | null;
  categoryId?: number | null;
  thumbnail?: string | null;
  status: "active" | "inactive";
  brandName?: string | null;
  categoryName?: string | null;
  createdAt: string | Date;
  price: number;
};

function RouteComponent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword] = useDebounceValue(keyword, 400);
  const [brandFilter, setBrandFilter] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<number[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [sortField, setSortField] = useState<
    "price" | "name" | "status" | "createdAt" | undefined
  >(undefined);
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const { data: products = [] } = useQuery(
    trpc.products.getProducts.queryOptions({
      page,
      limit,
      keyword: debouncedKeyword || undefined,
      brandId: brandFilter.length ? brandFilter : undefined,
      categoryId: categoryFilter.length ? categoryFilter : undefined,
      sort:
        sortField && sortDirection
          ? { field: sortField, direction: sortDirection }
          : undefined,
    })
  );

  const { data: brands = [] as any[] } = useQuery(
    trpc.brands.getAll.queryOptions({ page: 1, limit: 200, search: "" })
  );

  const { data: parentCategories = [] as any[] } = useQuery(
    trpc.categories.getAllParentCategories.queryOptions()
  );

  const mutateDelete = useMutation(
    trpc.products.deleteProduct.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.products.getProducts.queryOptions({
            page,
            limit,
            keyword: debouncedKeyword || undefined,
            brandId: brandFilter.length ? brandFilter : undefined,
            categoryId: categoryFilter.length ? categoryFilter : undefined,
            sort:
              sortField && sortDirection
                ? { field: sortField, direction: sortDirection }
                : undefined,
          })
        );
        toast.success("Xóa sản phẩm thành công");
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      },
    })
  );

  const handleDeleteClick = (productId: number) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      mutateDelete.mutate(productToDelete);
    }
  };

  const mutateToggle = useMutation(
    trpc.products.toggleProductStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.products.getProducts.queryOptions({
            page,
            limit,
            keyword: debouncedKeyword || undefined,
            brandId: brandFilter.length ? brandFilter : undefined,
            categoryId: categoryFilter.length ? categoryFilter : undefined,
            sort:
              sortField && sortDirection
                ? { field: sortField, direction: sortDirection }
                : undefined,
          })
        );
        toast.success("Cập nhật trạng thái sản phẩm thành công");
      },
    })
  );

  const safeProducts = useMemo<any[]>(
    () => (Array.isArray(products) ? products : []),
    [products]
  );
  const rows: ProductRow[] = useMemo(() => {
    return safeProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      thumbnail: p.thumbnail ?? null,
      brandId: p.brandId ?? null,
      categoryId: p.categoryId ?? null,
      brandName: p.brand.name ?? null,
      categoryName: p.category.name ?? null,
      status: p.status,
      createdAt: p.createdAt,
      price: Number(p.price),
    }));
  }, [safeProducts]);

  const handleSort = (field: "price" | "name" | "status" | "createdAt") => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection("asc");
      setPage(1);
      return;
    }
    // toggle
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const safeBrands = useMemo<any[]>(
    () => (Array.isArray(brands) ? brands : []),
    [brands]
  );
  const brandOptions = useMemo<{ id: number; name: string }[]>(() => {
    return safeBrands.map((b: any) => ({
      id: b.id as number,
      name: b.name as string,
    }));
  }, [safeBrands]);

  // Flatten categories (parents + children one level)
  const safeParents = useMemo<any[]>(
    () => (Array.isArray(parentCategories) ? parentCategories : []),
    [parentCategories]
  );
  const categoryOptions = useMemo<{ id: number; name: string }[]>(() => {
    const list: { id: number; name: string }[] = [];
    for (const c of safeParents) {
      list.push({ id: Number(c.id), name: String(c.name) });
      const children = Array.isArray(c.children) ? c.children : [];
      for (const ch of children) {
        list.push({
          id: Number(ch.id),
          name: `${String(c.name)} / ${String(ch.name)}`,
        });
      }
    }
    return list;
  }, [safeParents]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý sản phẩm
          </h1>
          <p className="text-muted-foreground mt-1">
            Xem, lọc, sắp xếp, xóa, bật/tắt trạng thái
          </p>
        </div>
        <Link to="/admin/products/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Thêm sản phẩm
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên, slug..."
            className="pl-10 bg-card border-border text-foreground"
          />
        </div>

        {/* Brand filter - Select */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Thương hiệu</span>
          <Select
            value={selectedBrandId}
            onValueChange={(value) => {
              setSelectedBrandId(value);
              setPage(1);
              if (!value) {
                setBrandFilter([]);
              } else {
                const id = Number(value);
                setBrandFilter([id]);
              }
            }}
          >
            <SelectTrigger className="w-[220px] bg-card border-border text-foreground">
              <SelectValue placeholder="Tất cả thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {brandOptions.map((b) => (
                <SelectItem key={b.id} value={String(b.id)}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category filter - Select */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Danh mục</span>
          <Select
            value={selectedCategoryId}
            onValueChange={(value) => {
              setSelectedCategoryId(value);
              setPage(1);
              if (!value) {
                setCategoryFilter([]);
              } else {
                const id = Number(value);
                setCategoryFilter([id]);
              }
            }}
          >
            <SelectTrigger className="w-[260px] bg-card border-border text-foreground">
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {categoryOptions.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="px-0 gap-2"
                  onClick={() => handleSort("name")}
                >
                  Tên
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Thương hiệu</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="px-0 gap-2"
                  onClick={() => handleSort("price")}
                >
                  Giá
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="px-0 gap-2"
                  onClick={() => handleSort("status")}
                >
                  Trạng thái
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="px-0 gap-2"
                  onClick={() => handleSort("createdAt")}
                >
                  Tạo lúc
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={row.thumbnail ?? "/placeholder.svg"}
                      alt={row.name}
                      className="w-24 h-24 rounded-md object-cover"
                    />
                    <span>{row.name}</span>
                  </div>
                </TableCell>
                <TableCell>{row.brandName}</TableCell>
                <TableCell>{row.categoryName}</TableCell>
                <TableCell>{row.price.toLocaleString("vi-VN")}₫</TableCell>
                <TableCell>
                  {row.status === "active" ? (
                    <Badge className="bg-green-600 hover:bg-green-600">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(row.createdAt).toLocaleString("vi-VN")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <Link
                        to="/admin/products/$id/variants"
                        params={{ id: String(row.id) }}
                      >
                        <DropdownMenuItem className="gap-2">
                          <Layers className="h-4 w-4" /> Quản lý SKU
                        </DropdownMenuItem>
                      </Link>
                      <Link
                        to="/admin/products/$id/edit"
                        params={{ id: String(row.id) }}
                      >
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" /> Sửa
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={() => mutateToggle.mutate(row.id)}
                        className="gap-2"
                      >
                        {row.status === ProductStatus.ACTIVE ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Ẩn
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Kích hoạt
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(row.id)}
                        className="text-red-600 gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Trang trước
        </Button>
        <div className="w-10 text-center">{page}</div>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
          Trang sau
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
