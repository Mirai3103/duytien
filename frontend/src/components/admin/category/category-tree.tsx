import { useState } from "react";
import { ChevronRight, ChevronDown, Edit, Trash2, Plus, Folder, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export interface ICategory {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  children?: ICategory[];
}

interface CategoryTreeItemProps {
  category: ICategory;
  level?: number;
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
  onAddChild: (parentCategory: ICategory) => void;
}

function CategoryTreeItem({
  category,
  level = 0,
  onEdit,
  onDelete,
  onAddChild,
}: CategoryTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-5 h-5 flex items-center justify-center hover:bg-muted rounded transition-colors"
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )
          ) : (
            <span className="w-4" />
          )}
        </button>

        {/* Folder Icon */}
        {isExpanded && hasChildren ? (
          <FolderOpen className="w-4 h-4 text-primary" />
        ) : (
          <Folder className="w-4 h-4 text-muted-foreground" />
        )}

        {/* Category Info */}
        <div className="flex-1 flex items-center gap-3">
          <div>
            <div className="font-medium text-foreground">{category.name}</div>
            <div className="text-xs text-muted-foreground">{category.slug}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAddChild(category)}
            className="h-8 px-2 hover:bg-blue-50 hover:text-blue-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(category)}
            className="h-8 px-2 hover:bg-yellow-50 hover:text-yellow-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(category)}
            className="h-8 px-2 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div>
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryTreeProps {
  categories: ICategory[];
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
  onAddChild: (parentCategory: ICategory) => void;
}

export function CategoryTree({
  categories,
  onEdit,
  onDelete,
  onAddChild,
}: CategoryTreeProps) {
  const [deleteCategory, setDeleteCategory] = useState<ICategory | null>(null);

  const handleDeleteClick = (category: ICategory) => {
    setDeleteCategory(category);
  };

  const handleDeleteConfirm = () => {
    if (deleteCategory) {
      onDelete(deleteCategory);
      setDeleteCategory(null);
    }
  };

  return (
    <>
      <Card className="bg-card border-border">
        <div className="divide-y divide-border">
          {categories.map((category) => (
            <CategoryTreeItem
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={handleDeleteClick}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Bạn có chắc chắn muốn xóa danh mục <strong>{deleteCategory?.name}</strong>?
              Hành động này không thể hoàn tác và sẽ xóa tất cả danh mục con.
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

