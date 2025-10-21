import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import ImageUploadPreview from "@/components/ImageUploadPreview";
import { uploadFile } from "@/lib/file";

import { toast } from "sonner";
import {
  ArrowLeft,
  Package2,
  DollarSign,
  Image as ImageIcon,
  Info,
  Tag,
  Box,
  Upload,
  X,
  Images,
  FileText,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VariantSpecsTab } from "@/components/admin/variant/VariantSpecsTab";
import {
  VariantStatus,
  type UpdateVariant,
} from "@/types/backend/schemas/variant";

export const Route = createFileRoute(
  "/admin/_admin/products/$id/variants/$variantId/edit"
)({
  component: RouteComponent,
});

type VariantFormValues = Omit<UpdateVariant, "createdAt">;

function RouteComponent() {
  const params = useParams({
    from: "/admin/_admin/products/$id/variants/$variantId/edit",
  });
  const productId = Number(params.id);
  const variantId = Number(params.variantId);
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: variant } = useQuery(
    trpc.variants.getVariantDetail.queryOptions(variantId)
  );
  const { data: requiredAttrs = [] } = useQuery(
    trpc.attributes.getKeyByProductId.queryOptions(productId)
  );

  const form = useForm<VariantFormValues>({
    defaultValues: {
      id: variantId,
      name: "",
      productId,
      sku: "",
      price: 0,
      stock: 0,
      image: "",
      isDefault: false,
      status: VariantStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (!variant) return;
    form.reset({
      id: Number((variant as any).id),
      name: String((variant as any).name),
      productId: Number((variant as any).productId),
      sku: String((variant as any).sku),
      price: Number((variant as any).price),
      stock: Number((variant as any).stock),
      image: String((variant as any).image ?? ""),
      isDefault: Boolean((variant as any).isDefault),
      status: (variant as any).status as VariantStatus,
    });
    setImageUrl(String((variant as any).image ?? ""));
    setImageFile(null);
  }, [variant, form]);

  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Gallery management
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

  const mutateUpdate = useMutation(
    trpc.variants.updateVariant.mutationOptions({
      onSuccess: async () => {
        toast.success("Cập nhật biến thể thành công");
        await invalidate();
        router.navigate({
          to: "/admin/products/$id/variants",
          params: { id: String(productId) },
        });
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi cập nhật biến thể");
        console.error(error);
      },
    })
  );
  const mutateSetAttrs = useMutation(
    trpc.variants.setVariantAttributes.mutationOptions({
      onSuccess: async () => {
        toast.success("Cập nhật thuộc tính thành công");
        await invalidate();
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi cập nhật thuộc tính");
        console.error(error);
      },
    })
  );

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
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              router.navigate({
                to: "/admin/products/$id/variants",
                params: { id: String(productId) },
              })
            }
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Package2 className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Chỉnh sửa biến thể (SKU)
            </h1>
            <p className="text-muted-foreground mt-1">
              Cập nhật thông tin chi tiết của biến thể sản phẩm
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="info" className="gap-2">
            <Box className="h-4 w-4" />
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="gallery" className="gap-2">
            <Images className="h-4 w-4" />
            Thư viện ảnh
          </TabsTrigger>
          <TabsTrigger value="attributes" className="gap-2">
            <Tag className="h-4 w-4" />
            Thuộc tính
          </TabsTrigger>
          <TabsTrigger value="specs" className="gap-2">
            <FileText className="h-4 w-4" />
            Thông số
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle>Thông tin biến thể</CardTitle>
              <CardDescription>
                Các trường đánh dấu <span className="text-red-500">*</span> là
                bắt buộc
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  className="space-y-8"
                  onSubmit={form.handleSubmit(async (values) => {
                    let finalImage = values.image?.trim() || imageUrl;
                    if (imageFile) {
                      setIsUploading(true);
                      try {
                        finalImage = await uploadFile(imageFile);
                      } finally {
                        setIsUploading(false);
                      }
                    }
                    mutateUpdate.mutate({
                      ...values,
                      image: finalImage || "",
                    });
                  })}
                >
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Box className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">
                        Thông tin cơ bản
                      </h3>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              Tên biến thể{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="VD: 128GB / Đen"
                                {...field}
                                required
                                className="text-base"
                              />
                            </FormControl>
                            <FormDescription>
                              Tên mô tả cho biến thể này (VD: dung lượng, màu
                              sắc)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              SKU <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="SKU duy nhất"
                                {...field}
                                required
                                className="text-base"
                              />
                            </FormControl>
                            <FormDescription>
                              Mã SKU duy nhất để quản lý kho
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Pricing & Inventory */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">Giá & Tồn kho</h3>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giá bán (VNĐ)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step="1000"
                                {...field}
                                placeholder="0"
                              />
                            </FormControl>
                            <FormDescription>
                              Giá của biến thể này
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tồn kho</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step="1"
                                {...field}
                                placeholder="0"
                              />
                            </FormControl>
                            <FormDescription>
                              Số lượng trong kho
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trạng thái</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={VariantStatus.ACTIVE}>
                                  <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Active
                                  </span>
                                </SelectItem>
                                <SelectItem value={VariantStatus.INACTIVE}>
                                  <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                    Inactive
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Trạng thái hiển thị
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Media & Settings */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">
                        Hình ảnh & Cài đặt
                      </h3>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              Ảnh biến thể
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <ImageUploadPreview
                                  defaultValue={imageUrl}
                                  file={imageFile}
                                  onChange={(file) => setImageFile(file)}
                                  disabled={isUploading}
                                  className="h-48"
                                  imageClassName="h-48"
                                />
                                <Input
                                  placeholder="Hoặc nhập URL ảnh: https://..."
                                  value={field.value ?? imageUrl}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                    setImageUrl(e.target.value);
                                  }}
                                  className="max-w-2xl"
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Ảnh riêng cho biến thể này (nếu có)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isDefault"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              Biến thể mặc định
                            </FormLabel>
                            <div className="flex items-start gap-3 pt-2">
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(v) =>
                                  field.onChange(Boolean(v))
                                }
                                className="mt-1"
                              />
                              <div className="space-y-1">
                                <span className="text-sm font-medium">
                                  Đặt làm biến thể mặc định
                                </span>
                                <p className="text-sm text-muted-foreground">
                                  Biến thể này sẽ được hiển thị đầu tiên khi
                                  khách hàng xem sản phẩm
                                </p>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Vui lòng kiểm tra kỹ thông tin trước khi lưu
                    </p>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          router.navigate({
                            to: "/admin/products/$id/variants",
                            params: { id: String(productId) },
                          })
                        }
                        disabled={mutateUpdate.isPending || isUploading}
                      >
                        Hủy bỏ
                      </Button>
                      <Button
                        type="submit"
                        disabled={mutateUpdate.isPending || isUploading}
                        size="lg"
                      >
                        {mutateUpdate.isPending || isUploading
                          ? "Đang xử lý..."
                          : "Lưu thay đổi"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <Images className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Thư viện ảnh biến thể</CardTitle>
              </div>
              <CardDescription>
                Quản lý tất cả ảnh của biến thể này. Kéo thả hoặc click để
                upload
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
                      {galleryFiles.length > 0 &&
                        deletedImageIds.length > 0 &&
                        " · "}
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
                        disabled={
                          isUploadingGallery || mutateEditImages.isPending
                        }
                      >
                        Hủy thay đổi
                      </Button>
                      <Button
                        onClick={handleSaveGallery}
                        disabled={
                          isUploadingGallery || mutateEditImages.isPending
                        }
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
        </TabsContent>

        {/* Attributes Tab */}
        <TabsContent value="attributes">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Giá trị thuộc tính</CardTitle>
              </div>
              <CardDescription>
                Nhập giá trị cụ thể cho các thuộc tính của biến thể này
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {(Array.isArray(requiredAttrs) ? requiredAttrs : []).length >
                0 ? (
                  <>
                    <div className="space-y-4">
                      {(Array.isArray(requiredAttrs) ? requiredAttrs : []).map(
                        (ra: any) => (
                          <div
                            key={ra.attributeId}
                            className="grid md:grid-cols-[200px_1fr_100px] gap-4 items-start p-4 border rounded-lg bg-muted/30"
                          >
                            <div>
                              <div className="font-medium text-sm">
                                {ra.attribute?.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Thuộc tính bắt buộc
                              </div>
                            </div>
                            <Input
                              placeholder={ra.defaultValue ?? "Nhập giá trị"}
                              value={
                                (variant as any)?.variantValues?.find(
                                  (vv: any) =>
                                    vv.value?.attributeId === ra.attributeId
                                )?.value?.value ?? ""
                              }
                              onChange={(e) => {
                                const vv = ((variant as any)?.variantValues ||
                                  []) as any[];
                                const idx = vv.findIndex(
                                  (x) => x.value?.attributeId === ra.attributeId
                                );
                                const updated = [...vv];
                                if (idx >= 0)
                                  updated[idx] = {
                                    ...updated[idx],
                                    value: {
                                      ...updated[idx].value,
                                      value: e.target.value,
                                    },
                                  };
                                else
                                  updated.push({
                                    value: {
                                      attributeId: ra.attributeId,
                                      value: e.target.value,
                                    },
                                  });
                                // store temporarily on variant object in memory
                                (variant as any).variantValues = updated;
                              }}
                            />
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                              Bắt buộc
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Nhớ lưu thuộc tính sau khi thay đổi
                      </p>
                      <Button
                        onClick={() => {
                          const list = (
                            ((variant as any)?.variantValues || []) as any[]
                          )
                            .map((x) => ({
                              attributeId: x.value?.attributeId as number,
                              value: String(x.value?.value ?? ""),
                            }))
                            .filter(
                              (x) => x.attributeId && x.value.trim().length > 0
                            );
                          mutateSetAttrs.mutate({
                            variantId,
                            attributeValues: list,
                          });
                        }}
                        disabled={mutateSetAttrs.isPending}
                        size="lg"
                      >
                        {mutateSetAttrs.isPending
                          ? "Đang lưu..."
                          : "Lưu thuộc tính"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Không có thuộc tính bắt buộc cho sản phẩm này</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specs Tab */}
        <TabsContent value="specs">
          <VariantSpecsTab variantId={variantId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
