import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Image as ImageIcon } from "lucide-react";
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

export interface IBrand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
}

interface BrandsTableProps {
  brands: IBrand[];
  onEdit: (brand: IBrand) => void;
  onDelete: (brand: IBrand) => void;
}

export function BrandsTable({ brands, onEdit, onDelete }: BrandsTableProps) {
  const [deleteItem, setDeleteItem] = useState<IBrand | null>(null);

  const handleDeleteClick = (brand: IBrand) => {
    setDeleteItem(brand);
  };

  const handleDeleteConfirm = () => {
    if (deleteItem) {
      onDelete(deleteItem);
      setDeleteItem(null);
    }
  };

  return (
    <>
      <Card className="bg-card border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground font-semibold">Logo</TableHead>
              <TableHead className="text-foreground font-semibold">Tên thương hiệu</TableHead>
              <TableHead className="text-foreground font-semibold">Slug</TableHead>
              <TableHead className="text-foreground font-semibold">Sản phẩm</TableHead>
              <TableHead className="text-right text-foreground font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow
                key={brand.id}
                className="border-border hover:bg-muted/50"
              >
                <TableCell>
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {brand.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {brand.slug}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {Math.floor(Math.random() * 50) + 10}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(brand)}
                      className="h-8 px-2 hover:bg-yellow-50 hover:text-yellow-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteClick(brand)}
                      className="h-8 px-2 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {brands.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Không có thương hiệu nào
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Bạn có chắc chắn muốn xóa thương hiệu <strong>{deleteItem?.name}</strong>?
              Hành động này không thể hoàn tác và sẽ xóa tất cả sản phẩm liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-transparent">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

