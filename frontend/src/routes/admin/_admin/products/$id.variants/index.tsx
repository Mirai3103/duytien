import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Edit, MoreHorizontal, Trash2, Plus } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { VariantStatus, type Variant } from "@f5tech/schemas/variant";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/_admin/products/$id/variants/")({
  component: RouteComponent,
});

type SortField = "price" | "name" | "stock" | "status" | "createdAt";

function RouteComponent() {
  const { id } = useParams({ from: "/admin/_admin/products/$id/variants/" });
  const productId = Number(id);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword] = useDebounceValue(keyword, 300);
  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >(undefined);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<number | null>(null);

  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [activeVariantId, setActiveVariantId] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<string>("");
  const [newStock, setNewStock] = useState<string>("");

  const { data: variants = [] } = useQuery(
    trpc.variants.getVariants.queryOptions(productId)
  );

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.variants.getVariants.queryKey(productId),
    });
  };

  const mutateDelete = useMutation(
    trpc.variants.deleteVariant.mutationOptions({
      onSuccess: async () => {
        toast.success("Xóa SKU thành công");
        await invalidate();
        setDeleteDialogOpen(false);
        setVariantToDelete(null);
      },
    })
  );
  const mutateToggle = useMutation(
    trpc.variants.toggleVariantStatus.mutationOptions({
      onSuccess: async () => {
        toast.success("Cập nhật trạng thái thành công");
        await invalidate();
      },
    })
  );
  const mutateSetPrice = useMutation(
    trpc.variants.setPrice.mutationOptions({
      onSuccess: async () => {
        toast.success("Cập nhật giá thành công");
        await invalidate();
        setPriceDialogOpen(false);
        setActiveVariantId(null);
        setNewPrice("");
      },
    })
  );
  const mutateAddStock = useMutation(
    trpc.variants.addStock.mutationOptions({
      onSuccess: async () => {
        toast.success("Cập nhật tồn kho thành công");
        await invalidate();
        setStockDialogOpen(false);
        setActiveVariantId(null);
        setNewStock("");
      },
    })
  );
  const mutateSetDefault = useMutation(
    trpc.variants.setDefaultVariant.mutationOptions({
      onSuccess: async () => {
        toast.success("Đặt biến thể mặc định thành công");
        await invalidate();
      },
    })
  );

  const filtered = useMemo(() => {
    const list = Array.isArray(variants) ? (variants as Variant[]) : [];
    const kw = debouncedKeyword.trim().toLowerCase();
    let result = kw
      ? list.filter((v) =>
          [v.name, v.sku].some((x) =>
            String(x ?? "")
              .toLowerCase()
              .includes(kw)
          )
        )
      : list;

    if (sortField && sortDirection) {
      result = [...result].sort((a, b) => {
        const dir = sortDirection === "asc" ? 1 : -1;
        switch (sortField) {
          case "price":
            return (Number(a.price) - Number(b.price)) * dir;
          case "name":
            return String(a.name).localeCompare(String(b.name)) * dir;
          case "stock":
            return (Number(a.stock) - Number(b.stock)) * dir;
          case "status":
            return String(a.status).localeCompare(String(b.status)) * dir;
          case "createdAt":
            return (
              (new Date(a.createdAt as any).getTime() -
                new Date(b.createdAt as any).getTime()) *
              dir
            );
          default:
            return 0;
        }
      });
    }
    return result;
  }, [variants, debouncedKeyword, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection("asc");
      return;
    }
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý biến thể (SKU)</h1>
          <p className="text-muted-foreground mt-1">
            Tìm kiếm, sắp xếp, xóa, bật/tắt, cập nhật giá và tồn kho
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products/$id/variants/create" params={{ id }}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm biến thể
            </Button>
          </Link>
          <Link to="/admin/products">
            <Button variant="outline">Quay lại sản phẩm</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative w-full max-w-md">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tên, SKU..."
            className="bg-card border-border text-foreground"
          />
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
                  Tên <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="px-0 gap-2"
                  onClick={() => handleSort("price")}
                >
                  Giá <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="px-0 gap-2"
                  onClick={() => handleSort("stock")}
                >
                  Tồn kho <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Mặc định</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="px-0 gap-2"
                  onClick={() => handleSort("status")}
                >
                  Trạng thái <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="px-0 gap-2"
                  onClick={() => handleSort("createdAt")}
                >
                  Tạo lúc <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img src={v.image} alt={v.name} width={100} height={100} />
                    <span className="text-sm font-medium">{v.name}</span>
                  </div>
                </TableCell>
                <TableCell>{v.sku}</TableCell>
                <TableCell>
                  {Number(v.price).toLocaleString("vi-VN")}₫
                </TableCell>
                <TableCell>{v.stock}</TableCell>
                <TableCell>
                  {v.isDefault ? (
                    <Badge>Default</Badge>
                  ) : (
                    <Badge variant="secondary">-</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {v.status === VariantStatus.ACTIVE ? (
                    <Badge className="bg-green-600 hover:bg-green-600">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(v.createdAt as any).toLocaleString("vi-VN")}
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
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/products/$id/variants/$variantId/edit"
                          params={{
                            id: String(productId),
                            variantId: String(v.id),
                          }}
                          className="flex gap-2"
                        >
                          <Edit className="h-4 w-4" /> Sửa
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={v.isDefault}
                        onClick={() =>
                          mutateSetDefault.mutate({
                            productId,
                            variantId: v.id,
                          })
                        }
                      >
                        {v.isDefault ? "Mặc định hiện tại" : "Đặt làm mặc định"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => mutateToggle.mutate({ variantId: v.id })}
                      >
                        {v.status === VariantStatus.ACTIVE ? "Ẩn" : "Kích hoạt"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setActiveVariantId(v.id);
                          setNewPrice(String(Number(v.price)));
                          setPriceDialogOpen(true);
                        }}
                      >
                        Đặt giá
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setActiveVariantId(v.id);
                          setNewStock(String(v.stock));
                          setStockDialogOpen(true);
                        }}
                      >
                        Cập nhật tồn kho
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setVariantToDelete(v.id);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-600 gap-2"
                      >
                        <Trash2 className="h-4 w-4" /> Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa biến thể</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn biến thể.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (variantToDelete) mutateDelete.mutate(variantToDelete);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Set Price Dialog */}
      <Dialog open={priceDialogOpen} onOpenChange={setPriceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật giá</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="number"
              min={0}
              step="1000"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Nhập giá mới"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (!activeVariantId) return;
                const priceNum = Number(newPrice || 0);
                mutateSetPrice.mutate({
                  variantId: activeVariantId,
                  price: priceNum,
                });
              }}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Stock Dialog */}
      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật tồn kho</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="number"
              min={0}
              step="1"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              placeholder="Nhập tồn kho"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (!activeVariantId) return;
                const stockNum = Number(newStock || 0);
                mutateAddStock.mutate({
                  variantId: activeVariantId,
                  stock: stockNum,
                });
              }}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
