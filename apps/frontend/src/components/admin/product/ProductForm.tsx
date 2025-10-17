import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import {
  ProductStatus,
  type CreateProduct,
  type UpdateProduct,
} from "@f5tech/schemas/product";
import ImageUploadPreview from "@/components/ImageUploadPreview";
import { uploadFile } from "@/lib/file";

type ProductFormValues = Omit<CreateProduct, "createdAt" | "id">;

interface ProductFormProps {
  initialValues?: Partial<UpdateProduct>;
  submitLabel?: string;
  onSubmit: (values: ProductFormValues) => void;
  loading?: boolean;
}

export function ProductForm({
  initialValues,
  submitLabel = "Lưu",
  onSubmit,
  loading,
}: ProductFormProps) {
  const trpc = useTRPC();
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [originalThumbnail, setOriginalThumbnail] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: brands = [] as any[] } = useQuery(
    trpc.brands.getAll.queryOptions({ page: 1, limit: 500, search: "" })
  );
  const { data: parentCategories = [] as any[] } = useQuery(
    trpc.categories.getAllParentCategories.queryOptions()
  );

  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: initialValues?.name ?? "",
      slug: initialValues?.slug ?? "",
      description: initialValues?.description ?? "",
      brandId: initialValues?.brandId ?? undefined,
      categoryId: initialValues?.categoryId ?? undefined,
      thumbnail: initialValues?.thumbnail ?? "",
      status: (initialValues?.status as ProductStatus) ?? ProductStatus.ACTIVE,
      price:
        typeof initialValues?.price === "number"
          ? initialValues!.price
          : Number(initialValues?.price ?? 0),
    },
  });

  useEffect(() => {
    form.reset({
      name: initialValues?.name ?? "",
      slug: initialValues?.slug ?? "",
      description: initialValues?.description ?? "",
      brandId: initialValues?.brandId ?? undefined,
      categoryId: initialValues?.categoryId ?? undefined,
      thumbnail: initialValues?.thumbnail ?? "",
      status: (initialValues?.status as ProductStatus) ?? ProductStatus.ACTIVE,
      price:
        typeof initialValues?.price === "number"
          ? initialValues!.price
          : Number(initialValues?.price ?? 0),
    });
    setThumbnailUrl(initialValues?.thumbnail ?? "");
    setOriginalThumbnail(initialValues?.thumbnail ?? "");
    setThumbnailFile(null);
  }, [initialValues, form]);

  const categoryOptions: { id: number; name: string }[] = (() => {
    const list: { id: number; name: string }[] = [];
    const parents = Array.isArray(parentCategories) ? parentCategories : [];
    for (const c of parents) {
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
  })();

  const brandOptions: { id: number; name: string }[] = (
    Array.isArray(brands) ? brands : []
  ).map((b: any) => ({ id: Number(b.id), name: String(b.name) }));

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(async (values) => {
          let finalThumbnail = values.thumbnail?.trim() || thumbnailUrl;
          if (thumbnailFile) {
            setIsUploading(true);
            try {
              finalThumbnail = await uploadFile(thumbnailFile);
            } finally {
              setIsUploading(false);
            }
          } else if (
            thumbnailFile === null &&
            originalThumbnail &&
            !thumbnailUrl.trim() &&
            !values.thumbnail?.trim()
          ) {
            finalThumbnail = "";
          }

          onSubmit({
            ...values,
            price: Number(values.price || 0),
            brandId: values.brandId ? Number(values.brandId) : undefined,
            categoryId: values.categoryId
              ? Number(values.categoryId)
              : undefined,
            thumbnail: finalThumbnail || undefined,
          });
        })}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên sản phẩm</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên sản phẩm" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="nhap-ten-san-pham" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Mô tả ngắn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thương hiệu</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) =>
                    field.onChange(v ? Number(v) : undefined)
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thương hiệu" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Không chọn</SelectItem>
                    {brandOptions.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) =>
                    field.onChange(v ? Number(v) : undefined)
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Không chọn</SelectItem>
                    {categoryOptions.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ProductStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={ProductStatus.INACTIVE}>
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
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh thumbnail</FormLabel>
                <div className="space-y-3">
                  <ImageUploadPreview
                    defaultValue={thumbnailUrl}
                    file={thumbnailFile}
                    onChange={(file) => setThumbnailFile(file)}
                    disabled={isUploading}
                    className="h-32"
                    imageClassName="h-32"
                  />
                  <Input
                    placeholder="Hoặc nhập URL ảnh: https://..."
                    value={field.value ?? thumbnailUrl}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setThumbnailUrl(e.target.value);
                    }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={loading || isUploading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProductForm;
