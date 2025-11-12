import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  DollarSign,
  Image as ImageIcon,
  Info,
  Box,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  VariantStatus,
  type UpdateVariant,
} from "@/types/backend/schemas/variant";

type VariantFormValues = Omit<UpdateVariant, "createdAt">;

interface VariantInfoTabProps {
  productId: number;
  variantId: number;
  variant: any;
}

export function VariantInfoTab({
  productId,
  variantId,
  variant,
}: VariantInfoTabProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

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

  return (
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
              mutateUpdate.mutate({
                ...values,
                image: finalImage || "",
                status: values.status as any,
                price: Number(values.price),
                stock: Number(values.stock),
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
                        value={field.value as any}
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
                      <FormLabel className="text-base">Ảnh biến thể</FormLabel>
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
  );
}

