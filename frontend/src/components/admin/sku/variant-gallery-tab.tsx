import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, Images } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { uploadFile } from "@/lib/file";

interface VariantGalleryTabProps {
  productId: number;
  variantId: number;
  variant: any;
}

export function VariantGalleryTab({
  productId,
  variantId,
  variant,
}: VariantGalleryTabProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.variants.getVariants.queryKey(productId),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.variants.getVariantDetail.queryKey(variantId),
      }),
    ]);
  };

  const mutateEditImages = useMutation(
    trpc.variantImages.editVariantImages.mutationOptions({
      onSuccess: async () => {
        toast.success("Cập nhật ảnh thành công");
        setGalleryFiles([]);
        setDeletedImageIds([]);
        await invalidate();
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi cập nhật ảnh");
        console.error(error);
      },
    })
  );

  const handleSaveGallery = async () => {
    try {
      setIsUploadingGallery(true);
      const newImages: string[] = [];

      // Upload new images
      for (const file of galleryFiles) {
        const url = await uploadFile(file);
        newImages.push(url);
      }

      // Call mutation
      mutateEditImages.mutate({
        variantId,
        newImages,
        deletedImages: deletedImageIds,
      });
    } catch (error) {
      toast.error("Lỗi khi upload ảnh");
      console.error(error);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleAddGalleryFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setGalleryFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveGalleryFile = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = (imageId: number) => {
    setDeletedImageIds((prev) => [...prev, imageId]);
  };

  const variantImages = ((variant as any)?.images || []) as Array<{
    id: number;
    image: string;
  }>;

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <Images className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Thư viện ảnh biến thể</CardTitle>
        </div>
        <CardDescription>
          Quản lý tất cả ảnh của biến thể này. Kéo thả hoặc click để upload
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Existing Images */}
          {variantImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Ảnh hiện tại</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {variantImages
                  .filter((img) => !deletedImageIds.includes(img.id))
                  .map((img) => (
                    <div
                      key={img.id}
                      className="relative group aspect-square border-2 border-dashed rounded-lg overflow-hidden hover:border-primary transition-colors"
                    >
                      <img
                        src={img.image}
                        alt="Variant"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img.id)}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* New Files Preview */}
          {galleryFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-green-600">
                Ảnh mới (chưa lưu)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square border-2 border-dashed border-green-500 rounded-lg overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="New"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryFile(index)}
                      className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Zone */}
          <div className="space-y-4">
            <Separator />
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/30"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.accept = "image/*";
                input.onchange = (e) =>
                  handleAddGalleryFiles(
                    (e.target as HTMLInputElement).files
                  );
                input.click();
              }}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Thêm ảnh mới</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Kéo thả ảnh vào đây hoặc click để chọn
              </p>
              <Button type="button" variant="outline" size="sm">
                Chọn ảnh
              </Button>
            </div>
          </div>

          {/* Actions */}
          {(galleryFiles.length > 0 || deletedImageIds.length > 0) && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {galleryFiles.length > 0 && (
                  <span className="text-green-600 font-medium">
                    {galleryFiles.length} ảnh mới
                  </span>
                )}
                {galleryFiles.length > 0 && deletedImageIds.length > 0 && " · "}
                {deletedImageIds.length > 0 && (
                  <span className="text-red-600 font-medium">
                    {deletedImageIds.length} ảnh sẽ xóa
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setGalleryFiles([]);
                    setDeletedImageIds([]);
                  }}
                  disabled={isUploadingGallery || mutateEditImages.isPending}
                >
                  Hủy thay đổi
                </Button>
                <Button
                  onClick={handleSaveGallery}
                  disabled={isUploadingGallery || mutateEditImages.isPending}
                  size="lg"
                >
                  {isUploadingGallery || mutateEditImages.isPending
                    ? "Đang lưu..."
                    : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          )}

          {variantImages.length === 0 &&
            galleryFiles.length === 0 &&
            deletedImageIds.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Images className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Chưa có ảnh nào. Hãy thêm ảnh cho biến thể này.</p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

