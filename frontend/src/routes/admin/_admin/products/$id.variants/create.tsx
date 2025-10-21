import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  VariantStatus,
  type CreateVariant,
} from "@/types/backend/schemas/variant";

export const Route = createFileRoute(
  "/admin/_admin/products/$id/variants/create"
)({
  component: RouteComponent,
});

type VariantFormValues = Omit<CreateVariant, "id" | "createdAt">;

function RouteComponent() {
  const { id } = useParams({
    from: "/admin/_admin/products/$id/variants/create",
  });
  const productId = Number(id);
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: requiredAttrs = [] } = useQuery(
    trpc.attributes.getKeyByProductId.queryOptions(productId)
  );

  const form = useForm<VariantFormValues>({
    defaultValues: {
      name: "",
      productId,
      sku: "",
      price: 0,
      stock: 0,
      image: "",
      isDefault: false,
      status: VariantStatus.ACTIVE,
      attributeValues: [] as any,
    },
  });

  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.variants.getVariants.queryKey(productId),
    });
  };

  const mutateCreate = useMutation(
    trpc.variants.createVariant.mutationOptions({
      onSuccess: async () => {
        toast.success("Tạo biến thể thành công");
        await invalidate();
        router.navigate({
          to: "/admin/products/$id/variants",
          params: { id },
        });
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi tạo biến thể");
        console.error(error);
      },
    })
  );

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
                params: { id },
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
              Tạo biến thể mới (SKU)
            </h1>
            <p className="text-muted-foreground mt-1">
              Thêm biến thể sản phẩm mới với thông tin chi tiết và thuộc tính
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Thông tin biến thể</CardTitle>
          <CardDescription>
            Các trường đánh dấu <span className="text-red-500">*</span> là bắt
            buộc
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

                // Validate required attributes
                const requiredList = (
                  Array.isArray(requiredAttrs) ? requiredAttrs : []
                ) as any[];
                const provided = ((values as any).attributeValues || []) as {
                  attributeId: number;
                  value: string;
                }[];
                const missing = requiredList.filter(
                  (ra) =>
                    !provided.find(
                      (p) =>
                        p.attributeId === ra.attributeId &&
                        String(p.value).trim().length > 0
                    )
                );
                if (missing.length > 0) {
                  toast.error("Vui lòng nhập đầy đủ thuộc tính bắt buộc");
                  return;
                }

                mutateCreate.mutate({
                  ...values,
                  productId,
                  image: finalImage || "",
                });
              })}
            >
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Box className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Tên biến thể <span className="text-red-500">*</span>
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
                          Tên mô tả cho biến thể này (VD: dung lượng, màu sắc)
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
                        <FormDescription>Giá của biến thể này</FormDescription>
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
                        <FormDescription>Số lượng trong kho</FormDescription>
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
                        <FormDescription>Trạng thái hiển thị</FormDescription>
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
                  <h3 className="text-lg font-semibold">Hình ảnh & Cài đặt</h3>
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
                            onCheckedChange={(v) => field.onChange(Boolean(v))}
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <span className="text-sm font-medium">
                              Đặt làm biến thể mặc định
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Biến thể này sẽ được hiển thị đầu tiên khi khách
                              hàng xem sản phẩm
                            </p>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Required Attributes */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">
                    Thuộc tính bắt buộc <span className="text-red-500">*</span>
                  </h3>
                </div>
                <Separator />

                {(Array.isArray(requiredAttrs) ? requiredAttrs : []).length >
                0 ? (
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
                              (form.watch("attributeValues") || []).find(
                                (v: any) => v.attributeId === ra.attributeId
                              )?.value ?? ""
                            }
                            onChange={(e) => {
                              const current =
                                (form.getValues("attributeValues") as any[]) ||
                                [];
                              const idx = current.findIndex(
                                (v) => v.attributeId === ra.attributeId
                              );
                              const updated = [...current];
                              if (idx >= 0)
                                updated[idx] = {
                                  attributeId: ra.attributeId,
                                  value: e.target.value,
                                };
                              else
                                updated.push({
                                  attributeId: ra.attributeId,
                                  value: e.target.value,
                                });
                              form.setValue("attributeValues" as any, updated, {
                                shouldDirty: true,
                              });
                            }}
                            required
                          />
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                            Bắt buộc
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/30">
                    <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Không có thuộc tính bắt buộc cho sản phẩm này</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Vui lòng kiểm tra kỹ thông tin trước khi tạo
                </p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      router.navigate({
                        to: "/admin/products/$id/variants",
                        params: { id },
                      })
                    }
                    disabled={mutateCreate.isPending || isUploading}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    disabled={mutateCreate.isPending || isUploading}
                    size="lg"
                  >
                    {mutateCreate.isPending || isUploading
                      ? "Đang xử lý..."
                      : "Tạo biến thể"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
