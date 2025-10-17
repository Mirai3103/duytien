import {
  createFileRoute,
  Link,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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
import { VariantStatus, type UpdateVariant } from "@f5tech/schemas/variant";
import { toast } from "sonner";

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
    })
  );
  const mutateSetAttrs = useMutation(
    trpc.variants.setVariantAttributes.mutationOptions({
      onSuccess: async () => {
        toast.success("Cập nhật thuộc tính thành công");
        await invalidate();
      },
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sửa biến thể (SKU)</h1>
        <Link
          to="/admin/products/$id/variants"
          params={{ id: String(productId) }}
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
                mutateUpdate.mutate({
                  ...values,
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
                          Đặt làm mặc định
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="submit"
                  disabled={mutateUpdate.isPending || isUploading}
                >
                  Lưu
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Giá trị thuộc tính</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                    (variant as any)?.variantValues?.find(
                      (vv: any) => vv.value?.attributeId === ra.attributeId
                    )?.value?.value ?? ""
                  }
                  onChange={(e) => {
                    const vv = ((variant as any)?.variantValues || []) as any[];
                    const idx = vv.findIndex(
                      (x) => x.value?.attributeId === ra.attributeId
                    );
                    const updated = [...vv];
                    if (idx >= 0)
                      updated[idx] = {
                        ...updated[idx],
                        value: { ...updated[idx].value, value: e.target.value },
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
              </div>
            )
          )}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                const list = (((variant as any)?.variantValues || []) as any[])
                  .map((x) => ({
                    attributeId: x.value?.attributeId as number,
                    value: String(x.value?.value ?? ""),
                  }))
                  .filter((x) => x.attributeId && x.value.trim().length > 0);
                mutateSetAttrs.mutate({ variantId, attributeValues: list });
              }}
            >
              Lưu thuộc tính
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
