import {
  createFileRoute,
  Link,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/form";
import ImageUploadPreview from "@/components/ImageUploadPreview";
import { uploadFile } from "@/lib/file";
import { VariantStatus, type CreateVariant } from "@f5tech/schemas/variant";
import { toast } from "sonner";

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
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Thêm biến thể (SKU)</h1>
        <Link
          to="/admin/products/$id/variants"
          params={{ id }}
          className="text-sm underline"
        >
          Quay lại danh sách
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin biến thể</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: 128GB / Đen"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="SKU duy nhất" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step="1000" {...field} />
                      </FormControl>
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
                        <Input type="number" min={0} step="1" {...field} />
                      </FormControl>
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
                            Active
                          </SelectItem>
                          <SelectItem value={VariantStatus.INACTIVE}>
                            Inactive
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ảnh</FormLabel>
                      <div className="space-y-3">
                        <ImageUploadPreview
                          defaultValue={imageUrl}
                          file={imageFile}
                          onChange={(file) => setImageFile(file)}
                          disabled={isUploading}
                          className="h-32"
                          imageClassName="h-32"
                        />
                        <Input
                          placeholder="Hoặc nhập URL ảnh: https://..."
                          value={field.value ?? imageUrl}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setImageUrl(e.target.value);
                          }}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mặc định</FormLabel>
                      <div className="flex items-center gap-2 h-10">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(Boolean(v))}
                        />
                        <span className="text-sm text-muted-foreground">
                          Đặt làm mặc định khi tạo
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Required Attributes */}
              <div className="space-y-3">
                <h3 className="text-base font-medium">Thuộc tính bắt buộc</h3>
                <div className="grid gap-4">
                  {(Array.isArray(requiredAttrs) ? requiredAttrs : []).map(
                    (ra: any) => (
                      <div
                        key={ra.attributeId}
                        className="grid md:grid-cols-3 gap-3 items-center"
                      >
                        <div className="text-sm text-muted-foreground">
                          {ra.attribute?.name}
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
                        />
                        <div className="text-xs text-muted-foreground">
                          Bắt buộc
                        </div>
                      </div>
                    )
                  )}
                  {(!requiredAttrs || requiredAttrs.length === 0) && (
                    <div className="text-sm text-muted-foreground">
                      Không có thuộc tính bắt buộc
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="submit"
                  disabled={mutateCreate.isPending || isUploading}
                >
                  Tạo mới
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
